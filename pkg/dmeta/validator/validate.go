package validator

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
)

var knownArgumentModes = map[string]bool{
	"selected_presentation":  true,
	"presentation_candidate": true,
	"free_text":              true,
	"number_input":           true,
	"choice":                 true,
	"confirmation":           true,
	"parameter_form":         true,
}

var knownSeverities = map[string]bool{
	SeverityInfo:    true,
	SeverityWarning: true,
	SeverityError:   true,
}

func ValidateRoot(ctx context.Context, root string, includeInfo bool) ([]Finding, error) {
	pkg, err := LoadPackage(ctx, root)
	if err != nil {
		return nil, err
	}
	findings := ValidatePackage(pkg)
	if includeInfo && !HasErrors(findings) {
		findings = append(findings, Info("package", "", "validation_ok", "DMETA IR package has no error-severity findings", ""))
	}
	return findings, nil
}

func ValidatePackage(pkg *Package) []Finding {
	var findings []Finding
	findings = append(findings, validateArtifactIdentity(pkg)...)
	findings = append(findings, validateIndex(pkg)...)
	findings = append(findings, validateCoreModel(pkg)...)
	findings = append(findings, validateDesignLanguage(pkg)...)
	findings = append(findings, validateWidgets(pkg)...)
	return findings
}

func validateArtifactIdentity(pkg *Package) []Finding {
	var findings []Finding
	checks := []struct {
		artifact string
		path     string
		got      string
		want     string
		version  int
	}{
		{"index", "artifact_type", pkg.Index.ArtifactType, "dmeta_ir_index", pkg.Index.SchemaVersion},
		{"core_model", "artifact_type", pkg.CoreModel.ArtifactType, "dmeta_core_model", pkg.CoreModel.SchemaVersion},
		{"design_language", "artifact_type", pkg.DesignLanguage.ArtifactType, "dmeta_design_language", pkg.DesignLanguage.SchemaVersion},
		{"widgets", "artifact_type", pkg.Widgets.ArtifactType, "dmeta_widget_ir", pkg.Widgets.SchemaVersion},
	}
	for _, c := range checks {
		if c.got != c.want {
			findings = append(findings, Error(c.artifact, c.path, "artifact_type_mismatch", fmt.Sprintf("artifact type is %q, expected %q", c.got, c.want), "Check the top-level artifact_type field."))
		}
		if c.version != 0 {
			findings = append(findings, Error(c.artifact, "schema_version", "schema_version_mismatch", fmt.Sprintf("schema version is %d, expected 0", c.version), "Update the validator or set schema_version to 0 for DMETA v0."))
		}
	}
	return findings
}

func validateIndex(pkg *Package) []Finding {
	var findings []Finding
	expected := map[string]string{
		"core_model":      "dmeta_core_model",
		"design_language": "dmeta_design_language",
		"widgets":         "dmeta_widget_ir",
	}
	loadedTypes := map[string]string{
		"core_model":      pkg.CoreModel.ArtifactType,
		"design_language": pkg.DesignLanguage.ArtifactType,
		"widgets":         pkg.Widgets.ArtifactType,
	}
	for key, expectedType := range expected {
		artifact, ok := pkg.Index.Artifacts[key]
		if !ok {
			findings = append(findings, Error("index", "artifacts."+key, "missing_index_artifact", fmt.Sprintf("index is missing artifact entry %q", key), "Add this artifact to 00-index.yaml."))
			continue
		}
		if artifact.ArtifactType != expectedType {
			findings = append(findings, Error("index", "artifacts."+key+".artifact_type", "index_artifact_type_mismatch", fmt.Sprintf("index declares %q for %s, expected %q", artifact.ArtifactType, key, expectedType), "Fix artifact_type in 00-index.yaml."))
		}
		if loadedTypes[key] != "" && artifact.ArtifactType != loadedTypes[key] {
			findings = append(findings, Error("index", "artifacts."+key+".artifact_type", "loaded_artifact_type_mismatch", fmt.Sprintf("index declares %q but loaded file declares %q", artifact.ArtifactType, loadedTypes[key]), "Make 00-index.yaml match the loaded artifact file."))
		}
		if artifact.Path == "" {
			findings = append(findings, Error("index", "artifacts."+key+".path", "missing_artifact_path", fmt.Sprintf("artifact %q has no path", key), "Add a relative path."))
			continue
		}
		path := filepath.Clean(filepath.Join(pkg.Root, artifact.Path))
		if _, err := os.Stat(path); err != nil {
			findings = append(findings, Error("index", "artifacts."+key+".path", "missing_artifact_file", fmt.Sprintf("artifact file %q does not exist", artifact.Path), "Fix the path or create the file."))
		}
	}
	return findings
}

func validateCoreModel(pkg *Package) []Finding {
	var findings []Finding
	core := pkg.CoreModel

	if core.LongSummary == "" {
		findings = append(findings, Warning("core_model", "long_summary", "missing_long_summary", "core model package has no long_summary", "Add prose context explaining how to understand and edit the split core model."))
	}

	for id, arch := range core.Archetypes {
		if arch.LongDescription == "" {
			findings = append(findings, Warning("core_model", fmt.Sprintf("archetypes.%s.long_description", id), "missing_long_description", fmt.Sprintf("archetype %q has no long_description", id), "Add a prose explanation with examples, boundaries, and UI implications."))
		}
		for _, capID := range arch.DefaultCapabilities {
			if _, ok := core.Capabilities[capID]; !ok {
				findings = append(findings, Error("core_model", fmt.Sprintf("archetypes.%s.default_capabilities.%s", id, capID), "unknown_capability", fmt.Sprintf("archetype %q references unknown capability %q", id, capID), "Define the capability or remove the reference."))
			}
		}
		for _, presID := range arch.RecommendedPresentations {
			if _, ok := core.Presentations[presID]; !ok {
				findings = append(findings, Error("core_model", fmt.Sprintf("archetypes.%s.recommended_presentations.%s", id, presID), "unknown_presentation", fmt.Sprintf("archetype %q recommends unknown presentation %q", id, presID), "Define the presentation or remove the reference."))
			}
		}
	}

	logicalTypes := setFromSlice(core.LogicalTypes.Primitives)
	for _, t := range core.LogicalTypes.Collections {
		logicalTypes[t] = true
	}
	for capID, cap := range core.Capabilities {
		if cap.LongDescription == "" {
			findings = append(findings, Warning("core_model", fmt.Sprintf("capabilities.%s.long_description", capID), "missing_long_description", fmt.Sprintf("capability %q has no long_description", capID), "Add a prose explanation with examples, consumers, and UI implications."))
		}
		if len(cap.Projections) == 0 {
			findings = append(findings, Warning("core_model", fmt.Sprintf("capabilities.%s.projections", capID), "capability_without_projections", fmt.Sprintf("capability %q has no projections", capID), "Capabilities should contribute projections or a documented consumer."))
		}
		for projID, proj := range cap.Projections {
			if proj.Type == "" {
				findings = append(findings, Error("core_model", fmt.Sprintf("capabilities.%s.projections.%s.type", capID, projID), "missing_projection_type", fmt.Sprintf("projection %s.%s has no type", capID, projID), "Add a logical type."))
			} else if len(logicalTypes) > 0 && !logicalTypes[proj.Type] {
				findings = append(findings, Warning("core_model", fmt.Sprintf("capabilities.%s.projections.%s.type", capID, projID), "unknown_logical_type", fmt.Sprintf("projection %s.%s uses unknown logical type %q", capID, projID, proj.Type), "Add it to logical_types or fix the type."))
			}
		}
		for _, presID := range cap.Presentations {
			if _, ok := core.Presentations[presID]; !ok {
				findings = append(findings, Error("core_model", fmt.Sprintf("capabilities.%s.presentations.%s", capID, presID), "unknown_presentation", fmt.Sprintf("capability %q references unknown presentation %q", capID, presID), "Define the presentation or remove the reference."))
			}
		}
		for _, actionID := range cap.Actions {
			if _, ok := core.Actions[actionID]; !ok {
				findings = append(findings, Error("core_model", fmt.Sprintf("capabilities.%s.actions.%s", capID, actionID), "unknown_action", fmt.Sprintf("capability %q references unknown action %q", capID, actionID), "Define the action or remove the reference."))
			}
		}
	}

	for presID, pres := range core.Presentations {
		if !knownPresentationLayer(pres.Layer) {
			findings = append(findings, Error("core_model", fmt.Sprintf("presentations.%s.layer", presID), "unknown_presentation_layer", fmt.Sprintf("presentation %q has invalid layer %q", presID, pres.Layer), "Use capability, archetype, or domain."))
		}
		for _, capID := range pres.AppliesTo.Capabilities {
			if _, ok := core.Capabilities[capID]; !ok {
				findings = append(findings, Error("core_model", fmt.Sprintf("presentations.%s.applies_to.capabilities.%s", presID, capID), "unknown_capability", fmt.Sprintf("presentation %q applies to unknown capability %q", presID, capID), "Define the capability or remove the reference."))
			}
		}
		for _, archID := range pres.AppliesTo.Archetypes {
			if _, ok := core.Archetypes[archID]; !ok {
				findings = append(findings, Error("core_model", fmt.Sprintf("presentations.%s.applies_to.archetypes.%s", presID, archID), "unknown_archetype", fmt.Sprintf("presentation %q applies to unknown archetype %q", presID, archID), "Define the archetype or remove the reference."))
			}
		}
		if pres.StyleRecipe != "" {
			if _, ok := pkg.DesignLanguage.PresentationRecipes[pres.StyleRecipe]; !ok {
				findings = append(findings, Error("core_model", fmt.Sprintf("presentations.%s.style_recipe", presID), "unknown_style_recipe", fmt.Sprintf("presentation %q references unknown style recipe %q", presID, pres.StyleRecipe), "Add the recipe to 02-design-language.yaml or update the reference."))
			}
		}
		for _, fallback := range pres.Fallbacks {
			if _, ok := core.Presentations[fallback]; !ok {
				findings = append(findings, Error("core_model", fmt.Sprintf("presentations.%s.fallbacks.%s", presID, fallback), "unknown_presentation", fmt.Sprintf("presentation %q has unknown fallback %q", presID, fallback), "Define the fallback presentation or remove the reference."))
			}
		}
	}

	for actionID, action := range core.Actions {
		findings = append(findings, validateSelectors("core_model", fmt.Sprintf("actions.%s.accepts", actionID), action.Accepts, core)...)
		for argID, arg := range action.Arguments {
			if !knownArgumentModes[arg.Mode] {
				findings = append(findings, Error("core_model", fmt.Sprintf("actions.%s.arguments.%s.mode", actionID, argID), "unknown_argument_mode", fmt.Sprintf("action %q argument %q uses unknown mode %q", actionID, argID, arg.Mode), "Use a known argument mode or update the validator."))
			}
			findings = append(findings, validateSelectors("core_model", fmt.Sprintf("actions.%s.arguments.%s.accepts", actionID, argID), arg.Accepts, core)...)
		}
	}

	for exampleID, example := range core.DomainExamples {
		for domainTypeID, domainType := range example.DomainTypes {
			for _, archID := range domainType.Archetypes {
				if _, ok := core.Archetypes[archID]; !ok {
					findings = append(findings, Error("core_model", fmt.Sprintf("domain_examples.%s.domain_types.%s.archetypes.%s", exampleID, domainTypeID, archID), "unknown_archetype", fmt.Sprintf("domain type %q references unknown archetype %q", domainTypeID, archID), "Define the archetype or fix the domain example."))
				}
			}
			for capID, mapping := range domainType.Capabilities {
				cap, ok := core.Capabilities[capID]
				if !ok {
					findings = append(findings, Error("core_model", fmt.Sprintf("domain_examples.%s.domain_types.%s.capabilities.%s", exampleID, domainTypeID, capID), "unknown_capability", fmt.Sprintf("domain type %q maps unknown capability %q", domainTypeID, capID), "Define the capability or fix the mapping."))
					continue
				}
				for projID, proj := range cap.Projections {
					if proj.Required {
						if _, ok := mapping[projID]; !ok {
							findings = append(findings, Error("core_model", fmt.Sprintf("domain_examples.%s.domain_types.%s.capabilities.%s.%s", exampleID, domainTypeID, capID, projID), "missing_required_projection_mapping", fmt.Sprintf("domain type %q capability %q is missing required projection %q", domainTypeID, capID, projID), "Map the required projection to a domain field."))
						}
					}
				}
			}
		}
	}

	return findings
}

func validateSelectors(artifact, path string, selectors []Selector, core CoreModelFile) []Finding {
	var findings []Finding
	for i, selector := range selectors {
		selectorPath := fmt.Sprintf("%s[%d]", path, i)
		if selector.Capability != "" {
			if _, ok := core.Capabilities[selector.Capability]; !ok {
				findings = append(findings, Error(artifact, selectorPath+".capability", "unknown_capability", fmt.Sprintf("selector references unknown capability %q", selector.Capability), "Define the capability or update the selector."))
			}
		}
		if selector.Archetype != "" {
			if _, ok := core.Archetypes[selector.Archetype]; !ok {
				findings = append(findings, Error(artifact, selectorPath+".archetype", "unknown_archetype", fmt.Sprintf("selector references unknown archetype %q", selector.Archetype), "Define the archetype or update the selector."))
			}
		}
		if selector.Presentation != "" {
			if _, ok := core.Presentations[selector.Presentation]; !ok {
				findings = append(findings, Error(artifact, selectorPath+".presentation", "unknown_presentation", fmt.Sprintf("selector references unknown presentation %q", selector.Presentation), "Define the presentation or update the selector."))
			}
		}
		for _, capID := range selector.RequiresCapabilities {
			if _, ok := core.Capabilities[capID]; !ok {
				findings = append(findings, Error(artifact, selectorPath+".requires_capabilities", "unknown_capability", fmt.Sprintf("selector requires unknown capability %q", capID), "Define the capability or update the selector."))
			}
		}
	}
	return findings
}

func validateDesignLanguage(pkg *Package) []Finding {
	var findings []Finding
	design := pkg.DesignLanguage
	for axisID, axis := range design.ThemeAxes {
		if axis.Default == "" {
			findings = append(findings, Error("design_language", fmt.Sprintf("theme_axes.%s.default", axisID), "missing_theme_axis_default", fmt.Sprintf("theme axis %q has no default", axisID), "Set a default value."))
		} else if !contains(axis.Values, axis.Default) {
			findings = append(findings, Error("design_language", fmt.Sprintf("theme_axes.%s.default", axisID), "theme_axis_default_not_in_values", fmt.Sprintf("theme axis %q default %q is not listed in values", axisID, axis.Default), "Add the default to values or choose another default."))
		}
	}
	for roleID, role := range design.Typography.Roles {
		if role.Family != "" {
			if _, ok := design.Typography.Families[role.Family]; !ok {
				findings = append(findings, Error("design_language", fmt.Sprintf("typography.roles.%s.family", roleID), "unknown_typography_family", fmt.Sprintf("typography role %q references unknown family %q", roleID, role.Family), "Define the family or update the role."))
			}
		}
	}
	for recipeID, recipe := range design.PresentationRecipes {
		if recipe.Typography != "" {
			if _, ok := design.Typography.Roles[recipe.Typography]; !ok {
				findings = append(findings, Error("design_language", fmt.Sprintf("presentation_recipes.%s.typography", recipeID), "unknown_typography_role", fmt.Sprintf("presentation recipe %q references unknown typography role %q", recipeID, recipe.Typography), "Define the typography role or update the recipe."))
			}
		}
		for _, state := range recipe.States {
			if _, ok := design.InteractionStates.States[state]; !ok {
				findings = append(findings, Error("design_language", fmt.Sprintf("presentation_recipes.%s.states.%s", recipeID, state), "unknown_interaction_state", fmt.Sprintf("presentation recipe %q references unknown state %q", recipeID, state), "Define the interaction state or update the recipe."))
			}
		}
	}
	for ruleID, rule := range design.LintRules {
		if !knownSeverities[rule.Severity] {
			findings = append(findings, Error("design_language", fmt.Sprintf("lint_rules.%s.severity", ruleID), "unknown_lint_severity", fmt.Sprintf("lint rule %q uses unknown severity %q", ruleID, rule.Severity), "Use info, warning, or error."))
		}
	}
	return findings
}

func validateWidgets(pkg *Package) []Finding {
	var findings []Finding
	seenIDs := map[string]bool{}
	seenOutputs := map[string]string{}
	for i, widget := range pkg.Widgets.Widgets {
		path := fmt.Sprintf("widgets[%d]", i)
		if widget.ID == "" {
			findings = append(findings, Error("widgets", path+".id", "missing_widget_id", "widget has no id", "Add a stable widget id."))
		} else if seenIDs[widget.ID] {
			findings = append(findings, Error("widgets", path+".id", "duplicate_widget_id", fmt.Sprintf("duplicate widget id %q", widget.ID), "Use unique widget ids."))
		} else {
			seenIDs[widget.ID] = true
		}
		if widget.Name == "" {
			findings = append(findings, Error("widgets", path+".name", "missing_widget_name", fmt.Sprintf("widget %q has no React component name", widget.ID), "Add a component name."))
		}
		for _, presID := range widget.Consumes.Presentations {
			if _, ok := pkg.CoreModel.Presentations[presID]; !ok {
				findings = append(findings, Error("widgets", path+".consumes.presentations", "unknown_presentation", fmt.Sprintf("widget %q consumes unknown presentation %q", widget.ID, presID), "Define the presentation or update the widget."))
			}
		}
		for _, capID := range widget.Consumes.Capabilities {
			if _, ok := pkg.CoreModel.Capabilities[capID]; !ok {
				findings = append(findings, Error("widgets", path+".consumes.capabilities", "unknown_capability", fmt.Sprintf("widget %q consumes unknown capability %q", widget.ID, capID), "Define the capability or update the widget."))
			}
		}
		for _, archID := range widget.Consumes.Archetypes {
			if _, ok := pkg.CoreModel.Archetypes[archID]; !ok {
				findings = append(findings, Error("widgets", path+".consumes.archetypes", "unknown_archetype", fmt.Sprintf("widget %q consumes unknown archetype %q", widget.ID, archID), "Define the archetype or update the widget."))
			}
		}
		if _, ok := widget.Outputs["metadata"]; !ok {
			findings = append(findings, Error("widgets", path+".outputs.metadata", "missing_metadata_output", fmt.Sprintf("widget %q has no metadata output", widget.ID), "Add a metadata sidecar output path."))
		}
		for key, outPath := range widget.Outputs {
			if outPath == "" {
				findings = append(findings, Error("widgets", path+".outputs."+key, "empty_output_path", fmt.Sprintf("widget %q output %q is empty", widget.ID, key), "Add an output path or remove the output."))
				continue
			}
			if previous, ok := seenOutputs[outPath]; ok {
				findings = append(findings, Error("widgets", path+".outputs."+key, "duplicate_output_path", fmt.Sprintf("widget %q output path %q is already used by %q", widget.ID, outPath, previous), "Ensure generated output paths are unique."))
			} else {
				seenOutputs[outPath] = widget.ID
			}
		}
	}
	return findings
}

func knownPresentationLayer(layer string) bool {
	switch layer {
	case "capability", "archetype", "domain":
		return true
	default:
		return false
	}
}

func contains(values []string, target string) bool {
	for _, value := range values {
		if value == target {
			return true
		}
	}
	return false
}

func setFromSlice(values []string) map[string]bool {
	out := map[string]bool{}
	for _, value := range values {
		out[value] = true
	}
	return out
}
