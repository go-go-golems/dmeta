package pbui

// Package describes a loaded PBUI/CLIM MetaDesignSystem source package.
//
// PBUI sits below the universal Semantic and Interaction IR packages but above
// concrete targets such as React. It owns presentation-system concepts:
// presentation types, presenter intent, recognizer intent, and lowering rules
// that explain why an Interaction IR obligation should become a typed
// presentation obligation.
type Package struct {
	Root                         string
	Meta                         MetaDesignSystemFile
	PresentationTypes            PresentationTypesFile
	LoweringRules                LoweringRulesFile
	ReactTarget                  ReactTargetFile
	DuplicatePresentationTypeIDs []string
}

type MetaDesignSystemFile struct {
	SchemaVersion int               `yaml:"schema_version"`
	ArtifactType  string            `yaml:"artifact_type"`
	ID            string            `yaml:"id"`
	Name          string            `yaml:"name"`
	Summary       string            `yaml:"summary"`
	LongSummary   string            `yaml:"long_summary"`
	Intent        string            `yaml:"intent"`
	Status        string            `yaml:"status"`
	Files         map[string]string `yaml:"files"`
	Validation    map[string]any    `yaml:"validation"`
	Notes         string            `yaml:"notes"`
}

type PresentationTypesFile struct {
	SchemaVersion     int                         `yaml:"schema_version"`
	ArtifactType      string                      `yaml:"artifact_type"`
	Summary           string                      `yaml:"summary"`
	LongSummary       string                      `yaml:"long_summary"`
	PresentationTypes map[string]PresentationType `yaml:"presentation_types"`
}

type PresentationType struct {
	Name        string           `yaml:"name"`
	Summary     string           `yaml:"summary"`
	Intent      string           `yaml:"intent"`
	Description string           `yaml:"description"`
	Presents    Presents         `yaml:"presents"`
	Realizes    Realizes         `yaml:"realizes"`
	Roles       []string         `yaml:"roles"`
	Presenter   TranslatorIntent `yaml:"presenter"`
	Recognizer  TranslatorIntent `yaml:"recognizer"`
	Notes       string           `yaml:"notes"`
	Extra       map[string]any   `yaml:",inline"`
}

type Presents struct {
	ObjectTypes       []string `yaml:"object_types"`
	TypeDescriptors   bool     `yaml:"type_descriptors"`
	ActionDescriptors bool     `yaml:"action_descriptors"`
}

type Realizes struct {
	Representations []string `yaml:"representations"`
	Actions         []string `yaml:"actions"`
}

type TranslatorIntent struct {
	Intent               string `yaml:"intent"`
	PreferredTargetShape string `yaml:"preferred_target_shape"`
	Notes                string `yaml:"notes"`
}

type LoweringRulesFile struct {
	SchemaVersion int            `yaml:"schema_version"`
	ArtifactType  string         `yaml:"artifact_type"`
	Summary       string         `yaml:"summary"`
	LongSummary   string         `yaml:"long_summary"`
	Rules         []LoweringRule `yaml:"rules"`
}

type LoweringRule struct {
	ID               string           `yaml:"id"`
	Description      string           `yaml:"description"`
	Rationale        string           `yaml:"rationale"`
	When             LoweringSelector `yaml:"when"`
	Emits            LoweringEmits    `yaml:"emits"`
	PresenterIntent  string           `yaml:"presenter_intent"`
	RecognizerIntent string           `yaml:"recognizer_intent"`
	Extra            map[string]any   `yaml:",inline"`
}

type LoweringSelector struct {
	DomainTypes     []string `yaml:"domain_types"`
	Representations []string `yaml:"representations"`
	Actions         []string `yaml:"actions"`
}

type LoweringEmits struct {
	PresentationTypes []string `yaml:"presentation_types"`
}

type ReactTargetFile struct {
	SchemaVersion int                 `yaml:"schema_version"`
	ArtifactType  string              `yaml:"artifact_type"`
	ID            string              `yaml:"id"`
	Name          string              `yaml:"name"`
	Summary       string              `yaml:"summary"`
	LongSummary   string              `yaml:"long_summary"`
	Intent        string              `yaml:"intent"`
	Defaults      ReactTargetDefaults `yaml:"defaults"`
	FileKinds     []string            `yaml:"file_kinds"`
	Provenance    ReactProvenance     `yaml:"provenance"`
	RuntimeNotes  map[string]string   `yaml:"runtime_notes"`
	Extra         map[string]any      `yaml:",inline"`
}

type ReactTargetDefaults struct {
	OutputDir        string `yaml:"output_dir"`
	PackageName      string `yaml:"package_name"`
	Storybook        bool   `yaml:"storybook"`
	MetadataSidecars bool   `yaml:"metadata_sidecars"`
	DryRunFirst      bool   `yaml:"dry_run_first"`
}

type ReactProvenance struct {
	MetaDesignSystem string   `yaml:"meta_design_system"`
	CodegenTarget    string   `yaml:"codegen_target"`
	SourcePasses     []string `yaml:"source_passes"`
}
