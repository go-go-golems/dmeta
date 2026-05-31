package web

import (
	"fmt"
	"strings"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func ValidatePackage(pkg *Package, interactions *interaction.Package) []validator.Finding {
	var findings []validator.Finding
	seen := map[string]bool{}
	for i, rule := range pkg.LoweringRules.Rules {
		path := fmt.Sprintf("lowering_rules[%d]", i)
		if rule.ID == "" {
			findings = append(findings, validator.Error("web_meta_design_system", path+".id", "missing_rule_id", "Web lowering rule has no id", "Add a stable rule id."))
		} else if seen[rule.ID] {
			findings = append(findings, validator.Error("web_meta_design_system", path+".id", "duplicate_rule_id", fmt.Sprintf("duplicate Web lowering rule id %q", rule.ID), "Use unique rule ids."))
		} else {
			seen[rule.ID] = true
		}
		if len(rule.Emits.WidgetTemplates) == 0 {
			findings = append(findings, validator.Warning("web_meta_design_system", path+".emits.widget_templates", "no_emitted_widgets", fmt.Sprintf("Web lowering rule %q emits no widget templates", rule.ID), "Add at least one widget template or remove the rule."))
		}
		for _, representationID := range rule.When.Representations {
			representation, ok := interactions.Representations.Representations[representationID]
			if !ok {
				findings = append(findings, validator.Error("web_meta_design_system", path+".when.representations", "unknown_representation", fmt.Sprintf("Web lowering rule %q references unknown representation %q", rule.ID, representationID), "Define the Interaction IR representation or fix the rule."))
				continue
			}
			if representation.Abstract {
				findings = append(findings, validator.Error("web_meta_design_system", path+".when.representations", "abstract_representation", fmt.Sprintf("Web lowering rule %q references abstract representation %q", rule.ID, representationID), "Reference a concrete Interaction IR representation."))
			}
		}
		for _, actionID := range rule.When.Actions {
			action, ok := interactions.ActionsFile.Actions[actionID]
			if !ok {
				findings = append(findings, validator.Error("web_meta_design_system", path+".when.actions", "unknown_action", fmt.Sprintf("Web lowering rule %q references unknown action %q", rule.ID, actionID), "Define the Interaction IR action or fix the rule."))
				continue
			}
			if action.Abstract {
				findings = append(findings, validator.Error("web_meta_design_system", path+".when.actions", "abstract_action", fmt.Sprintf("Web lowering rule %q references abstract action %q", rule.ID, actionID), "Reference a concrete Interaction IR action."))
			}
		}
		for _, actionID := range rule.Emits.EventBindings {
			if actionID == "" {
				continue
			}
			action, ok := interactions.ActionsFile.Actions[actionID]
			if !ok {
				findings = append(findings, validator.Error("web_meta_design_system", path+".emits.event_bindings", "unknown_event_binding", fmt.Sprintf("Web lowering rule %q emits unknown event binding %q", rule.ID, actionID), "Event bindings must reference Interaction IR actions."))
				continue
			}
			if action.Abstract {
				findings = append(findings, validator.Error("web_meta_design_system", path+".emits.event_bindings", "abstract_event_binding", fmt.Sprintf("Web lowering rule %q emits abstract event binding %q", rule.ID, actionID), "Bind a concrete Interaction IR action."))
			}
		}
		for _, widgetID := range rule.Emits.WidgetTemplates {
			widget, ok := pkg.Widgets[widgetID]
			if !ok {
				findings = append(findings, validator.Error("web_meta_design_system", path+".emits.widget_templates", "unknown_widget_template", fmt.Sprintf("Web lowering rule %q emits unknown widget template %q", rule.ID, widgetID), "Define the Web widget template in this MetaDesignSystem package or fix the rule."))
				continue
			}
			level := resolvedComponentKind(widget)
			if isDependencyOnlyLevel(pkg.ComponentSystem, level) && shouldWarnDependencyOnlyEmits(pkg.ComponentSystem) {
				findings = append(findings, validator.Warning("web_meta_design_system", path+".emits.widget_templates", "lowering_emits_dependency_only_component", fmt.Sprintf("Web lowering rule %q emits %q at dependency-only component level %q", rule.ID, widgetID, level), "Prefer emitting an organism, rich_widget, or page and include atoms/molecules through composition.uses."))
			}
		}
	}
	findings = append(findings, validateComponentSystemPolicy(pkg)...)
	for widgetID, widget := range pkg.Widgets {
		path := fmt.Sprintf("widgets[%s]", widgetID)
		findings = append(findings, validateWidgetRepresentationReferences(interactions, path, widgetID, widget)...)
		findings = append(findings, validateCanonicalComponentFields(pkg, path, widgetID, widget)...)
		findings = append(findings, validateCompositionEdges(pkg, path, widgetID, widget)...)
		for eventName, event := range widget.Contract.Events {
			if event.ActionRef == "" {
				continue
			}
			if _, ok := interactions.ActionsFile.Actions[event.ActionRef]; !ok {
				findings = append(findings, validator.Error("web_meta_design_system", path+".contract.events."+eventName+".action_ref", "unknown_event_action", fmt.Sprintf("Web widget template %q event %q references unknown action %q", widgetID, eventName, event.ActionRef), "Define the Interaction IR action or fix the event action_ref."))
			}
		}
		for slotName, slot := range widget.Contract.ActionSlots {
			if slot.ActionRef == "" {
				continue
			}
			if _, ok := interactions.ActionsFile.Actions[slot.ActionRef]; !ok {
				findings = append(findings, validator.Error("web_meta_design_system", path+".contract.action_slots."+slotName+".action_ref", "unknown_action_slot_action", fmt.Sprintf("Web widget template %q action slot %q references unknown action %q", widgetID, slotName, slot.ActionRef), "Define the Interaction IR action or fix the action slot action_ref."))
			}
		}
	}
	findings = append(findings, validateCompositionCycles(pkg)...)
	return findings
}

func validateWidgetRepresentationReferences(interactions *interaction.Package, path string, widgetID string, widget validator.Widget) []validator.Finding {
	if interactions == nil {
		return nil
	}
	var findings []validator.Finding
	for _, representationID := range widget.Consumes.Representations {
		representation, ok := interactions.Representations.Representations[representationID]
		if !ok {
			findings = append(findings, validator.Error("web_meta_design_system", path+".consumes.representations", "unknown_consumed_representation", fmt.Sprintf("Web widget template %q consumes unknown Interaction IR representation %q", widgetID, representationID), "Define the representation in Interaction IR or fix consumes.representations."))
			continue
		}
		if representation.Abstract {
			findings = append(findings, validator.Error("web_meta_design_system", path+".consumes.representations", "abstract_consumed_representation", fmt.Sprintf("Web widget template %q consumes abstract Interaction IR representation %q", widgetID, representationID), "Reference a concrete Interaction IR representation."))
		}
	}
	for _, representationID := range widget.SemanticContext.Representations {
		representation, ok := interactions.Representations.Representations[representationID]
		if !ok {
			findings = append(findings, validator.Error("web_meta_design_system", path+".semantic_context.representations", "unknown_semantic_context_representation", fmt.Sprintf("Web widget template %q semantic_context references unknown Interaction IR representation %q", widgetID, representationID), "Define the representation in Interaction IR or fix semantic_context.representations."))
			continue
		}
		if representation.Abstract {
			findings = append(findings, validator.Error("web_meta_design_system", path+".semantic_context.representations", "abstract_semantic_context_representation", fmt.Sprintf("Web widget template %q semantic_context references abstract Interaction IR representation %q", widgetID, representationID), "Reference a concrete Interaction IR representation."))
		}
	}
	return findings
}

func validateComponentSystemPolicy(pkg *Package) []validator.Finding {
	if pkg.ComponentSystem == nil {
		return nil
	}
	var findings []validator.Finding
	if len(pkg.ComponentSystem.Levels) == 0 {
		findings = append(findings, validator.Error("web_component_system", "component_system.levels", "missing_component_levels", "Web component-system policy defines no levels", "Add levels such as atom, molecule, organism, rich_widget, and page."))
	}
	for levelID, level := range pkg.ComponentSystem.Levels {
		path := "component_system.levels." + levelID
		if strings.TrimSpace(level.Description) == "" {
			findings = append(findings, validator.Warning("web_component_system", path+".description", "missing_level_description", fmt.Sprintf("Web component level %q has no description", levelID), "Explain what this component level owns."))
		}
		for _, child := range level.AllowedChildren {
			if _, ok := pkg.ComponentSystem.Levels[normalizeComponentKind(child)]; !ok {
				findings = append(findings, validator.Error("web_component_system", path+".allowed_children", "unknown_allowed_child_level", fmt.Sprintf("Web component level %q allows unknown child level %q", levelID, child), "Allowed children must reference known component-system levels."))
			}
		}
	}
	return findings
}

func validateCanonicalComponentFields(pkg *Package, path string, widgetID string, widget validator.Widget) []validator.Finding {
	var findings []validator.Finding
	level := resolvedComponentKind(widget)
	if level == "" {
		findings = append(findings, validator.Error("web_meta_design_system", path+".component.level", "missing_component_level", fmt.Sprintf("Web widget template %q has no canonical component.level", widgetID), "Add component.level; do not use legacy classification or component_system fields."))
	} else if !validComponentKind(pkg.ComponentSystem, level) {
		findings = append(findings, validator.Error("web_meta_design_system", path+".component.level", "unknown_component_kind", fmt.Sprintf("Web widget template %q has unknown component level %q", widgetID, level), "Use a component level defined by the Web component-system policy."))
	}

	role := strings.TrimSpace(widget.Component.Role)
	if role == "" {
		findings = append(findings, validator.Error("web_meta_design_system", path+".component.role", "missing_component_role", fmt.Sprintf("Web widget template %q has no canonical component.role", widgetID), "Add a stable machine-readable component.role."))
	}

	specificity := strings.ToLower(strings.TrimSpace(widget.Component.Specificity))
	if specificity == "" {
		findings = append(findings, validator.Error("web_meta_design_system", path+".component.specificity", "missing_component_specificity", fmt.Sprintf("Web widget template %q has no canonical component.specificity", widgetID), "Add component.specificity such as generic, brand, domain, or app."))
	} else if !validSpecificity(pkg.ComponentSystem, specificity) {
		findings = append(findings, validator.Error("web_meta_design_system", path+".component.specificity", "unknown_component_specificity", fmt.Sprintf("Web widget template %q has unknown specificity %q", widgetID, specificity), "Use a specificity value defined by the Web component-system policy."))
	}

	if strings.TrimSpace(widget.Component.GenerationPolicy) == "" {
		findings = append(findings, validator.Error("web_meta_design_system", path+".component.generation_policy", "missing_component_generation_policy", fmt.Sprintf("Web widget template %q has no canonical component.generation_policy", widgetID), "Add component.generation_policy or choose the level default from component-system.yaml."))
	}
	if strings.TrimSpace(widget.Intent.Purpose) == "" {
		findings = append(findings, validator.Error("web_meta_design_system", path+".intent.purpose", "missing_component_intent_purpose", fmt.Sprintf("Web widget template %q has no intent.purpose", widgetID), "Explain what this Web component renders."))
	}
	if strings.TrimSpace(widget.Intent.AdapterBoundary) == "" {
		findings = append(findings, validator.Error("web_meta_design_system", path+".intent.adapter_boundary", "missing_component_adapter_boundary", fmt.Sprintf("Web widget template %q has no intent.adapter_boundary", widgetID), "Explain normalized inputs, callbacks/actions, and ownership boundaries."))
	}
	return findings
}

func validateCompositionEdges(pkg *Package, path string, widgetID string, widget validator.Widget) []validator.Finding {
	var findings []validator.Finding
	for i, dep := range widget.Composition.Uses {
		depPath := fmt.Sprintf("%s.composition.uses[%d]", path, i)
		if strings.TrimSpace(dep.Template) == "" {
			findings = append(findings, validator.Error("web_meta_design_system", depPath+".template", "missing_component_dependency_template", fmt.Sprintf("Web widget template %q has a composition edge with no template", widgetID), "Set composition.uses[].template to a known Web widget template id."))
			continue
		}
		child, ok := pkg.Widgets[dep.Template]
		if !ok {
			findings = append(findings, validator.Error("web_meta_design_system", depPath+".template", "unknown_component_dependency", fmt.Sprintf("Web widget template %q depends on unknown template %q", widgetID, dep.Template), "Define the dependency in this Web MetaDesignSystem package or fix the composition reference."))
		} else if !componentLevelAllowsChild(pkg.ComponentSystem, resolvedComponentKind(widget), resolvedComponentKind(child)) {
			findings = append(findings, validator.Error("web_meta_design_system", depPath+".template", "disallowed_component_child_level", fmt.Sprintf("Web widget template %q at level %q may not compose child %q at level %q", widgetID, resolvedComponentKind(widget), dep.Template, resolvedComponentKind(child)), "Update component-system.yaml allowed_children or choose a dependency at an allowed level."))
		}
		if strings.TrimSpace(dep.Role) == "" {
			findings = append(findings, validator.Error("web_meta_design_system", depPath+".role", "missing_component_dependency_role", fmt.Sprintf("Web widget template %q has a composition edge to %q with no role", widgetID, dep.Template), "Add composition.uses[].role to explain the child role."))
		}
		if strings.TrimSpace(dep.Description) == "" {
			findings = append(findings, validator.Error("web_meta_design_system", depPath+".description", "missing_component_dependency_description", fmt.Sprintf("Web widget template %q has a composition edge to %q with no description", widgetID, dep.Template), "Add composition.uses[].description to explain why this dependency exists."))
		}
	}
	return findings
}

func validateCompositionCycles(pkg *Package) []validator.Finding {
	if pkg.ComponentSystem != nil && !pkg.ComponentSystem.CompositionRules.ForbidCycles {
		return nil
	}
	var findings []validator.Finding
	visiting := map[string]bool{}
	visited := map[string]bool{}
	var stack []string
	var visit func(string)
	visit = func(id string) {
		if visiting[id] {
			cycle := append(stack, id)
			findings = append(findings, validator.Error("web_meta_design_system", "composition.uses", "component_composition_cycle", fmt.Sprintf("Web component composition contains a cycle: %s", strings.Join(cycle, " -> ")), "Remove the cyclic composition edge or split the shared dependency into a lower-level component."))
			return
		}
		if visited[id] {
			return
		}
		widget, ok := pkg.Widgets[id]
		if !ok {
			return
		}
		visiting[id] = true
		stack = append(stack, id)
		for _, dep := range widget.Composition.Uses {
			if dep.Template != "" {
				visit(dep.Template)
			}
		}
		stack = stack[:len(stack)-1]
		visiting[id] = false
		visited[id] = true
	}
	for id := range pkg.Widgets {
		visit(id)
	}
	return findings
}

func resolvedComponentKind(widget validator.Widget) string {
	return normalizeComponentKind(widget.Component.Level)
}

func normalizeComponentKind(kind string) string {
	return strings.ReplaceAll(strings.ToLower(strings.TrimSpace(kind)), "-", "_")
}

func componentLevelAllowsChild(policy *ComponentSystemFile, parent string, child string) bool {
	parent = normalizeComponentKind(parent)
	child = normalizeComponentKind(child)
	if parent == "" || child == "" || policy == nil || len(policy.Levels) == 0 {
		return true
	}
	parentLevel, ok := policy.Levels[parent]
	if !ok {
		return true
	}
	for _, allowedChild := range parentLevel.AllowedChildren {
		if normalizeComponentKind(allowedChild) == child {
			return true
		}
	}
	return false
}

func validComponentKind(policy *ComponentSystemFile, kind string) bool {
	kind = normalizeComponentKind(kind)
	if policy != nil && len(policy.Levels) > 0 {
		_, ok := policy.Levels[kind]
		return ok
	}
	switch kind {
	case "atom", "molecule", "organism", "rich_widget", "page", "component":
		return true
	default:
		return false
	}
}

func validSpecificity(policy *ComponentSystemFile, specificity string) bool {
	specificity = strings.ToLower(strings.TrimSpace(specificity))
	if policy != nil && len(policy.Specificity.Allowed) > 0 {
		for _, allowed := range policy.Specificity.Allowed {
			if strings.ToLower(strings.TrimSpace(allowed)) == specificity {
				return true
			}
		}
		return false
	}
	switch specificity {
	case "generic", "brand", "domain", "app":
		return true
	default:
		return false
	}
}

func isDependencyOnlyLevel(policy *ComponentSystemFile, level string) bool {
	level = normalizeComponentKind(level)
	if level == "" {
		return false
	}
	if policy != nil {
		for _, dependencyOnlyLevel := range policy.LoweringRules.DependencyOnlyLevels {
			if normalizeComponentKind(dependencyOnlyLevel) == level {
				return true
			}
		}
		if policyLevel, ok := policy.Levels[level]; ok {
			return !policyLevel.CanBeEmittedByLowering
		}
	}
	return level == "atom" || level == "molecule"
}

func shouldWarnDependencyOnlyEmits(policy *ComponentSystemFile) bool {
	return policy == nil || policy.LoweringRules.WarnWhenEmittingDependencyOnlyLevel
}
