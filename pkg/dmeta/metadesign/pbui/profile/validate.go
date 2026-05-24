package profile

import (
	"fmt"
	"strings"

	pbuimds "github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func ValidatePackage(pkg *Package, pbuiPkg *pbuimds.Package) []validator.Finding {
	var findings []validator.Finding
	findings = append(findings, validatePresentationSystem(pkg)...)
	findings = append(findings, validateStyleProfile(pkg)...)
	findings = append(findings, validateSurfaces(pkg)...)
	findings = append(findings, validateViewModels(pkg, pbuiPkg)...)
	findings = append(findings, validatePresentationBindings(pkg, pbuiPkg)...)
	findings = append(findings, validateReactAppTarget(pkg)...)
	return findings
}

func validatePresentationSystem(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	if strings.TrimSpace(pkg.Meta.ID) == "" {
		findings = append(findings, validator.Error("pbui_presentation_profile", "id", "missing_profile_id", "PBUI presentation profile has no id", "Add a stable id such as street_deli_clim."))
	}
	if strings.TrimSpace(pkg.Meta.Summary) == "" {
		findings = append(findings, validator.Warning("pbui_presentation_profile", "summary", "missing_summary", "PBUI presentation profile has no summary", "Add a concise human-readable summary."))
	}
	if strings.TrimSpace(pkg.Meta.Intent) == "" {
		findings = append(findings, validator.Warning("pbui_presentation_profile", "intent", "missing_intent", "PBUI presentation profile has no intent", "Explain which concrete presentation system this profile instantiates."))
	}
	if strings.TrimSpace(pkg.Meta.Inherits["meta_design_system"]) != "pbui" {
		findings = append(findings, validator.Warning("pbui_presentation_profile", "inherits.meta_design_system", "unexpected_meta_design_system", fmt.Sprintf("PBUI profile inherits meta_design_system %q", pkg.Meta.Inherits["meta_design_system"]), "Use pbui unless this is intentionally a different presentation-system family."))
	}
	for key, fallback := range map[string]string{
		"style_profile":         "./style-profile.yaml",
		"surfaces":              "./surfaces.yaml",
		"view_models":           "./view-models.yaml",
		"presentation_bindings": "./presentation-bindings.yaml",
		"react_app_target":      "./targets/react-app.yaml",
	} {
		if strings.TrimSpace(pkg.Meta.Files[key]) == "" {
			findings = append(findings, validator.Warning("pbui_presentation_profile", "files."+key, "missing_file_reference", fmt.Sprintf("PBUI profile does not declare files.%s", key), "Add an explicit reference such as "+fallback+"."))
		}
	}
	return findings
}

func validateStyleProfile(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	if strings.TrimSpace(pkg.Style.ID) == "" {
		findings = append(findings, validator.Error("pbui_style_profile", "id", "missing_style_profile_id", "PBUI style profile has no id", "Add a stable style profile id."))
	}
	if strings.TrimSpace(pkg.Style.Intent) == "" {
		findings = append(findings, validator.Warning("pbui_style_profile", "intent", "missing_intent", "PBUI style profile has no intent", "Explain the concrete visual grammar."))
	}
	for _, path := range []string{"color", "typography", "spacing"} {
		if _, ok := pkg.Style.Tokens[path]; !ok {
			findings = append(findings, validator.Error("pbui_style_profile", "tokens."+path, "missing_style_token_group", fmt.Sprintf("PBUI style profile is missing token group %q", path), "Add the token group so targets can render the profile consistently."))
		}
	}
	for _, className := range []string{"shell", "presentation", "presentation_selected", "presentation_selectable", "command_line"} {
		if strings.TrimSpace(pkg.Style.Classes[className]) == "" {
			findings = append(findings, validator.Error("pbui_style_profile", "classes."+className, "missing_style_class", fmt.Sprintf("PBUI style profile is missing class %q", className), "Add a concrete class name from the prototype or target style profile."))
		}
	}
	for _, state := range []string{"normal", "select", "confirm"} {
		if _, ok := pkg.Style.StateStyles[state]; !ok {
			findings = append(findings, validator.Warning("pbui_style_profile", "state_styles."+state, "missing_state_style", fmt.Sprintf("PBUI style profile has no state style for %q", state), "Describe how the concrete app should present this interaction state."))
		}
	}
	return findings
}

func validateSurfaces(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	if len(pkg.Surfaces.Surfaces) == 0 {
		return append(findings, validator.Error("pbui_surfaces", "surfaces", "no_surfaces", "PBUI profile has no concrete surfaces", "Add shell/view/command-line surfaces."))
	}
	for _, id := range []string{"shell", "view", "command_line"} {
		if _, ok := pkg.Surfaces.Surfaces[id]; !ok {
			findings = append(findings, validator.Error("pbui_surfaces", "surfaces."+id, "missing_required_surface", fmt.Sprintf("PBUI profile is missing required surface %q", id), "Add the surface so app planning has a concrete shell contract."))
		}
	}
	for id, surface := range pkg.Surfaces.Surfaces {
		path := "surfaces." + id
		if strings.TrimSpace(surface.Component) == "" {
			findings = append(findings, validator.Error("pbui_surfaces", path+".component", "missing_surface_component", fmt.Sprintf("surface %q has no component", id), "Add a concrete renderer/shell component name."))
		}
		if strings.TrimSpace(surface.Intent) == "" {
			findings = append(findings, validator.Warning("pbui_surfaces", path+".intent", "missing_intent", fmt.Sprintf("surface %q has no intent", id), "Explain why this surface exists in the concrete app."))
		}
		for i, region := range surface.Regions {
			regionPath := fmt.Sprintf("%s.regions[%d]", path, i)
			if strings.TrimSpace(region.ID) == "" {
				findings = append(findings, validator.Error("pbui_surfaces", regionPath+".id", "missing_region_id", fmt.Sprintf("surface %q has a region with no id", id), "Add a stable region id."))
			}
			if strings.TrimSpace(region.Component) == "" {
				findings = append(findings, validator.Error("pbui_surfaces", regionPath+".component", "missing_region_component", fmt.Sprintf("surface %q region %q has no component", id, region.ID), "Add a concrete component name."))
			}
		}
	}
	return findings
}

func validateViewModels(pkg *Package, pbuiPkg *pbuimds.Package) []validator.Finding {
	var findings []validator.Finding
	if len(pkg.ViewModels.Views) == 0 {
		return append(findings, validator.Error("pbui_view_models", "views", "no_views", "PBUI profile has no concrete views", "Add view models such as menu/detail/cart."))
	}
	for id, view := range pkg.ViewModels.Views {
		path := "views." + id
		if strings.TrimSpace(view.ModeLabel) == "" {
			findings = append(findings, validator.Error("pbui_view_models", path+".mode_label", "missing_mode_label", fmt.Sprintf("view %q has no mode label", id), "Add the concrete CLIM mode label."))
		}
		if strings.TrimSpace(view.PresenterIntent) == "" {
			findings = append(findings, validator.Warning("pbui_view_models", path+".presenter_intent", "missing_presenter_intent", fmt.Sprintf("view %q has no presenter intent", id), "Explain how the view projects domain/session state."))
		}
		if strings.TrimSpace(view.RecognizerIntent) == "" {
			findings = append(findings, validator.Warning("pbui_view_models", path+".recognizer_intent", "missing_recognizer_intent", fmt.Sprintf("view %q has no recognizer intent", id), "Explain how the view recognizes user actions."))
		}
		for _, presentationTypeID := range view.PrimaryPresentations {
			findings = append(findings, validateKnownPresentationType(pbuiPkg, "pbui_view_models", path+".primary_presentations", id, presentationTypeID)...)
		}
	}
	return findings
}

func validatePresentationBindings(pkg *Package, pbuiPkg *pbuimds.Package) []validator.Finding {
	var findings []validator.Finding
	if len(pkg.PresentationBindings.Bindings) == 0 {
		return append(findings, validator.Error("pbui_presentation_bindings", "bindings", "no_bindings", "PBUI profile has no presentation bindings", "Bind abstract PBUI presentation types to concrete components."))
	}
	for id, binding := range pkg.PresentationBindings.Bindings {
		path := "bindings." + id
		findings = append(findings, validateKnownPresentationType(pbuiPkg, "pbui_presentation_bindings", path, id, id)...)
		if strings.TrimSpace(binding.Component) == "" {
			findings = append(findings, validator.Error("pbui_presentation_bindings", path+".component", "missing_binding_component", fmt.Sprintf("binding %q has no component", id), "Add the concrete renderer component name."))
		}
		if strings.TrimSpace(binding.Intent) == "" {
			findings = append(findings, validator.Warning("pbui_presentation_bindings", path+".intent", "missing_intent", fmt.Sprintf("binding %q has no intent", id), "Explain how this concrete binding realizes the abstract presentation type."))
		}
		if len(binding.Classes) == 0 {
			findings = append(findings, validator.Warning("pbui_presentation_bindings", path+".classes", "no_classes", fmt.Sprintf("binding %q has no classes", id), "Add style class mappings or document why this renderer is unstyled."))
		}
	}
	return findings
}

func validateReactAppTarget(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	if strings.TrimSpace(pkg.ReactAppTarget.ID) == "" {
		findings = append(findings, validator.Error("pbui_react_app_target", "id", "missing_target_id", "PBUI React app target has no id", "Add a target id such as react_app."))
	}
	if strings.TrimSpace(pkg.ReactAppTarget.Intent) == "" {
		findings = append(findings, validator.Warning("pbui_react_app_target", "intent", "missing_intent", "PBUI React app target has no intent", "Explain how this target should realize the concrete profile."))
	}
	if strings.TrimSpace(pkg.ReactAppTarget.Defaults.OutputDir) == "" {
		findings = append(findings, validator.Error("pbui_react_app_target", "defaults.output_dir", "missing_output_dir", "PBUI React app target has no output directory", "Set the promoted/generated app output directory."))
	}
	if pkg.ReactAppTarget.Provenance.MetaDesignSystem != "pbui" {
		findings = append(findings, validator.Warning("pbui_react_app_target", "provenance.meta_design_system", "unexpected_meta_design_system", fmt.Sprintf("PBUI React app target provenance meta_design_system is %q", pkg.ReactAppTarget.Provenance.MetaDesignSystem), "Use pbui unless this target intentionally belongs elsewhere."))
	}
	if pkg.ReactAppTarget.Provenance.PresentationSystem != pkg.Meta.ID {
		findings = append(findings, validator.Warning("pbui_react_app_target", "provenance.presentation_system", "presentation_system_mismatch", fmt.Sprintf("PBUI React app target provenance presentation_system is %q, profile id is %q", pkg.ReactAppTarget.Provenance.PresentationSystem, pkg.Meta.ID), "Set provenance.presentation_system to the profile id."))
	}
	for _, required := range []string{"normal", "select", "confirm"} {
		if !contains(pkg.ReactAppTarget.RuntimeContract.InteractionStates, required) {
			findings = append(findings, validator.Error("pbui_react_app_target", "runtime_contract.interaction_states", "missing_interaction_state", fmt.Sprintf("PBUI React app target is missing interaction state %q", required), "Add normal/select/confirm to match the CLIM runtime state machine."))
		}
	}
	return findings
}

func validateKnownPresentationType(pbuiPkg *pbuimds.Package, artifact, path, ownerID, presentationTypeID string) []validator.Finding {
	if strings.TrimSpace(presentationTypeID) == "" {
		return []validator.Finding{validator.Error(artifact, path, "empty_presentation_type", fmt.Sprintf("%q references an empty presentation type id", ownerID), "Remove the empty id or replace it with a known PBUI presentation type.")}
	}
	if _, ok := pbuiPkg.PresentationTypes.PresentationTypes[presentationTypeID]; !ok {
		return []validator.Finding{validator.Error(artifact, path, "unknown_presentation_type", fmt.Sprintf("%q references unknown PBUI presentation type %q", ownerID, presentationTypeID), "Define the PBUI presentation type or fix the concrete profile reference.")}
	}
	return nil
}

func contains(values []string, value string) bool {
	for _, v := range values {
		if v == value {
			return true
		}
	}
	return false
}
