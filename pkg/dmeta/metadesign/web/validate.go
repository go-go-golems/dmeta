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
			if _, ok := pkg.Widgets[widgetID]; !ok {
				findings = append(findings, validator.Error("web_meta_design_system", path+".emits.widget_templates", "unknown_widget_template", fmt.Sprintf("Web lowering rule %q emits unknown widget template %q", rule.ID, widgetID), "Define the Web widget template in this MetaDesignSystem package or fix the rule."))
			}
		}
	}
	for widgetID, widget := range pkg.Widgets {
		path := fmt.Sprintf("widgets[%s]", widgetID)
		kind := widget.ComponentSystem.Kind
		if kind == "" {
			kind = widget.ComponentSystem.Level
		}
		if kind != "" && !validComponentKind(kind) {
			findings = append(findings, validator.Error("web_meta_design_system", path+".component_system.kind", "unknown_component_kind", fmt.Sprintf("Web widget template %q has unknown component kind %q", widgetID, kind), "Use atom, molecule, organism, rich_widget, page, or component."))
		}
		if widget.ComponentSystem.Specificity != "" && !validSpecificity(widget.ComponentSystem.Specificity) {
			findings = append(findings, validator.Error("web_meta_design_system", path+".component_system.specificity", "unknown_component_specificity", fmt.Sprintf("Web widget template %q has unknown specificity %q", widgetID, widget.ComponentSystem.Specificity), "Use generic, brand, domain, or app."))
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

func validComponentKind(kind string) bool {
	switch strings.ReplaceAll(strings.ToLower(kind), "-", "_") {
	case "atom", "molecule", "organism", "rich_widget", "page", "component":
		return true
	default:
		return false
	}
}

func validSpecificity(specificity string) bool {
	switch strings.ToLower(specificity) {
	case "generic", "brand", "domain", "app":
		return true
	default:
		return false
	}
}
