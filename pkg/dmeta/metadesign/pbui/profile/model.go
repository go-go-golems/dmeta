package profile

// Package is a loaded concrete PBUI presentation-system profile.
//
// The global PBUI package defines abstract presentation obligations. A profile
// package instantiates those obligations as a concrete presentation system: a
// visual style, shell surfaces, view model set, renderer bindings, and target
// app metadata.
type Package struct {
	Root                 string
	Meta                 PresentationSystemFile
	Style                StyleProfileFile
	Surfaces             SurfacesFile
	ViewModels           ViewModelsFile
	PresentationBindings PresentationBindingsFile
	ReactAppTarget       ReactAppTargetFile
}

type PresentationSystemFile struct {
	SchemaVersion int               `yaml:"schema_version"`
	ArtifactType  string            `yaml:"artifact_type"`
	ID            string            `yaml:"id"`
	Name          string            `yaml:"name"`
	Summary       string            `yaml:"summary"`
	Intent        string            `yaml:"intent"`
	LongSummary   string            `yaml:"long_summary"`
	Status        string            `yaml:"status"`
	Inherits      map[string]string `yaml:"inherits"`
	References    map[string]string `yaml:"references"`
	Files         map[string]string `yaml:"files"`
	Validation    map[string]any    `yaml:"validation"`
	Notes         string            `yaml:"notes"`
}

type StyleProfileFile struct {
	SchemaVersion int                   `yaml:"schema_version"`
	ArtifactType  string                `yaml:"artifact_type"`
	ID            string                `yaml:"id"`
	Name          string                `yaml:"name"`
	Summary       string                `yaml:"summary"`
	Intent        string                `yaml:"intent"`
	Source        SourceRef             `yaml:"source"`
	Tokens        map[string]any        `yaml:"tokens"`
	Classes       map[string]string     `yaml:"classes"`
	StateStyles   map[string]StateStyle `yaml:"state_styles"`
	Notes         string                `yaml:"notes"`
}

type SourceRef struct {
	File      string `yaml:"file"`
	Rationale string `yaml:"rationale"`
}

type StateStyle struct {
	Summary              string `yaml:"summary"`
	CompatibleColorToken string `yaml:"compatible_color_token"`
}

type SurfacesFile struct {
	SchemaVersion int                `yaml:"schema_version"`
	ArtifactType  string             `yaml:"artifact_type"`
	Summary       string             `yaml:"summary"`
	Intent        string             `yaml:"intent"`
	Source        SourceRef          `yaml:"source"`
	Surfaces      map[string]Surface `yaml:"surfaces"`
	Notes         string             `yaml:"notes"`
}

type Surface struct {
	Component string          `yaml:"component"`
	Summary   string          `yaml:"summary"`
	Intent    string          `yaml:"intent"`
	Regions   []SurfaceRegion `yaml:"regions"`
	Role      string          `yaml:"role"`
}

type SurfaceRegion struct {
	ID             string `yaml:"id"`
	Role           string `yaml:"role"`
	Component      string `yaml:"component"`
	SourceSelector string `yaml:"source_selector"`
}

type ViewModelsFile struct {
	SchemaVersion int             `yaml:"schema_version"`
	ArtifactType  string          `yaml:"artifact_type"`
	Summary       string          `yaml:"summary"`
	Intent        string          `yaml:"intent"`
	Source        SourceRef       `yaml:"source"`
	Views         map[string]View `yaml:"views"`
	Notes         string          `yaml:"notes"`
}

type View struct {
	ModeLabel            string   `yaml:"mode_label"`
	SourceViewID         string   `yaml:"source_view_id"`
	SourceRenderer       string   `yaml:"source_renderer"`
	Summary              string   `yaml:"summary"`
	PresenterIntent      string   `yaml:"presenter_intent"`
	RecognizerIntent     string   `yaml:"recognizer_intent"`
	PrimaryPresentations []string `yaml:"primary_presentations"`
	CommandEcho          string   `yaml:"command_echo"`
	CommandEchoTemplate  string   `yaml:"command_echo_template"`
	DefaultActions       []string `yaml:"default_actions"`
}

type PresentationBindingsFile struct {
	SchemaVersion int                            `yaml:"schema_version"`
	ArtifactType  string                         `yaml:"artifact_type"`
	Summary       string                         `yaml:"summary"`
	Intent        string                         `yaml:"intent"`
	Source        map[string]string              `yaml:"source"`
	Bindings      map[string]PresentationBinding `yaml:"bindings"`
	Notes         string                         `yaml:"notes"`
}

type PresentationBinding struct {
	Component        string                     `yaml:"component"`
	Summary          string                     `yaml:"summary"`
	Intent           string                     `yaml:"intent"`
	Display          map[string]any             `yaml:"display"`
	Placement        map[string]string          `yaml:"placement"`
	Classes          map[string]string          `yaml:"classes"`
	EventBindings    map[string]string          `yaml:"event_bindings"`
	DataAttributes   []string                   `yaml:"data_attributes"`
	Subpresentations map[string]Subpresentation `yaml:"subpresentations"`
}

type Subpresentation struct {
	Component string            `yaml:"component"`
	Classes   map[string]string `yaml:"classes"`
}

type ReactAppTargetFile struct {
	SchemaVersion     int                 `yaml:"schema_version"`
	ArtifactType      string              `yaml:"artifact_type"`
	ID                string              `yaml:"id"`
	Name              string              `yaml:"name"`
	Summary           string              `yaml:"summary"`
	Intent            string              `yaml:"intent"`
	Status            string              `yaml:"status"`
	Defaults          ReactAppDefaults    `yaml:"defaults"`
	FileKinds         []string            `yaml:"file_kinds"`
	PlannedComponents map[string][]string `yaml:"planned_components"`
	RuntimeContract   RuntimeContract     `yaml:"runtime_contract"`
	Provenance        ReactAppProvenance  `yaml:"provenance"`
	Notes             string              `yaml:"notes"`
}

type ReactAppDefaults struct {
	OutputDir        string `yaml:"output_dir"`
	PackageName      string `yaml:"package_name"`
	Vite             bool   `yaml:"vite"`
	Storybook        bool   `yaml:"storybook"`
	MetadataSidecars bool   `yaml:"metadata_sidecars"`
	DryRunFirst      bool   `yaml:"dry_run_first"`
}

type RuntimeContract struct {
	StateModel             string   `yaml:"state_model"`
	InteractionStates      []string `yaml:"interaction_states"`
	RequiredHooks          []string `yaml:"required_hooks"`
	RequiredRuntimeModules []string `yaml:"required_runtime_modules"`
}

type ReactAppProvenance struct {
	MetaDesignSystem   string   `yaml:"meta_design_system"`
	PresentationSystem string   `yaml:"presentation_system"`
	CodegenTarget      string   `yaml:"codegen_target"`
	SourcePasses       []string `yaml:"source_passes"`
}
