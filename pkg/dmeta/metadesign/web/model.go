package web

import "github.com/go-go-golems/dmeta/pkg/dmeta/validator"

type Package struct {
	Root            string
	Meta            MetaDesignSystemFile
	LoweringRules   LoweringRulesFile
	ComponentSystem *ComponentSystemFile
	Widgets         map[string]validator.Widget
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

type ComponentSystemFile struct {
	SchemaVersion    int                       `yaml:"schema_version"`
	ArtifactType     string                    `yaml:"artifact_type"`
	ID               string                    `yaml:"id"`
	Name             string                    `yaml:"name"`
	Summary          string                    `yaml:"summary"`
	LongSummary      string                    `yaml:"long_summary"`
	Status           string                    `yaml:"status"`
	Levels           map[string]ComponentLevel `yaml:"levels"`
	Specificity      SpecificityPolicy         `yaml:"specificity"`
	CompositionRules CompositionRules          `yaml:"composition_rules"`
	LoweringRules    ComponentLoweringPolicy   `yaml:"lowering_rules"`
	Notes            []string                  `yaml:"notes"`
}

type ComponentLevel struct {
	Description             string   `yaml:"description"`
	CanBeEmittedByLowering  bool     `yaml:"can_be_emitted_by_lowering"`
	LayoutScope             string   `yaml:"layout_scope"`
	BehaviorScope           string   `yaml:"behavior_scope"`
	AllowedChildren         []string `yaml:"allowed_children"`
	DefaultGenerationPolicy string   `yaml:"default_generation_policy"`
	RequiredIntentFields    []string `yaml:"required_intent_fields"`
	Examples                []string `yaml:"examples"`
}

type SpecificityPolicy struct {
	Allowed []string `yaml:"allowed"`
	Default string   `yaml:"default"`
}

type CompositionRules struct {
	RequireKnownTemplate             bool `yaml:"require_known_template"`
	RequireIntentPerEdge             bool `yaml:"require_intent_per_edge"`
	ForbidCycles                     bool `yaml:"forbid_cycles"`
	ResolveDependencyClosureForReact bool `yaml:"resolve_dependency_closure_for_react"`
}

type ComponentLoweringPolicy struct {
	EmittedTemplateLevels               []string `yaml:"emitted_template_levels"`
	DependencyOnlyLevels                []string `yaml:"dependency_only_levels"`
	WarnWhenEmittingDependencyOnlyLevel bool     `yaml:"warn_when_emitting_dependency_only_level"`
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
