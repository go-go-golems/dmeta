package widgets

import "github.com/go-go-golems/dmeta/pkg/dmeta/validator"

type InstanceManifest struct {
	SchemaVersion     int             `yaml:"schema_version"`
	ArtifactType      string          `yaml:"artifact_type"`
	ID                string          `yaml:"id"`
	Name              string          `yaml:"name"`
	Summary           string          `yaml:"summary"`
	InstanceRoot      string          `yaml:"instance_root"`
	TemplateSources   TemplateSources `yaml:"template_sources"`
	Generation        Generation      `yaml:"generation"`
	SelectedTemplates []Selected      `yaml:"selected_templates"`
	ExcludedTemplates []Excluded      `yaml:"excluded_templates"`
}

type TemplateSources struct {
	GlobalIRRoot       string   `yaml:"global_ir_root"`
	LocalTemplateFiles []string `yaml:"local_template_files"`
}

type Generation struct {
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
	Selected Selected
	Template validator.Widget
}

type GeneratedFile struct {
	Path    string
	Content []byte
}
