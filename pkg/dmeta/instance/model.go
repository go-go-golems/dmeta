package instance

import "github.com/go-go-golems/dmeta/pkg/dmeta/validator"

type InstanceManifest struct {
	SchemaVersion     int                            `yaml:"schema_version"`
	ArtifactType      string                         `yaml:"artifact_type"`
	ID                string                         `yaml:"id"`
	Name              string                         `yaml:"name"`
	Summary           string                         `yaml:"summary"`
	SemanticRoot      string                         `yaml:"semantic_root"`
	InteractionsRoot  string                         `yaml:"interactions_root"`
	MetaDesignSystems map[string]MetaDesignSystemRef `yaml:"meta_design_systems"`
	Targets           Targets                        `yaml:"targets"`
	SelectedTemplates []Selected                     `yaml:"selected_templates"`
	ExcludedTemplates []Excluded                     `yaml:"excluded_templates"`
}

type MetaDesignSystemRef struct {
	Root          string   `yaml:"root"`
	GlobalRoot    string   `yaml:"global_root"`
	TemplateFiles []string `yaml:"template_files"`
}

type Targets struct {
	React     ReactTarget `yaml:"react"`
	PBUIReact ReactTarget `yaml:"pbui_react"`
}

type ReactTarget struct {
	TargetFile  string `yaml:"target_file"`
	OutputDir   string `yaml:"output_dir"`
	PackageName string `yaml:"package_name"`
}

type Selected struct {
	Template    string         `yaml:"template"`
	As          string         `yaml:"as"`
	Variant     string         `yaml:"variant"`
	Reason      string         `yaml:"reason"`
	Adaptations map[string]any `yaml:"adaptations"`
}

type Excluded struct {
	Template string `yaml:"template"`
	Reason   string `yaml:"reason"`
}

type ResolvedTemplate struct {
	Selected   Selected
	Template   validator.Widget
	Reflection WidgetReflection
}

type WidgetReflection struct {
	Archetypes      []ResolvedArchetypeReflection      `json:"archetypes,omitempty"`
	Capabilities    []ResolvedCapabilityReflection     `json:"capabilities,omitempty"`
	Representations []ResolvedRepresentationReflection `json:"representations,omitempty"`
}

type ResolvedArchetypeReflection struct {
	ID                           string   `json:"id"`
	Description                  string   `json:"description,omitempty"`
	LongDescription              string   `json:"longDescription,omitempty"`
	Abstract                     bool     `json:"abstract"`
	Ancestors                    []string `json:"ancestors,omitempty"`
	EffectiveDefaultCapabilities []string `json:"effectiveDefaultCapabilities,omitempty"`
}

type ResolvedCapabilityReflection struct {
	ID                       string   `json:"id"`
	Description              string   `json:"description,omitempty"`
	LongDescription          string   `json:"longDescription,omitempty"`
	Abstract                 bool     `json:"abstract"`
	Ancestors                []string `json:"ancestors,omitempty"`
	EffectiveProjectionNames []string `json:"effectiveProjectionNames,omitempty"`
	RequiredProjectionNames  []string `json:"requiredProjectionNames,omitempty"`
}

type ResolvedRepresentationReflection struct {
	ID string `json:"id"`
}

type GeneratedFile struct {
	Path    string
	Content []byte
}

type PlanFinding struct {
	Severity string
	Subject  string
	Code     string
	Message  string
	Detail   string
}
