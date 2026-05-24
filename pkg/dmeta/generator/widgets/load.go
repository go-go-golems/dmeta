package widgets

import (
	"context"
	"os"
	"path/filepath"
	"sort"

	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
	"github.com/pkg/errors"
	"gopkg.in/yaml.v3"
)

type TemplateCatalog struct {
	GlobalRoot      string
	ReflectionRoot  string
	Templates       map[string]validator.Widget
	Package         *validator.Package
	ResolvedCore    *validator.ResolvedCoreModel
	ReflectionReady bool
}

func LoadInstance(path string) (InstanceManifest, string, error) {
	var instance InstanceManifest
	abs, err := filepath.Abs(path)
	if err != nil {
		return instance, "", errors.Wrap(err, "resolve instance manifest path")
	}
	b, err := os.ReadFile(abs)
	if err != nil {
		return instance, "", errors.Wrap(err, "read instance manifest")
	}
	if err := yaml.Unmarshal(b, &instance); err != nil {
		return instance, "", errors.Wrap(err, "parse instance manifest")
	}
	if instance.ArtifactType != "dmeta_instance" {
		return instance, "", errors.Errorf("instance artifact_type is %q, expected dmeta_instance", instance.ArtifactType)
	}
	return instance, filepath.Dir(abs), nil
}

func LoadTemplateCatalog(ctx context.Context, globalRoot string, instanceDir string, instance InstanceManifest) (TemplateCatalog, error) {
	if globalRoot == "" {
		globalRoot = instance.InteractionsRoot
	}
	if globalRoot == "" {
		return TemplateCatalog{}, errors.New("no global IR root supplied and interactions_root is empty")
	}
	if !filepath.IsAbs(globalRoot) {
		globalRoot = filepath.Join(instanceDir, globalRoot)
	}
	pkg, err := validator.LoadPackage(ctx, globalRoot)
	if err != nil {
		return TemplateCatalog{}, errors.Wrap(err, "load global DMETA IR")
	}

	catalog := TemplateCatalog{GlobalRoot: globalRoot, ReflectionRoot: globalRoot, Templates: map[string]validator.Widget{}, Package: pkg}
	reflectionRoot := instance.SemanticRoot
	if reflectionRoot != "" {
		if !filepath.IsAbs(reflectionRoot) {
			reflectionRoot = filepath.Join(instanceDir, reflectionRoot)
		}
		if reflectionPkg, err := validator.LoadPackage(ctx, reflectionRoot); err == nil {
			catalog.Package = reflectionPkg
			catalog.ReflectionRoot = reflectionRoot
		}
	}
	if catalog.Package != nil {
		resolved, findings := validator.ResolveCoreInheritance(catalog.Package.CoreModel)
		if !validator.HasErrors(findings) {
			catalog.ResolvedCore = resolved
			catalog.ReflectionReady = true
		}
	}

	for _, widget := range pkg.Widgets.Widgets {
		catalog.Templates[widget.ID] = widget
	}
	webMDS, ok := instance.MetaDesignSystems["web"]
	if !ok {
		return TemplateCatalog{}, errors.New("instance meta_design_systems.web is required")
	}
	for _, localPath := range webMDS.TemplateFiles {
		path := localPath
		if !filepath.IsAbs(path) {
			path = filepath.Join(instanceDir, path)
		}
		local, err := loadLocalTemplates(path)
		if err != nil {
			return TemplateCatalog{}, err
		}
		for _, widget := range local.Templates {
			catalog.Templates[widget.ID] = widget
		}
	}
	return catalog, nil
}

func ValidateInstanceAgainstCatalog(instance InstanceManifest, catalog TemplateCatalog) []PlanFinding {
	var findings []PlanFinding
	if instance.ID == "" {
		findings = append(findings, PlanFinding{Severity: "error", Subject: "instance", Code: "missing_instance_id", Message: "instance id is required"})
	}
	if len(instance.SelectedTemplates) == 0 {
		findings = append(findings, PlanFinding{Severity: "warning", Subject: "selected_templates", Code: "no_selected_templates", Message: "instance selects no widget templates"})
	}
	seenNames := map[string]string{}
	for _, selected := range instance.SelectedTemplates {
		widget, ok := catalog.Templates[selected.Template]
		if !ok {
			findings = append(findings, PlanFinding{Severity: "error", Subject: selected.Template, Code: "unknown_selected_template", Message: "selected template does not exist in global or local catalogs"})
			continue
		}
		name := selected.As
		if name == "" {
			name = widget.Name
		}
		if previous, ok := seenNames[name]; ok {
			findings = append(findings, PlanFinding{Severity: "error", Subject: name, Code: "duplicate_component_name", Message: "selected component name is used by more than one template", Detail: previous + ", " + selected.Template})
		} else {
			seenNames[name] = selected.Template
		}
		if selected.Reason == "" {
			findings = append(findings, PlanFinding{Severity: "warning", Subject: selected.Template, Code: "missing_selection_reason", Message: "selected template should explain why it belongs in this concrete instance"})
		}
		if selected.Variant != "" && len(widget.Template.CommonVariants) > 0 && !contains(widget.Template.CommonVariants, selected.Variant) {
			findings = append(findings, PlanFinding{Severity: "warning", Subject: selected.Template, Code: "variant_not_declared", Message: "selected variant is not listed in template.common_variants", Detail: selected.Variant})
		}
		for key := range selected.Adaptations {
			if _, ok := widget.Template.AdaptationPoints[key]; !ok {
				findings = append(findings, PlanFinding{Severity: "warning", Subject: selected.Template, Code: "unknown_adaptation", Message: "selected adaptation is not declared by template.adaptation_points", Detail: key})
			}
		}
		for key, point := range widget.Template.AdaptationPoints {
			if !adaptationRequiredForVariant(point, selected.Variant) {
				continue
			}
			if _, ok := selected.Adaptations[key]; !ok {
				findings = append(findings, PlanFinding{Severity: "error", Subject: selected.Template, Code: "missing_required_adaptation", Message: "selected template is missing a required adaptation", Detail: key})
			}
		}
	}
	for _, excluded := range instance.ExcludedTemplates {
		if _, ok := catalog.Templates[excluded.Template]; !ok {
			findings = append(findings, PlanFinding{Severity: "error", Subject: excluded.Template, Code: "unknown_excluded_template", Message: "excluded template does not exist in global or local catalogs"})
		}
		if excluded.Reason == "" {
			findings = append(findings, PlanFinding{Severity: "warning", Subject: excluded.Template, Code: "missing_exclusion_reason", Message: "excluded template should explain why it is intentionally not generated"})
		}
	}
	return findings
}

func ResolveTemplates(ctx context.Context, globalRoot string, instanceDir string, instance InstanceManifest) ([]ResolvedTemplate, error) {
	catalog, err := LoadTemplateCatalog(ctx, globalRoot, instanceDir, instance)
	if err != nil {
		return nil, err
	}
	findings := ValidateInstanceAgainstCatalog(instance, catalog)
	if hasPlanErrors(findings) {
		return nil, errors.Errorf("instance validation failed; run plan-instance for details")
	}
	resolved := make([]ResolvedTemplate, 0, len(instance.SelectedTemplates))
	for _, selected := range instance.SelectedTemplates {
		widget := catalog.Templates[selected.Template]
		resolved = append(resolved, ResolvedTemplate{Selected: selected, Template: widget, Reflection: buildWidgetReflection(widget, catalog.Package, catalog.ResolvedCore)})
	}
	return resolved, nil
}

func buildWidgetReflection(widget validator.Widget, pkg *validator.Package, resolved *validator.ResolvedCoreModel) WidgetReflection {
	if pkg == nil || resolved == nil {
		return WidgetReflection{}
	}
	ctx := widget.SemanticContext
	if len(ctx.Archetypes) == 0 && len(ctx.Capabilities) == 0 && len(ctx.Presentations) == 0 {
		ctx.Archetypes = widget.Consumes.Archetypes
		ctx.Capabilities = widget.Consumes.Capabilities
		ctx.Presentations = widget.Consumes.Presentations
	}
	reflection := WidgetReflection{}
	for _, id := range ctx.Archetypes {
		raw, ok := pkg.CoreModel.Archetypes[id]
		resolvedArch, resolvedOK := resolved.Archetypes[id]
		if !ok || !resolvedOK {
			continue
		}
		reflection.Archetypes = append(reflection.Archetypes, ResolvedArchetypeReflection{ID: id, Description: raw.Description, LongDescription: raw.LongDescription, Abstract: raw.Abstract, Ancestors: resolvedArch.Ancestors, EffectiveDefaultCapabilities: resolvedArch.EffectiveDefaultCapabilities, EffectiveRecommendedPresentations: resolvedArch.EffectiveRecommendedPresentations})
	}
	for _, id := range ctx.Capabilities {
		raw, ok := pkg.CoreModel.Capabilities[id]
		resolvedCap, resolvedOK := resolved.Capabilities[id]
		if !ok || !resolvedOK {
			continue
		}
		projectionNames := sortedProjectionNames(resolvedCap.EffectiveProjections)
		reflection.Capabilities = append(reflection.Capabilities, ResolvedCapabilityReflection{ID: id, Description: raw.Description, LongDescription: raw.LongDescription, Abstract: raw.Abstract, Ancestors: resolvedCap.Ancestors, EffectiveProjectionNames: projectionNames, RequiredProjectionNames: requiredProjectionNames(resolvedCap.EffectiveProjections), EffectivePresentations: resolvedCap.EffectivePresentations, EffectiveActions: resolvedCap.EffectiveActions, EffectiveFilters: resolvedCap.EffectiveFilters})
	}
	for _, id := range ctx.Presentations {
		presentation, ok := pkg.CoreModel.Presentations[id]
		if !ok {
			continue
		}
		reflection.Presentations = append(reflection.Presentations, ResolvedPresentationReflection{ID: id, Description: presentation.Description, LongDescription: presentation.LongDescription, Layer: presentation.Layer, Role: presentation.Role, Requires: presentation.Requires, RequiresAny: presentation.RequiresAny, Optional: presentation.Optional})
	}
	return reflection
}

func sortedProjectionNames(projections map[string]validator.Projection) []string {
	keys := make([]string, 0, len(projections))
	for key := range projections {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}

func requiredProjectionNames(projections map[string]validator.Projection) []string {
	keys := []string{}
	for key, projection := range projections {
		if projection.Required {
			keys = append(keys, key)
		}
	}
	sort.Strings(keys)
	return keys
}

func loadLocalTemplates(path string) (validator.WidgetTemplatesFile, error) {
	var out validator.WidgetTemplatesFile
	b, err := os.ReadFile(path)
	if err != nil {
		return out, errors.Wrapf(err, "read local template file %s", path)
	}
	if err := yaml.Unmarshal(b, &out); err != nil {
		return out, errors.Wrapf(err, "parse local template file %s", path)
	}
	if out.ArtifactType != "dmeta_web_widget_templates" {
		return out, errors.Errorf("local Web widget template file %s artifact_type is %q, expected dmeta_web_widget_templates", path, out.ArtifactType)
	}
	return out, nil
}

func hasPlanErrors(findings []PlanFinding) bool {
	for _, finding := range findings {
		if finding.Severity == "error" {
			return true
		}
	}
	return false
}

func adaptationRequiredForVariant(point validator.AdaptationPoint, variant string) bool {
	if point.Required {
		return true
	}
	if variant == "" {
		return false
	}
	return contains(point.RequiredForVariants, variant)
}

func contains(values []string, value string) bool {
	for _, v := range values {
		if v == value {
			return true
		}
	}
	return false
}
