package validator

type Package struct {
	Root           string
	Index          IndexFile
	CoreModel      CoreModelFile
	DesignLanguage DesignLanguageFile
	Widgets        WidgetIRFile
}

type IndexFile struct {
	SchemaVersion int                      `yaml:"schema_version"`
	ArtifactType  string                   `yaml:"artifact_type"`
	Summary       string                   `yaml:"summary"`
	Status        string                   `yaml:"status"`
	Artifacts     map[string]IndexArtifact `yaml:"artifacts"`
	References    map[string]string        `yaml:"references"`
	Validation    map[string]bool          `yaml:"validation"`
}

type IndexArtifact struct {
	Path         string   `yaml:"path"`
	ArtifactType string   `yaml:"artifact_type"`
	Description  string   `yaml:"description"`
	Consumers    []string `yaml:"consumers"`
}

type CoreModelFile struct {
	SchemaVersion  int                      `yaml:"schema_version"`
	ArtifactType   string                   `yaml:"artifact_type"`
	Summary        string                   `yaml:"summary"`
	Status         string                   `yaml:"status"`
	LogicalTypes   LogicalTypes             `yaml:"logical_types"`
	Archetypes     map[string]Archetype     `yaml:"archetypes"`
	Capabilities   map[string]Capability    `yaml:"capabilities"`
	Presentations  map[string]Presentation  `yaml:"presentations"`
	Actions        map[string]Action        `yaml:"actions"`
	DomainExamples map[string]DomainExample `yaml:"domain_examples"`
	Validation     map[string]any           `yaml:"validation"`
}

type LogicalTypes struct {
	Primitives  []string `yaml:"primitives"`
	Collections []string `yaml:"collections"`
}

type Archetype struct {
	Description              string   `yaml:"description"`
	DefaultCapabilities      []string `yaml:"default_capabilities"`
	RecommendedPresentations []string `yaml:"recommended_presentations"`
	Examples                 []string `yaml:"examples"`
	Notes                    string   `yaml:"notes"`
}

type Capability struct {
	Description   string                `yaml:"description"`
	Projections   map[string]Projection `yaml:"projections"`
	Presentations []string              `yaml:"presentations"`
	Actions       []string              `yaml:"actions"`
	Filters       []string              `yaml:"filters"`
	Notes         string                `yaml:"notes"`
}

type Projection struct {
	Type        string `yaml:"type"`
	Required    bool   `yaml:"required"`
	Description string `yaml:"description"`
}

type Presentation struct {
	Description string          `yaml:"description"`
	Layer       string          `yaml:"layer"`
	AppliesTo   AppliesTo       `yaml:"applies_to"`
	Requires    []string        `yaml:"requires"`
	RequiresAny []string        `yaml:"requires_any"`
	Optional    []string        `yaml:"optional"`
	Role        string          `yaml:"role"`
	Density     string          `yaml:"density"`
	Interaction map[string]bool `yaml:"interaction"`
	StyleRecipe string          `yaml:"style_recipe"`
	Fallbacks   []string        `yaml:"fallbacks"`
	Extra       map[string]any  `yaml:",inline"`
}

type AppliesTo struct {
	Capabilities []string `yaml:"capabilities"`
	Archetypes   []string `yaml:"archetypes"`
	DomainTypes  []string `yaml:"domain_types"`
}

type Action struct {
	Description string              `yaml:"description"`
	Category    string              `yaml:"category"`
	Accepts     []Selector          `yaml:"accepts"`
	Arguments   map[string]Argument `yaml:"arguments"`
	Result      ActionResult        `yaml:"result"`
}

type Selector struct {
	Capability           string   `yaml:"capability"`
	Archetype            string   `yaml:"archetype"`
	Presentation         string   `yaml:"presentation"`
	DomainType           string   `yaml:"domain_type"`
	RequiresCapabilities []string `yaml:"requires_capabilities"`
}

type Argument struct {
	Mode     string     `yaml:"mode"`
	Required bool       `yaml:"required"`
	Accepts  []Selector `yaml:"accepts"`
}

type ActionResult struct {
	Kind string `yaml:"kind"`
}

type DomainExample struct {
	Description string                `yaml:"description"`
	DomainTypes map[string]DomainType `yaml:"domain_types"`
}

type DomainType struct {
	Description  string                    `yaml:"description"`
	Archetypes   []string                  `yaml:"archetypes"`
	Capabilities map[string]map[string]any `yaml:"capabilities"`
}

type DesignLanguageFile struct {
	SchemaVersion       int                           `yaml:"schema_version"`
	ArtifactType        string                        `yaml:"artifact_type"`
	Summary             string                        `yaml:"summary"`
	Status              string                        `yaml:"status"`
	Mode                string                        `yaml:"mode"`
	ThemeAxes           map[string]ThemeAxis          `yaml:"theme_axes"`
	Typography          Typography                    `yaml:"typography"`
	Density             Density                       `yaml:"density"`
	Spacing             Spacing                       `yaml:"spacing"`
	Color               map[string]any                `yaml:"color"`
	Borders             map[string]any                `yaml:"borders"`
	Elevation           map[string]any                `yaml:"elevation"`
	Layout              map[string]any                `yaml:"layout"`
	PresentationRecipes map[string]PresentationRecipe `yaml:"presentation_recipes"`
	InteractionStates   InteractionStates             `yaml:"interaction_states"`
	DataAttributes      map[string]any                `yaml:"data_attributes"`
	LintRules           map[string]LintRule           `yaml:"lint_rules"`
	Validation          map[string]any                `yaml:"validation"`
}

type ThemeAxis struct {
	Values  []string `yaml:"values"`
	Default string   `yaml:"default"`
}

type Typography struct {
	Families map[string]TypographyFamily `yaml:"families"`
	Roles    map[string]TypographyRole   `yaml:"roles"`
}

type TypographyFamily struct {
	Role     string   `yaml:"role"`
	Examples []string `yaml:"examples"`
}

type TypographyRole struct {
	Family          string    `yaml:"family"`
	SizeRange       []float64 `yaml:"size_range"`
	WeightRange     []float64 `yaml:"weight_range"`
	LineHeightRange []float64 `yaml:"line_height_range"`
	Transform       string    `yaml:"transform"`
	TrackingRange   []string  `yaml:"tracking_range"`
	Numeric         string    `yaml:"numeric"`
	Purpose         string    `yaml:"purpose"`
}

type Density struct {
	Modes map[string]DensityMode `yaml:"modes"`
}

type DensityMode struct {
	RowHeightRange    []float64 `yaml:"row_height_range"`
	CellPaddingXRange []float64 `yaml:"cell_padding_x_range"`
	CellPaddingYRange []float64 `yaml:"cell_padding_y_range"`
	FontBodyRange     []float64 `yaml:"font_body_range"`
}

type Spacing struct {
	BaseGrid int      `yaml:"base_grid"`
	Tokens   []int    `yaml:"tokens"`
	Rules    []string `yaml:"rules"`
}

type PresentationRecipe struct {
	Typography   string   `yaml:"typography"`
	Density      string   `yaml:"density"`
	Affordances  []string `yaml:"affordances"`
	States       []string `yaml:"states"`
	ColorSource  string   `yaml:"color_source"`
	Shape        string   `yaml:"shape"`
	RowTreatment string   `yaml:"row_treatment"`
	Alignment    string   `yaml:"alignment"`
	Numeric      string   `yaml:"numeric"`
}

type InteractionStates struct {
	States map[string]InteractionState `yaml:"states"`
	Rules  []string                    `yaml:"rules"`
}

type InteractionState struct {
	Purpose string `yaml:"purpose"`
}

type LintRule struct {
	Severity    string `yaml:"severity"`
	Description string `yaml:"description"`
}

type WidgetIRFile struct {
	SchemaVersion int            `yaml:"schema_version"`
	ArtifactType  string         `yaml:"artifact_type"`
	Summary       string         `yaml:"summary"`
	Status        string         `yaml:"status"`
	Widgets       []Widget       `yaml:"widgets"`
	Validation    map[string]any `yaml:"validation"`
}

type Widget struct {
	ID             string            `yaml:"id"`
	Name           string            `yaml:"name"`
	Status         string            `yaml:"status"`
	Classification map[string]any    `yaml:"classification"`
	Intent         WidgetIntent      `yaml:"intent"`
	Consumes       Consumes          `yaml:"consumes"`
	Contract       WidgetContract    `yaml:"contract"`
	Stories        []string          `yaml:"stories"`
	Outputs        map[string]string `yaml:"outputs"`
}

type WidgetIntent struct {
	Purpose         string `yaml:"purpose"`
	AdapterBoundary string `yaml:"adapter_boundary"`
}

type Consumes struct {
	Presentations []string `yaml:"presentations"`
	Capabilities  []string `yaml:"capabilities"`
	Archetypes    []string `yaml:"archetypes"`
}

type WidgetContract struct {
	Props       map[string]InterfaceContract `yaml:"props"`
	ActionSlots map[string]ActionSlot        `yaml:"action_slots"`
}

type InterfaceContract struct {
	Fields map[string]PropField `yaml:"fields"`
}

type PropField struct {
	Type     string `yaml:"type"`
	Required bool   `yaml:"required"`
}

type ActionSlot struct {
	Accepts string `yaml:"accepts"`
}
