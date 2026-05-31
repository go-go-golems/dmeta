package react

import (
	"context"
	"os"
	"path/filepath"
	"sort"
	"strings"

	instancegen "github.com/go-go-golems/dmeta/pkg/dmeta/instance"
	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	webmds "github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/web"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
	"github.com/pkg/errors"
	"gopkg.in/yaml.v3"
)

type PlanOptions struct {
	InstancePath     string
	TargetFile       string
	InteractionsRoot string
	WebRoot          string
	SemanticRoot     string
	OutputDir        string
}

func LoadTarget(path string) (TargetFile, error) {
	var target TargetFile
	b, err := os.ReadFile(path)
	if err != nil {
		return target, err
	}
	if err := yaml.Unmarshal(b, &target); err != nil {
		return target, err
	}
	if target.ArtifactType != "dmeta_web_react_target" {
		return target, errors.Errorf("React target artifact_type is %q, expected dmeta_web_react_target", target.ArtifactType)
	}
	return target, nil
}

func BuildScaffoldPlan(ctx context.Context, opts PlanOptions) (ScaffoldPlan, error) {
	if opts.InstancePath == "" {
		return ScaffoldPlan{}, errors.New("instance path is required")
	}
	instance, instanceDir, err := instancegen.LoadInstance(opts.InstancePath)
	if err != nil {
		return ScaffoldPlan{}, err
	}

	semanticRoot := opts.SemanticRoot
	if semanticRoot == "" {
		semanticRoot = instance.SemanticRoot
	}
	if semanticRoot == "" {
		return ScaffoldPlan{}, errors.New("no semantic root supplied and semantic_root is empty")
	}
	semanticRoot = resolveRelative(instanceDir, semanticRoot)

	interactionsRoot := opts.InteractionsRoot
	if interactionsRoot == "" {
		interactionsRoot = instance.InteractionsRoot
	}
	if interactionsRoot == "" {
		return ScaffoldPlan{}, errors.New("no interactions root supplied and interactions_root is empty")
	}
	interactionsRoot = resolveRelative(instanceDir, interactionsRoot)

	webMDS, ok := instance.MetaDesignSystems["web"]
	if !ok {
		return ScaffoldPlan{}, errors.New("instance meta_design_systems.web is required")
	}
	webRoot := opts.WebRoot
	if webRoot == "" {
		webRoot = webMDS.Root
	}
	if webRoot == "" {
		return ScaffoldPlan{}, errors.New("no Web MetaDesignSystem root supplied and meta_design_systems.web.root is empty")
	}
	webRoot = resolveRelative(instanceDir, webRoot)

	targetFile := opts.TargetFile
	if targetFile == "" {
		targetFile = instance.Targets.React.TargetFile
	}
	if targetFile == "" {
		targetFile = filepath.Join(interactionsRoot, "meta-design-systems", "web", "targets", "react.yaml")
	}
	targetFile = resolveRelative(instanceDir, targetFile)
	target, err := LoadTarget(targetFile)
	if err != nil {
		return ScaffoldPlan{}, errors.Wrap(err, "load React target")
	}

	semanticPkg, err := validator.LoadPackage(ctx, semanticRoot)
	if err != nil {
		return ScaffoldPlan{}, err
	}
	resolved, inheritanceFindings := validator.ResolveCoreInheritance(semanticPkg.CoreModel)
	if validator.HasErrors(inheritanceFindings) {
		return ScaffoldPlan{}, errors.New("semantic inheritance has error-severity findings; run validate-ir")
	}

	interactionPkg, err := interaction.LoadPackage(ctx, interactionsRoot)
	if err != nil {
		return ScaffoldPlan{}, err
	}
	interactionFindings := interaction.ValidatePackage(interactionPkg)
	if validator.HasErrors(interactionFindings) {
		return ScaffoldPlan{}, errors.New("interaction package has error-severity findings; run validate-interactions")
	}
	interactionObligations, elaborationFindings := interaction.ElaborateInteractions(semanticPkg.CoreModel, resolved, interactionPkg)
	if validator.HasErrors(elaborationFindings) {
		return ScaffoldPlan{}, errors.New("interaction elaboration has error-severity findings")
	}

	webPkg, err := webmds.LoadPackage(ctx, webRoot)
	if err != nil {
		return ScaffoldPlan{}, err
	}
	webFindings := webmds.ValidatePackage(webPkg, interactionPkg)
	if validator.HasErrors(webFindings) {
		return ScaffoldPlan{}, errors.New("Web MetaDesignSystem has error-severity findings")
	}
	webObligations := webmds.Lower(interactionObligations, webPkg)

	outputDir := opts.OutputDir
	if outputDir != "" {
		outputDir = resolveRelative(instanceDir, outputDir)
	} else if instance.Targets.React.OutputDir != "" {
		outputDir = resolveRelative(instanceDir, instance.Targets.React.OutputDir)
	} else if target.Defaults.OutputDir != "" {
		outputDir = resolveRelative(semanticRoot, target.Defaults.OutputDir)
	} else {
		return ScaffoldPlan{}, errors.New("React target has no defaults.output_dir and no --output-dir was supplied")
	}
	packageName := instance.Targets.React.PackageName
	if packageName == "" {
		packageName = target.Defaults.PackageName
	}

	plan := ScaffoldPlan{
		InstanceID:       instance.ID,
		TargetID:         target.ID,
		MetaDesignSystem: target.Provenance.MetaDesignSystem,
		OutputDir:        outputDir,
		PackageName:      packageName,
		SemanticRoot:     semanticRoot,
		InteractionsRoot: interactionsRoot,
		WebRoot:          webRoot,
		TargetFile:       targetFile,
	}
	obligationsByTemplate := groupWebObligations(webObligations)
	for _, selected := range instance.SelectedTemplates {
		widget, ok := webPkg.Widgets[selected.Template]
		if !ok {
			return ScaffoldPlan{}, errors.Errorf("selected Web widget template %q does not exist", selected.Template)
		}
		componentName := strings.TrimSpace(widget.Name)
		if componentName == "" {
			return ScaffoldPlan{}, errors.Errorf("Web widget template %q has no name; React lowering requires a canonical template name", selected.Template)
		}
		if selected.As != "" && selected.As != componentName {
			return ScaffoldPlan{}, errors.Errorf("selected Web widget template %q uses deprecated as=%q that differs from template name %q; rename the template or remove the override", selected.Template, selected.As, componentName)
		}
		componentKind := componentKindFromWidget(widget)
		componentDir := componentOutputDir(outputDir, componentName, componentKind, target.Defaults.ComponentLayout)
		component := ComponentPlan{
			TemplateID:           selected.Template,
			ComponentName:        componentName,
			Variant:              selected.Variant,
			OutputDir:            outputDir,
			ComponentDir:         componentDir,
			PackageExportPath:    packageExportPath(outputDir, componentDir),
			PackageName:          packageName,
			Template:             widget,
			ComponentKind:        componentKind,
			ComponentSpecificity: componentSpecificityFromWidget(widget),
			ComponentFamily:      componentFamilyFromWidget(widget),
			ComponentRole:        componentRoleFromWidget(widget),
			ComponentLifecycle:   componentLifecycleFromWidget(widget),
			Slots:                sortedSet(nil),
			VisualStates:         sortedSet(nil),
			EventBindings:        sortedSet(nil),
			SourceDomainTypes:    []string{},
			SourceRules:          []string{},
		}
		if obligations, ok := obligationsByTemplate[selected.Template]; ok {
			component = applyWebObligations(component, obligations)
		}
		component.Files = planFiles(component, target)
		plan.Components = append(plan.Components, component)
	}
	plan.Files = planPackageFiles(plan, target)
	return plan, nil
}

func resolveRelative(base string, path string) string {
	if path == "" || filepath.IsAbs(path) {
		return path
	}
	return filepath.Clean(filepath.Join(base, path))
}

func groupWebObligations(obligations []webmds.Obligation) map[string][]webmds.Obligation {
	out := map[string][]webmds.Obligation{}
	for _, obligation := range obligations {
		out[obligation.WidgetTemplateID] = append(out[obligation.WidgetTemplateID], obligation)
	}
	return out
}

func applyWebObligations(component ComponentPlan, obligations []webmds.Obligation) ComponentPlan {
	slots := setFrom(component.Slots)
	states := setFrom(component.VisualStates)
	events := setFrom(component.EventBindings)
	representations := map[string]bool{}
	actions := map[string]bool{}
	domainTypes := map[string]bool{}
	rules := map[string]bool{}
	for _, obligation := range obligations {
		addAll(slots, obligation.Slots)
		addAll(states, obligation.VisualStates)
		addAll(events, obligation.EventBindings)
		addAll(representations, obligation.SourceRepresentations)
		addAll(actions, obligation.SourceActions)
		addAll(actions, obligation.EventBindings)
		domainTypes[obligation.DomainTypeID] = true
		rules[obligation.SourceRuleID] = true
	}
	component.Slots = sortedSet(slots)
	component.VisualStates = sortedSet(states)
	component.EventBindings = sortedSet(events)
	component.RealizesRepresentations = sortedSet(representations)
	component.RealizesActions = sortedSet(actions)
	component.SourceDomainTypes = sortedSet(domainTypes)
	component.SourceRules = sortedSet(rules)
	return component
}

func planPackageFiles(plan ScaffoldPlan, target TargetFile) []PlannedFile {
	provenance := FileProvenance{
		MetaDesignSystem: target.Provenance.MetaDesignSystem,
		CodegenTarget:    target.Provenance.CodegenTarget,
		Passes:           target.Provenance.SourcePasses,
	}
	files := []PlannedFile{}
	if contains(target.FileKinds, "package_index") {
		files = append(files, PlannedFile{Path: filepath.Join(plan.OutputDir, "index.ts"), Kind: "package_index", Symbol: plan.PackageName, Lifecycle: "regenerate_only", Provenance: provenance})
	}
	if contains(target.FileKinds, "manifest") {
		files = append(files, PlannedFile{Path: filepath.Join(plan.OutputDir, "dmeta.generated-manifest.json"), Kind: "manifest", Symbol: "DmetaGeneratedManifest", Lifecycle: "regenerate_only", Provenance: provenance})
	}
	return files
}

func planFiles(component ComponentPlan, target TargetFile) []PlannedFile {
	base := component.ComponentDir
	if base == "" {
		base = filepath.Join(component.OutputDir, component.ComponentName)
	}
	provenance := FileProvenance{
		MetaDesignSystem: target.Provenance.MetaDesignSystem,
		CodegenTarget:    target.Provenance.CodegenTarget,
		TemplateID:       component.TemplateID,
		ComponentName:    component.ComponentName,
		Representations:  component.RealizesRepresentations,
		Actions:          component.RealizesActions,
		DomainTypes:      component.SourceDomainTypes,
		SourceRules:      component.SourceRules,
		Passes:           target.Provenance.SourcePasses,
	}
	generatedBase := generatedFileBase(component)
	files := []PlannedFile{
		{Path: filepath.Join(base, generatedBase+".tsx"), Kind: "component", Symbol: component.ComponentName, Lifecycle: lifecycleForKind(component, "component"), Provenance: provenance},
		{Path: filepath.Join(base, generatedBase+".types.ts"), Kind: "types", Symbol: component.ComponentName + "Props", Lifecycle: lifecycleForKind(component, "types"), Provenance: provenance},
		{Path: filepath.Join(base, component.ComponentName+".metadata.json"), Kind: "metadata", Symbol: component.ComponentName + "Metadata", Lifecycle: lifecycleForKind(component, "metadata"), Provenance: provenance},
		{Path: filepath.Join(base, generatedBase+".stories.tsx"), Kind: "stories", Symbol: component.ComponentName + "Stories", Lifecycle: lifecycleForKind(component, "stories"), Provenance: provenance},
		{Path: filepath.Join(base, generatedBase+".module.css"), Kind: "style", Symbol: component.ComponentName + "Styles", Lifecycle: lifecycleForKind(component, "style"), Provenance: provenance},
		{Path: filepath.Join(base, "index.ts"), Kind: "barrel", Symbol: component.ComponentName, Lifecycle: lifecycleForKind(component, "barrel"), Provenance: provenance},
	}
	if contains(target.FileKinds, "readme") {
		files = append(files, PlannedFile{Path: filepath.Join(base, "README.md"), Kind: "readme", Symbol: component.ComponentName + "Readme", Lifecycle: lifecycleForKind(component, "readme"), Provenance: provenance})
	}
	return files
}

func generatedFileBase(component ComponentPlan) string {
	return component.ComponentName + ".generated"
}

func lifecycleForKind(component ComponentPlan, kind string) string {
	if lifecycle := component.Template.Component.GenerationPolicy; lifecycle != "" {
		return normalizeLifecycle(lifecycle)
	}
	return defaultLifecycleForKind(kind)
}

func defaultLifecycleForKind(kind string) string {
	switch kind {
	case "metadata", "types", "package_index", "barrel":
		return "regenerate_only"
	case "component", "style", "stories", "readme":
		return "generated_sidecar"
	default:
		return "generated_sidecar"
	}
}

func normalizeLifecycle(lifecycle string) string {
	normalized := strings.ToLower(strings.TrimSpace(strings.ReplaceAll(lifecycle, "-", "_")))
	switch normalized {
	case "regenerate", "regenerate_only", "regenerateonly", "generated", "generated_only":
		return "regenerate_only"
	case "scaffold", "scaffold_once", "scaffoldonce":
		return "scaffold_once"
	case "scaffold_then_promote", "scaffoldthenpromote", "sidecar", "sidecar_for_merge", "sidecarformerge", "generated_sidecar":
		return "generated_sidecar"
	default:
		return normalized
	}
}

func componentKindFromWidget(widget validator.Widget) string {
	return normalizeComponentKind(widget.Component.Level)
}

func componentSpecificityFromWidget(widget validator.Widget) string {
	return firstNonEmpty(widget.Component.Specificity, "app")
}

func componentFamilyFromWidget(widget validator.Widget) string {
	return widget.Template.Category
}

func componentRoleFromWidget(widget validator.Widget) string {
	return firstNonEmpty(widget.Component.Role, widget.Intent.Purpose)
}

func componentLifecycleFromWidget(widget validator.Widget) string {
	return firstNonEmpty(widget.Component.GenerationPolicy, "scaffold")
}

func componentOutputDir(outputDir string, componentName string, componentKind string, layout ReactComponentLayout) string {
	if layout.Strategy == "" || layout.Strategy == "flat" {
		return filepath.Join(outputDir, componentName)
	}
	dirName := layout.Dirs[componentKind]
	if dirName == "" {
		dirName = defaultComponentDir(componentKind)
	}
	if dirName == "" || dirName == "." {
		return filepath.Join(outputDir, componentName)
	}
	return filepath.Join(outputDir, dirName, componentName)
}

func packageExportPath(outputDir string, componentDir string) string {
	rel, err := filepath.Rel(outputDir, componentDir)
	if err != nil || rel == "." || rel == "" {
		rel = filepath.Base(componentDir)
	}
	return "./" + filepath.ToSlash(rel)
}

func defaultComponentDir(kind string) string {
	switch normalizeComponentKind(kind) {
	case "atom":
		return "atoms"
	case "molecule":
		return "molecules"
	case "organism":
		return "organisms"
	case "rich_widget":
		return "rich-widgets"
	case "page":
		return "pages"
	default:
		return "components"
	}
}

func normalizeComponentKind(kind string) string {
	normalized := strings.ToLower(strings.TrimSpace(strings.ReplaceAll(kind, "-", "_")))
	switch normalized {
	case "", "widget":
		return "component"
	case "richwidget", "rich_widget":
		return "rich_widget"
	default:
		return normalized
	}
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}

func setFrom(values []string) map[string]bool {
	out := map[string]bool{}
	addAll(out, values)
	return out
}

func addAll(set map[string]bool, values []string) {
	for _, value := range values {
		if value != "" {
			set[value] = true
		}
	}
}

func sortedSet(set map[string]bool) []string {
	values := make([]string, 0, len(set))
	for value := range set {
		values = append(values, value)
	}
	sort.Strings(values)
	return values
}

func contains(values []string, value string) bool {
	for _, v := range values {
		if v == value {
			return true
		}
	}
	return false
}
