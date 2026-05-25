package profile

import (
	"path/filepath"
	"sort"
	"strings"

	genmeta "github.com/go-go-golems/dmeta/pkg/dmeta/generator/metadata"
)

// ReactAppPlan is the concrete PBUI profile's React application planning
// result. It consumes ConcretePresentationPlan, not raw PBUI obligations, so it
// is allowed to know about concrete Street Deli CLIM views, surfaces, renderer
// components, fonts, CSS, runtime modules, and generated registry integration.
type ReactAppPlan struct {
	TargetID         string
	OutputDir        string
	PackageName      string
	ProfileID        string
	StyleProfileID   string
	Generated        genmeta.GeneratedInfo
	SemanticRoot     string
	InteractionsRoot string
	PBUIRoot         string
	ProfileRoot      string
	Files            []ReactAppPlannedFile
}

type ReactAppPlannedFile struct {
	Path               string
	Kind               string
	Symbol             string
	ViewID             string
	Component          string
	PresentationTypeID string
	SurfaceID          string
	Provenance         ReactAppFileProvenance
}

type ReactAppFileProvenance struct {
	MetaDesignSystem   string
	PresentationSystem string
	CodegenTarget      string
	StyleProfileID     string
	SourcePasses       []string
	Source             string
}

func BuildReactAppPlan(pkg *Package, concretePlan ConcretePresentationPlan, outputDir string) ReactAppPlan {
	if outputDir == "" {
		outputDir = pkg.ReactAppTarget.Defaults.OutputDir
	}
	plan := ReactAppPlan{
		TargetID:       pkg.ReactAppTarget.ID,
		OutputDir:      outputDir,
		PackageName:    pkg.ReactAppTarget.Defaults.PackageName,
		ProfileID:      pkg.Meta.ID,
		StyleProfileID: pkg.Style.ID,
		Generated:      genmeta.GeneratedInfo{By: "dmeta plan-pbui-react-app/scaffold-pbui-react-app"},
		ProfileRoot:    pkg.Root,
	}
	for _, kind := range pkg.ReactAppTarget.FileKinds {
		plan.Files = append(plan.Files, planFilesForKind(pkg, concretePlan, outputDir, kind)...)
	}
	plan.Files = dedupeAndSortReactAppFiles(plan.Files)
	return plan
}

func planFilesForKind(pkg *Package, concretePlan ConcretePresentationPlan, outputDir string, kind string) []ReactAppPlannedFile {
	base := baseReactAppProvenance(pkg)
	single := func(path, symbol string) []ReactAppPlannedFile {
		return []ReactAppPlannedFile{{Path: filepath.Join(outputDir, path), Kind: kind, Symbol: symbol, Provenance: base}}
	}
	switch kind {
	case "package_json":
		return single("package.json", pkg.ReactAppTarget.Defaults.PackageName)
	case "tsconfig":
		return single("tsconfig.json", "tsconfig")
	case "vite_config":
		return single("vite.config.ts", "viteConfig")
	case "index_html":
		return single("index.html", "indexHtml")
	case "main_tsx":
		return single(filepath.Join("src", "main.tsx"), "main")
	case "app_shell":
		return single(filepath.Join("src", "App.tsx"), "App")
	case "storybook_main":
		return single(filepath.Join(".storybook", "main.ts"), "storybookMain")
	case "storybook_preview":
		return single(filepath.Join(".storybook", "preview.tsx"), "storybookPreview")
	case "storybook_preview_css":
		return single(filepath.Join(".storybook", "preview.css"), "storybookPreviewCss")
	case "storybook_story_shell":
		return single(filepath.Join("src", "components", "storybook", "ClimStoryShell.tsx"), "ClimStoryShell")
	case "storybook_fixtures":
		return single(filepath.Join("src", "fixtures", "presentationFixtures.ts"), "presentationFixtures")
	case "clim_types":
		return single(filepath.Join("src", "clim", "types.ts"), "climTypes")
	case "clim_store":
		return single(filepath.Join("src", "clim", "store.ts"), "climStore")
	case "clim_actions":
		return single(filepath.Join("src", "clim", "actions.ts"), "climActions")
	case "clim_commands":
		return single(filepath.Join("src", "clim", "commands.ts"), "parseClimCommand")
	case "clim_selectors":
		return single(filepath.Join("src", "clim", "selectors.ts"), "climSelectors")
	case "clim_runtime":
		return single(filepath.Join("src", "clim", "runtime.ts"), "climRuntime")
	case "style_profile_css":
		return single(filepath.Join("src", "styles", "clim.css"), pkg.Style.ID)
	case "font_assets":
		return planFontAssetFiles(pkg, outputDir, kind, base)
	case "generated_registry_copy":
		return single(filepath.Join("src", "generated", "pbuiRegistries.ts"), "pbuiRegistries")
	case "metadata":
		return single(filepath.Join("src", "generated", "concretePresentationPlan.metadata.json"), "concretePresentationPlanMetadata")
	case "shell_component":
		return planNamedComponents(outputDir, kind, "src/components/shell", pkg.ReactAppTarget.PlannedComponents["shell"], base)
	case "shell_story":
		return planComponentStories(outputDir, kind, "src/components/shell", pkg.ReactAppTarget.PlannedComponents["shell"], base)
	case "command_line_component":
		return planSelectedComponents(outputDir, kind, "src/components/command", pkg.ReactAppTarget.PlannedComponents["command_surfaces"], []string{"ClimCommandLine"}, base)
	case "command_line_story":
		return planSelectedComponentStories(outputDir, kind, "src/components/command", pkg.ReactAppTarget.PlannedComponents["command_surfaces"], []string{"ClimCommandLine"}, base)
	case "command_bar_component":
		return planSelectedComponents(outputDir, kind, "src/components/command", pkg.ReactAppTarget.PlannedComponents["command_surfaces"], []string{"ClimCommandBar", "ActionHintBar"}, base)
	case "command_bar_story":
		return planSelectedComponentStories(outputDir, kind, "src/components/command", pkg.ReactAppTarget.PlannedComponents["command_surfaces"], []string{"ClimCommandBar", "ActionHintBar"}, base)
	case "context_menu_component":
		return planSelectedComponents(outputDir, kind, "src/components/command", pkg.ReactAppTarget.PlannedComponents["command_surfaces"], []string{"ClimContextMenu"}, base)
	case "context_menu_story":
		return planSelectedComponentStories(outputDir, kind, "src/components/command", pkg.ReactAppTarget.PlannedComponents["command_surfaces"], []string{"ClimContextMenu"}, base)
	case "confirm_prompt_component":
		return planSelectedComponents(outputDir, kind, "src/components/command", pkg.ReactAppTarget.PlannedComponents["command_surfaces"], []string{"ClimConfirmPrompt"}, base)
	case "confirm_prompt_story":
		return planSelectedComponentStories(outputDir, kind, "src/components/command", pkg.ReactAppTarget.PlannedComponents["command_surfaces"], []string{"ClimConfirmPrompt"}, base)
	case "presentation_component", "action_presentation_component":
		return planPresentationComponentFiles(outputDir, kind, concretePlan, base)
	case "presentation_story", "action_presentation_story":
		return planPresentationStoryFiles(outputDir, kind, concretePlan, base)
	case "view_component":
		return planViewComponentFiles(outputDir, kind, concretePlan, base)
	case "view_story":
		return planViewStoryFiles(outputDir, kind, concretePlan, base)
	default:
		return nil
	}
}

func planFontAssetFiles(pkg *Package, outputDir, kind string, base ReactAppFileProvenance) []ReactAppPlannedFile {
	fonts, ok := pkg.Style.Tokens["typography"].(map[string]any)
	if !ok {
		return nil
	}
	fontMap, ok := fonts["fonts"].(map[string]any)
	if !ok {
		return nil
	}
	var out []ReactAppPlannedFile
	for fontID, value := range fontMap {
		path, ok := value.(string)
		if !ok || strings.TrimSpace(path) == "" {
			continue
		}
		out = append(out, ReactAppPlannedFile{Path: filepath.Join(outputDir, strings.TrimPrefix(path, "/")), Kind: kind, Symbol: fontID, Provenance: withSource(base, "style-profile.typography.fonts")})
	}
	return out
}

func planNamedComponents(outputDir, kind, dir string, components []string, base ReactAppFileProvenance) []ReactAppPlannedFile {
	var out []ReactAppPlannedFile
	for _, component := range components {
		out = append(out, ReactAppPlannedFile{Path: filepath.Join(outputDir, dir, component+".tsx"), Kind: kind, Symbol: component, Component: component, Provenance: withSource(base, "react-app-target.planned_components")})
	}
	return out
}

func planSelectedComponents(outputDir, kind, dir string, components []string, selected []string, base ReactAppFileProvenance) []ReactAppPlannedFile {
	selectedSet := map[string]bool{}
	for _, value := range selected {
		selectedSet[value] = true
	}
	var filtered []string
	for _, component := range components {
		if selectedSet[component] {
			filtered = append(filtered, component)
		}
	}
	return planNamedComponents(outputDir, kind, dir, filtered, base)
}

func planComponentStories(outputDir, kind, dir string, components []string, base ReactAppFileProvenance) []ReactAppPlannedFile {
	var out []ReactAppPlannedFile
	for _, component := range components {
		out = append(out, ReactAppPlannedFile{Path: filepath.Join(outputDir, dir, component+".stories.tsx"), Kind: kind, Symbol: component + "Stories", Component: component, Provenance: withSource(base, "react-app-target.storybook")})
	}
	return out
}

func planSelectedComponentStories(outputDir, kind, dir string, components []string, selected []string, base ReactAppFileProvenance) []ReactAppPlannedFile {
	selectedSet := map[string]bool{}
	for _, value := range selected {
		selectedSet[value] = true
	}
	var filtered []string
	for _, component := range components {
		if selectedSet[component] {
			filtered = append(filtered, component)
		}
	}
	return planComponentStories(outputDir, kind, dir, filtered, base)
}

func planPresentationComponentFiles(outputDir, kind string, concretePlan ConcretePresentationPlan, base ReactAppFileProvenance) []ReactAppPlannedFile {
	byComponent := map[string]ReactAppPlannedFile{}
	for _, view := range concretePlan.Views {
		for _, presentation := range view.Presentations {
			if kind == "action_presentation_component" && presentation.PresentationTypeID != "pbui.action_presentation" {
				continue
			}
			if kind == "presentation_component" && presentation.PresentationTypeID == "pbui.action_presentation" {
				continue
			}
			path := filepath.Join(outputDir, "src", "components", "presentations", presentation.Component+".tsx")
			existing := byComponent[path]
			if existing.Path == "" {
				existing = ReactAppPlannedFile{Path: path, Kind: kind, Symbol: presentation.Component, Component: presentation.Component, PresentationTypeID: presentation.PresentationTypeID, SurfaceID: presentation.SurfaceID, Provenance: withSource(base, "concrete-presentation-plan.presentations")}
			}
			byComponent[path] = existing
		}
	}
	out := make([]ReactAppPlannedFile, 0, len(byComponent))
	for _, file := range byComponent {
		out = append(out, file)
	}
	return out
}

func planPresentationStoryFiles(outputDir, kind string, concretePlan ConcretePresentationPlan, base ReactAppFileProvenance) []ReactAppPlannedFile {
	byComponent := map[string]ReactAppPlannedFile{}
	for _, view := range concretePlan.Views {
		for _, presentation := range view.Presentations {
			if kind == "action_presentation_story" && presentation.PresentationTypeID != "pbui.action_presentation" {
				continue
			}
			if kind == "presentation_story" && presentation.PresentationTypeID == "pbui.action_presentation" {
				continue
			}
			path := filepath.Join(outputDir, "src", "components", "presentations", presentation.Component+".stories.tsx")
			existing := byComponent[path]
			if existing.Path == "" {
				existing = ReactAppPlannedFile{Path: path, Kind: kind, Symbol: presentation.Component + "Stories", Component: presentation.Component, PresentationTypeID: presentation.PresentationTypeID, SurfaceID: presentation.SurfaceID, Provenance: withSource(base, "concrete-presentation-plan.stories")}
			}
			byComponent[path] = existing
		}
	}
	out := make([]ReactAppPlannedFile, 0, len(byComponent))
	for _, file := range byComponent {
		out = append(out, file)
	}
	return out
}

func planViewComponentFiles(outputDir, kind string, concretePlan ConcretePresentationPlan, base ReactAppFileProvenance) []ReactAppPlannedFile {
	var out []ReactAppPlannedFile
	for _, view := range concretePlan.Views {
		component := toPascal(view.ID) + "View"
		out = append(out, ReactAppPlannedFile{Path: filepath.Join(outputDir, "src", "views", component+".tsx"), Kind: kind, Symbol: component, ViewID: view.ID, Component: component, SurfaceID: view.SurfaceID, Provenance: withSource(base, "concrete-presentation-plan.views")})
	}
	return out
}

func planViewStoryFiles(outputDir, kind string, concretePlan ConcretePresentationPlan, base ReactAppFileProvenance) []ReactAppPlannedFile {
	var out []ReactAppPlannedFile
	for _, view := range concretePlan.Views {
		component := toPascal(view.ID) + "View"
		out = append(out, ReactAppPlannedFile{Path: filepath.Join(outputDir, "src", "views", component+".stories.tsx"), Kind: kind, Symbol: component + "Stories", ViewID: view.ID, Component: component, SurfaceID: view.SurfaceID, Provenance: withSource(base, "concrete-presentation-plan.view-stories")})
	}
	return out
}

func baseReactAppProvenance(pkg *Package) ReactAppFileProvenance {
	return ReactAppFileProvenance{
		MetaDesignSystem:   pkg.ReactAppTarget.Provenance.MetaDesignSystem,
		PresentationSystem: pkg.ReactAppTarget.Provenance.PresentationSystem,
		CodegenTarget:      pkg.ReactAppTarget.Provenance.CodegenTarget,
		StyleProfileID:     pkg.Style.ID,
		SourcePasses:       append([]string{}, pkg.ReactAppTarget.Provenance.SourcePasses...),
	}
}

func withSource(provenance ReactAppFileProvenance, source string) ReactAppFileProvenance {
	provenance.Source = source
	return provenance
}

func dedupeAndSortReactAppFiles(files []ReactAppPlannedFile) []ReactAppPlannedFile {
	byPathKind := map[string]ReactAppPlannedFile{}
	for _, file := range files {
		key := file.Path + "\x00" + file.Kind
		byPathKind[key] = file
	}
	out := make([]ReactAppPlannedFile, 0, len(byPathKind))
	for _, file := range byPathKind {
		out = append(out, file)
	}
	sort.SliceStable(out, func(i, j int) bool {
		if out[i].Path != out[j].Path {
			return out[i].Path < out[j].Path
		}
		return out[i].Kind < out[j].Kind
	})
	return out
}

func toPascal(value string) string {
	parts := strings.FieldsFunc(value, func(r rune) bool {
		return r == '_' || r == '-' || r == '.'
	})
	for i, part := range parts {
		if part == "" {
			continue
		}
		parts[i] = strings.ToUpper(part[:1]) + part[1:]
	}
	return strings.Join(parts, "")
}
