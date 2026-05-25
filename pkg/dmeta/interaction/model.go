package interaction

import "github.com/go-go-golems/dmeta/pkg/dmeta/validator"

type Package struct {
	Root            string
	Index           IndexFile
	ActionsFile     ActionsFile
	Representations RepresentationsFile
	RulesFile       ElaborationRulesFile
}

type IndexFile struct {
	SchemaVersion int               `yaml:"schema_version"`
	ArtifactType  string            `yaml:"artifact_type"`
	Summary       string            `yaml:"summary"`
	Status        string            `yaml:"status"`
	Inherits      map[string]string `yaml:"inherits"`
	Files         map[string]string `yaml:"files"`
	Validation    map[string]any    `yaml:"validation"`
}

type ActionsFile struct {
	SchemaVersion int               `yaml:"schema_version"`
	ArtifactType  string            `yaml:"artifact_type"`
	Summary       string            `yaml:"summary"`
	LongSummary   string            `yaml:"long_summary"`
	Actions       map[string]Action `yaml:"actions"`
}

type RepresentationsFile struct {
	SchemaVersion   int                       `yaml:"schema_version"`
	ArtifactType    string                    `yaml:"artifact_type"`
	Summary         string                    `yaml:"summary"`
	LongSummary     string                    `yaml:"long_summary"`
	Representations map[string]Representation `yaml:"representations"`
}

type ElaborationRulesFile struct {
	SchemaVersion int               `yaml:"schema_version"`
	ArtifactType  string            `yaml:"artifact_type"`
	Summary       string            `yaml:"summary"`
	Rules         []ElaborationRule `yaml:"rules"`
}

type SemanticSelector struct {
	AllArchetypes   []string `yaml:"all_archetypes"`
	AnyArchetypes   []string `yaml:"any_archetypes"`
	AllCapabilities []string `yaml:"all_capabilities"`
	AnyCapabilities []string `yaml:"any_capabilities"`
	DomainTypes     []string `yaml:"domain_types"`
	Excludes        []string `yaml:"excludes"`
}

type Action struct {
	Description     string                 `yaml:"description"`
	LongDescription string                 `yaml:"long_description"`
	Extends         []string               `yaml:"extends"`
	Abstract        bool                   `yaml:"abstract"`
	Intent          string                 `yaml:"intent"`
	Subjects        []SemanticSelector     `yaml:"subjects"`
	Inputs          map[string]ActionInput `yaml:"inputs"`
	Effects         ActionEffects          `yaml:"effects"`
	Result          validator.ActionResult `yaml:"result"`
	Safety          ActionSafety           `yaml:"safety"`
	Notes           string                 `yaml:"notes"`
	Extra           map[string]any         `yaml:",inline"`
}

type ActionInput struct {
	Type        string             `yaml:"type"`
	Required    bool               `yaml:"required"`
	Accepts     []SemanticSelector `yaml:"accepts"`
	Description string             `yaml:"description"`
}

type ActionEffects struct {
	Scope          string `yaml:"scope"`
	MutatesBackend bool   `yaml:"mutates_backend"`
}

type ActionSafety struct {
	RequiresConfirmation bool `yaml:"requires_confirmation"`
	Reversible           bool `yaml:"reversible"`
}

type Representation struct {
	Description     string                `yaml:"description"`
	LongDescription string                `yaml:"long_description"`
	Extends         []string              `yaml:"extends"`
	Abstract        bool                  `yaml:"abstract"`
	Intent          string                `yaml:"intent"`
	Subjects        []SemanticSelector    `yaml:"subjects"`
	Exposes         RepresentationExposes `yaml:"exposes"`
	SupportsActions []string              `yaml:"supports_actions"`
	Constraints     map[string]any        `yaml:"constraints"`
	Notes           string                `yaml:"notes"`
	Extra           map[string]any        `yaml:",inline"`
}

type RepresentationExposes struct {
	RequiredProjections    []string `yaml:"required_projections"`
	RecommendedProjections []string `yaml:"recommended_projections"`
	OptionalProjections    []string `yaml:"optional_projections"`
}

type ElaborationRule struct {
	ID          string           `yaml:"id"`
	When        SemanticSelector `yaml:"when"`
	Emits       RuleEmits        `yaml:"emits"`
	Description string           `yaml:"description"`
}

type RuleEmits struct {
	Representations []string `yaml:"representations"`
	Actions         []string `yaml:"actions"`
}

const (
	RootActionID         = "Action"
	RootRepresentationID = "Representation"
)
