package pbui

import (
	"fmt"
	"strings"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func ValidatePackage(pkg *Package, interactions *interaction.Package) []validator.Finding {
	var findings []validator.Finding

	findings = append(findings, validateMeta(pkg)...)
	findings = append(findings, validatePresentationTypes(pkg, interactions)...)
	findings = append(findings, validateLoweringRules(pkg, interactions)...)
	findings = append(findings, validateReactTarget(pkg)...)

	return findings
}

func validateMeta(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	if strings.TrimSpace(pkg.Meta.ID) == "" {
		findings = append(findings, validator.Error("pbui_meta_design_system", "id", "missing_meta_design_system_id", "PBUI MetaDesignSystem has no id", "Add a stable id such as pbui."))
	}
	if strings.TrimSpace(pkg.Meta.Summary) == "" {
		findings = append(findings, validator.Warning("pbui_meta_design_system", "summary", "missing_summary", "PBUI MetaDesignSystem has no summary", "Add a concise human-readable summary."))
	}
	if strings.TrimSpace(pkg.Meta.Intent) == "" {
		findings = append(findings, validator.Warning("pbui_meta_design_system", "intent", "missing_intent", "PBUI MetaDesignSystem has no intent text", "Explain why this package exists and how targets should interpret it."))
	}
	return findings
}

func validatePresentationTypes(pkg *Package, interactions *interaction.Package) []validator.Finding {
	var findings []validator.Finding
	if len(pkg.PresentationTypes.PresentationTypes) == 0 {
		return append(findings, validator.Error("pbui_presentation_types", "presentation_types", "no_presentation_types", "PBUI presentation type catalog is empty", "Add at least one presentation type."))
	}
	for _, duplicateID := range pkg.DuplicatePresentationTypeIDs {
		findings = append(findings, validator.Error("pbui_presentation_types", "presentation_types", "duplicate_presentation_type_id", fmt.Sprintf("duplicate PBUI presentation type id %q", duplicateID), "Use unique presentation type ids so generated registries and provenance are deterministic."))
	}

	for id, presentationType := range pkg.PresentationTypes.PresentationTypes {
		path := fmt.Sprintf("presentation_types.%s", id)
		if strings.TrimSpace(id) == "" {
			findings = append(findings, validator.Error("pbui_presentation_types", "presentation_types", "empty_presentation_type_id", "PBUI presentation type id is empty", "Use stable ids such as pbui.presentation_ref."))
		}
		if strings.TrimSpace(presentationType.Summary) == "" {
			findings = append(findings, validator.Warning("pbui_presentation_types", path+".summary", "missing_summary", fmt.Sprintf("PBUI presentation type %q has no summary", id), "Add a short natural-language summary."))
		}
		if strings.TrimSpace(presentationType.Intent) == "" {
			findings = append(findings, validator.Warning("pbui_presentation_types", path+".intent", "missing_intent", fmt.Sprintf("PBUI presentation type %q has no intent", id), "Explain why this presentation type exists."))
		}
		if strings.TrimSpace(presentationType.Description) == "" {
			findings = append(findings, validator.Warning("pbui_presentation_types", path+".description", "missing_description", fmt.Sprintf("PBUI presentation type %q has no description", id), "Add implementation-facing explanation text."))
		}
		if strings.TrimSpace(presentationType.Presenter.Intent) == "" {
			findings = append(findings, validator.Warning("pbui_presentation_types", path+".presenter.intent", "missing_presenter_intent", fmt.Sprintf("PBUI presentation type %q has no presenter intent", id), "Explain how domain/action state should project into the presentation."))
		}
		if strings.TrimSpace(presentationType.Recognizer.Intent) == "" {
			findings = append(findings, validator.Warning("pbui_presentation_types", path+".recognizer.intent", "missing_recognizer_intent", fmt.Sprintf("PBUI presentation type %q has no recognizer intent", id), "Explain how interactions should become action requests."))
		}
		for _, representationID := range presentationType.Realizes.Representations {
			findings = append(findings, validateRepresentationReference(interactions, "pbui_presentation_types", path+".realizes.representations", id, representationID)...)
		}
		for _, actionID := range presentationType.Realizes.Actions {
			findings = append(findings, validateActionReference(interactions, "pbui_presentation_types", path+".realizes.actions", id, actionID)...)
		}
	}
	return findings
}

func validateLoweringRules(pkg *Package, interactions *interaction.Package) []validator.Finding {
	var findings []validator.Finding
	seen := map[string]bool{}
	for i, rule := range pkg.LoweringRules.Rules {
		path := fmt.Sprintf("rules[%d]", i)
		if strings.TrimSpace(rule.ID) == "" {
			findings = append(findings, validator.Error("pbui_lowering_rules", path+".id", "missing_rule_id", "PBUI lowering rule has no id", "Add a stable lowering rule id."))
		} else if seen[rule.ID] {
			findings = append(findings, validator.Error("pbui_lowering_rules", path+".id", "duplicate_rule_id", fmt.Sprintf("duplicate PBUI lowering rule id %q", rule.ID), "Use unique rule ids."))
		} else {
			seen[rule.ID] = true
		}
		if strings.TrimSpace(rule.Description) == "" {
			findings = append(findings, validator.Warning("pbui_lowering_rules", path+".description", "missing_description", fmt.Sprintf("PBUI lowering rule %q has no description", rule.ID), "Add a concise description of what the rule lowers."))
		}
		if strings.TrimSpace(rule.Rationale) == "" {
			findings = append(findings, validator.Warning("pbui_lowering_rules", path+".rationale", "missing_rationale", fmt.Sprintf("PBUI lowering rule %q has no rationale", rule.ID), "Explain why the presentation obligation should exist."))
		}
		if strings.TrimSpace(rule.PresenterIntent) == "" {
			findings = append(findings, validator.Warning("pbui_lowering_rules", path+".presenter_intent", "missing_presenter_intent", fmt.Sprintf("PBUI lowering rule %q has no presenter intent", rule.ID), "Explain the target presenter/projection expectation."))
		}
		if strings.TrimSpace(rule.RecognizerIntent) == "" {
			findings = append(findings, validator.Warning("pbui_lowering_rules", path+".recognizer_intent", "missing_recognizer_intent", fmt.Sprintf("PBUI lowering rule %q has no recognizer intent", rule.ID), "Explain the target recognizer/event expectation."))
		}
		if len(rule.Emits.PresentationTypes) == 0 {
			findings = append(findings, validator.Warning("pbui_lowering_rules", path+".emits.presentation_types", "no_emitted_presentations", fmt.Sprintf("PBUI lowering rule %q emits no presentation types", rule.ID), "Add at least one presentation type or remove the rule."))
		}
		for _, presentationTypeID := range rule.Emits.PresentationTypes {
			if _, ok := pkg.PresentationTypes.PresentationTypes[presentationTypeID]; !ok {
				findings = append(findings, validator.Error("pbui_lowering_rules", path+".emits.presentation_types", "unknown_presentation_type", fmt.Sprintf("PBUI lowering rule %q emits unknown presentation type %q", rule.ID, presentationTypeID), "Define the PBUI presentation type or fix the rule."))
			}
		}
		for _, representationID := range rule.When.Representations {
			findings = append(findings, validateRepresentationReference(interactions, "pbui_lowering_rules", path+".when.representations", rule.ID, representationID)...)
		}
		for _, actionID := range rule.When.Actions {
			findings = append(findings, validateActionReference(interactions, "pbui_lowering_rules", path+".when.actions", rule.ID, actionID)...)
		}
	}
	return findings
}

func validateReactTarget(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	if strings.TrimSpace(pkg.ReactTarget.ID) == "" {
		findings = append(findings, validator.Error("pbui_react_target", "id", "missing_target_id", "PBUI React target has no id", "Add target id react."))
	}
	if strings.TrimSpace(pkg.ReactTarget.Intent) == "" {
		findings = append(findings, validator.Warning("pbui_react_target", "intent", "missing_intent", "PBUI React target has no intent", "Explain how React should compile PBUI concepts."))
	}
	if strings.TrimSpace(pkg.ReactTarget.Defaults.OutputDir) == "" {
		findings = append(findings, validator.Warning("pbui_react_target", "defaults.output_dir", "missing_output_dir", "PBUI React target has no default output directory", "Set generated/pbui-react or another target-owned output path."))
	}
	if pkg.ReactTarget.Provenance.MetaDesignSystem != "pbui" {
		findings = append(findings, validator.Warning("pbui_react_target", "provenance.meta_design_system", "unexpected_meta_design_system", fmt.Sprintf("PBUI React target provenance meta_design_system is %q", pkg.ReactTarget.Provenance.MetaDesignSystem), "Use pbui unless this target intentionally belongs to another MetaDesignSystem."))
	}
	return findings
}

func validateRepresentationReference(interactions *interaction.Package, artifact, path, ownerID, representationID string) []validator.Finding {
	if strings.TrimSpace(representationID) == "" {
		return []validator.Finding{validator.Error(artifact, path, "empty_representation", fmt.Sprintf("%q references an empty representation id", ownerID), "Remove the empty id or replace it with a concrete Interaction IR representation.")}
	}
	representation, ok := interactions.Representations.Representations[representationID]
	if !ok {
		return []validator.Finding{validator.Error(artifact, path, "unknown_representation", fmt.Sprintf("%q references unknown representation %q", ownerID, representationID), "Define the Interaction IR representation or fix the PBUI reference.")}
	}
	if representation.Abstract {
		return []validator.Finding{validator.Error(artifact, path, "abstract_representation", fmt.Sprintf("%q references abstract representation %q", ownerID, representationID), "Reference a concrete Interaction IR representation.")}
	}
	return nil
}

func validateActionReference(interactions *interaction.Package, artifact, path, ownerID, actionID string) []validator.Finding {
	if strings.TrimSpace(actionID) == "" {
		return []validator.Finding{validator.Error(artifact, path, "empty_action", fmt.Sprintf("%q references an empty action id", ownerID), "Remove the empty id or replace it with a concrete Interaction IR action.")}
	}
	action, ok := interactions.ActionsFile.Actions[actionID]
	if !ok {
		return []validator.Finding{validator.Error(artifact, path, "unknown_action", fmt.Sprintf("%q references unknown action %q", ownerID, actionID), "Define the Interaction IR action or fix the PBUI reference.")}
	}
	if action.Abstract {
		return []validator.Finding{validator.Error(artifact, path, "abstract_action", fmt.Sprintf("%q references abstract action %q", ownerID, actionID), "Reference a concrete Interaction IR action.")}
	}
	return nil
}
