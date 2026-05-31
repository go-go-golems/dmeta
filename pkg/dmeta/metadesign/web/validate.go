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
		findings = append(findings, validateComponentCompatibility(path, widget)...)
		kind := resolvedComponentKind(widget)
		if kind != "" && !validComponentKind(pkg.ComponentSystem, kind) {
			findings = append(findings, validator.Error("web_meta_design_system", path+".component.level", "unknown_component_kind", fmt.Sprintf("Web widget template %q has unknown component level %q", widgetID, kind), "Use a component level defined by the Web component-system policy."))
		}
		specificity := resolvedSpecificity(widget)
		if specificity != "" && !validSpecificity(pkg.ComponentSystem, specificity) {
			findings = append(findings, validator.Error("web_meta_design_system", path+".component.specificity", "unknown_component_specificity", fmt.Sprintf("Web widget template %q has unknown specificity %q", widgetID, specificity), "Use a specificity value defined by the Web component-system policy."))
		}
		for _, dep := range widget.Composition.Uses {
			if dep.Template == "" {
				continue
			}
			if _, ok := pkg.Widgets[dep.Template]; !ok {
				findings = append(findings, validator.Error("web_meta_design_system", path+".composition.uses", "unknown_component_dependency", fmt.Sprintf("Web widget template %q depends on unknown template %q", widgetID, dep.Template), "Define the dependency in this Web MetaDesignSystem package or fix the composition reference."))
			}
		}
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

func validateComponentCompatibility(path string, widget validator.Widget) []validator.Finding {
	var findings []validator.Finding
	levels := nonEmptyNormalized(map[string]string{
		"component.level":        widget.Component.Level,
		"component_system.kind":  widget.ComponentSystem.Kind,
		"component_system.level": widget.ComponentSystem.Level,
		"classification.kind":    classificationString(widget, "kind"),
		"classification.level":   classificationString(widget, "level"),
	})
	if hasConflictingValues(levels) {
		findings = append(findings, validator.Warning("web_meta_design_system", path+".component.level", "conflicting_component_level", "Widget template defines conflicting component levels across canonical and legacy fields", "Prefer component.level and remove conflicting legacy component_system/classification values during migration."))
	}
	specificities := nonEmptyNormalized(map[string]string{
		"component.specificity":        widget.Component.Specificity,
		"component_system.specificity": widget.ComponentSystem.Specificity,
		"classification.specificity":   classificationString(widget, "specificity"),
	})
	if hasConflictingValues(specificities) {
		findings = append(findings, validator.Warning("web_meta_design_system", path+".component.specificity", "conflicting_component_specificity", "Widget template defines conflicting specificity across canonical and legacy fields", "Prefer component.specificity and remove conflicting legacy values during migration."))
	}
	return findings
}

func resolvedComponentKind(widget validator.Widget) string {
	kind := firstNonEmpty(widget.Component.Level, widget.ComponentSystem.Kind, widget.ComponentSystem.Level, classificationString(widget, "kind"), classificationString(widget, "level"))
	return normalizeComponentKind(kind)
}

func resolvedSpecificity(widget validator.Widget) string {
	return strings.ToLower(strings.TrimSpace(firstNonEmpty(widget.Component.Specificity, widget.ComponentSystem.Specificity, classificationString(widget, "specificity"))))
}

func classificationString(widget validator.Widget, key string) string {
	if widget.Classification == nil {
		return ""
	}
	value, ok := widget.Classification[key].(string)
	if !ok {
		return ""
	}
	return value
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}

func nonEmptyNormalized(values map[string]string) map[string]string {
	out := map[string]string{}
	for key, value := range values {
		if strings.TrimSpace(value) == "" {
			continue
		}
		out[key] = normalizeComponentKind(value)
	}
	return out
}

func hasConflictingValues(values map[string]string) bool {
	seen := ""
	for _, value := range values {
		if seen == "" {
			seen = value
			continue
		}
		if value != seen {
			return true
		}
	}
	return false
}

func normalizeComponentKind(kind string) string {
	return strings.ReplaceAll(strings.ToLower(strings.TrimSpace(kind)), "-", "_")
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
