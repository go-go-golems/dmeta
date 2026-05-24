package web

import "github.com/go-go-golems/dmeta/pkg/dmeta/validator"

type Package struct {
	Root          string
	Meta          MetaDesignSystemFile
	LoweringRules LoweringRulesFile
	Widgets       map[string]validator.Widget
}

type MetaDesignSystemFile struct {
	SchemaVersion int               `yaml:"schema_version"`
	ArtifactType  string            `yaml:"artifact_type"`
	ID            string            `yaml:"id"`
	Name          string            `yaml:"name"`
	Summary       string            `yaml:"summary"`
	LongSummary   string            `yaml:"long_summary"`
	Status        string            `yaml:"status"`
	Files         map[string]string `yaml:"files"`
	Validation    map[string]any    `yaml:"validation"`
}

type LoweringRulesFile struct {
	SchemaVersion int            `yaml:"schema_version"`
	ArtifactType  string         `yaml:"artifact_type"`
	Summary       string         `yaml:"summary"`
	LongSummary   string         `yaml:"long_summary"`
	Rules         []LoweringRule `yaml:"rules"`
}

type LoweringRule struct {
	ID          string           `yaml:"id"`
	Description string           `yaml:"description"`
	When        LoweringSelector `yaml:"when"`
	Emits       LoweringEmits    `yaml:"emits"`
	Extra       map[string]any   `yaml:",inline"`
}

type LoweringSelector struct {
	DomainTypes     []string `yaml:"domain_types"`
	Representations []string `yaml:"representations"`
	Actions         []string `yaml:"actions"`
}

type LoweringEmits struct {
	WidgetTemplates []string `yaml:"widget_templates"`
	Slots           []string `yaml:"slots"`
	VisualStates    []string `yaml:"visual_states"`
	EventBindings   []string `yaml:"event_bindings"`
}

type Obligation struct {
	ExampleID             string
	DomainTypeID          string
	WidgetTemplateID      string
	Slots                 []string
	VisualStates          []string
	EventBindings         []string
	SourceRuleID          string
	SourceRepresentations []string
	SourceActions         []string
	Description           string
}
