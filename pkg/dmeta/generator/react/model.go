package react

import (
	genmeta "github.com/go-go-golems/dmeta/pkg/dmeta/generator/metadata"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

type TargetFile struct {
	SchemaVersion int              `yaml:"schema_version"`
	ArtifactType  string           `yaml:"artifact_type"`
	ID            string           `yaml:"id"`
	Name          string           `yaml:"name"`
	Summary       string           `yaml:"summary"`
	LongSummary   string           `yaml:"long_summary"`
	Status        string           `yaml:"status"`
	Defaults      TargetDefaults   `yaml:"defaults"`
	FileKinds     []string         `yaml:"file_kinds"`
	Provenance    TargetProvenance `yaml:"provenance"`
}

type TargetDefaults struct {
	OutputDir        string               `yaml:"output_dir"`
	PackageName      string               `yaml:"package_name"`
	Style            string               `yaml:"style"`
	Storybook        bool                 `yaml:"storybook"`
	MetadataSidecars bool                 `yaml:"metadata_sidecars"`
	ComponentLayout  ReactComponentLayout `yaml:"component_layout"`
}

type ReactComponentLayout struct {
	Strategy string            `yaml:"strategy"`
	Dirs     map[string]string `yaml:"dirs"`
}

type TargetProvenance struct {
	MetaDesignSystem string   `yaml:"meta_design_system"`
	CodegenTarget    string   `yaml:"codegen_target"`
	SourcePasses     []string `yaml:"source_passes"`
}

type ScaffoldPlan struct {
	InstanceID       string
	TargetID         string
	MetaDesignSystem string
	OutputDir        string
	PackageName      string
	Generated        genmeta.GeneratedInfo
	SemanticRoot     string
	InteractionsRoot string
	WebRoot          string
	TargetFile       string
	Components       []ComponentPlan
	Files            []PlannedFile
}

type ComponentPlan struct {
	TemplateID              string
	ComponentName           string
	Variant                 string
	OutputDir               string
	ComponentDir            string
	PackageExportPath       string
	PackageName             string
	Template                validator.Widget
	ComponentKind           string
	ComponentSpecificity    string
	ComponentFamily         string
	ComponentRole           string
	ComponentLifecycle      string
	Slots                   []string
	VisualStates            []string
	EventBindings           []string
	RealizesActions         []string
	RealizesRepresentations []string
	SourceDomainTypes       []string
	SourceRules             []string
	Files                   []PlannedFile
}

type PlannedFile struct {
	Path       string
	Kind       string
	Symbol     string
	Lifecycle  string
	Provenance FileProvenance
}

type FileProvenance struct {
	MetaDesignSystem string
	CodegenTarget    string
	TemplateID       string
	ComponentName    string
	Representations  []string
	Actions          []string
	DomainTypes      []string
	SourceRules      []string
	Passes           []string
}
