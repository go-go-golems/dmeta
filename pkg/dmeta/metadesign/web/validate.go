package web

import (
	"fmt"

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
	return findings
}
