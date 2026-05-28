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
	LongSummary    string                   `yaml:"long_summary"`
	Status         string                   `yaml:"status"`
	References     map[string]string        `yaml:"references"`
	Files          CoreModelFiles           `yaml:"files"`
	LogicalTypes   LogicalTypes             `yaml:"logical_types"`
	Archetypes     map[string]Archetype     `yaml:"archetypes"`
	Capabilities   map[string]Capability    `yaml:"capabilities"`
	Presentations  map[string]Presentation  `yaml:"presentations"`
	Actions        map[string]Action        `yaml:"actions"`
	DomainExamples map[string]DomainExample `yaml:"domain_examples"`
	Validation     map[string]any           `yaml:"validation"`
}

type CoreModelFiles struct {
	CoreModel     string   `yaml:"core_model"`
	Archetypes    string   `yaml:"archetypes"`
	Capabilities  string   `yaml:"capabilities"`
	Presentations string   `yaml:"presentations"`
	DomainExample string   `yaml:"domain_example"`
	ExamplesDir   string   `yaml:"examples_dir"`
	Examples      []string `yaml:"examples"`
}

type CoreModelMetadataFile struct {
	SchemaVersion       int               `yaml:"schema_version"`
	ArtifactType        string            `yaml:"artifact_type"`
	Summary             string            `yaml:"summary"`
	LongSummary         string            `yaml:"long_summary"`
	References          map[string]string `yaml:"references"`
	LogicalTypes        LogicalTypes      `yaml:"logical_types"`
	AuthoringGuidelines []string          `yaml:"authoring_guidelines"`
}

type ArchetypesFile struct {
	SchemaVersion int                  `yaml:"schema_version"`
	ArtifactType  string               `yaml:"artifact_type"`
	Summary       string               `yaml:"summary"`
	LongSummary   string               `yaml:"long_summary"`
	References    map[string]string    `yaml:"references"`
	Archetypes    map[string]Archetype `yaml:"archetypes"`
}

type CapabilitiesFile struct {
	SchemaVersion int                   `yaml:"schema_version"`
	ArtifactType  string                `yaml:"artifact_type"`
	Summary       string                `yaml:"summary"`
	LongSummary   string                `yaml:"long_summary"`
	References    map[string]string     `yaml:"references"`
	Capabilities  map[string]Capability `yaml:"capabilities"`
}

type PresentationsFile struct {
	SchemaVersion int                     `yaml:"schema_version"`
	ArtifactType  string                  `yaml:"artifact_type"`
	Summary       string                  `yaml:"summary"`
	LongSummary   string                  `yaml:"long_summary"`
	References    map[string]string       `yaml:"references"`
	Presentations map[string]Presentation `yaml:"presentations"`
	Actions       map[string]Action       `yaml:"actions"`
}

type DomainExampleFile struct {
	SchemaVersion int               `yaml:"schema_version"`
	ArtifactType  string            `yaml:"artifact_type"`
	ID            string            `yaml:"id"`
	Summary       string            `yaml:"summary"`
	LongSummary   string            `yaml:"long_summary"`
	References    map[string]string `yaml:"references"`
	DomainExample DomainExample     `yaml:"domain_example"`
}

type LogicalTypes struct {
	Primitives  []string `yaml:"primitives"`
	Collections []string `yaml:"collections"`
}

type Archetype struct {
	Description              string   `yaml:"description"`
	LongDescription          string   `yaml:"long_description"`
	Extends                  []string `yaml:"extends"`
	Abstract                 bool     `yaml:"abstract"`
	DefaultCapabilities      []string `yaml:"default_capabilities"`
	RecommendedPresentations []string `yaml:"recommended_presentations"`
	Examples                 []string `yaml:"examples"`
	Notes                    string   `yaml:"notes"`
}

type Capability struct {
	Description     string                `yaml:"description"`
	LongDescription string                `yaml:"long_description"`
	Extends         []string              `yaml:"extends"`
	Abstract        bool                  `yaml:"abstract"`
	Projections     map[string]Projection `yaml:"projections"`
	Presentations   []string              `yaml:"presentations"`
	Actions         []string              `yaml:"actions"`
	Filters         []string              `yaml:"filters"`
	Notes           string                `yaml:"notes"`
}

type Projection struct {
	Type        string `yaml:"type"`
	Required    bool   `yaml:"required"`
	Description string `yaml:"description"`
}

type Presentation struct {
	Description     string          `yaml:"description"`
	LongDescription string          `yaml:"long_description"`
	Layer           string          `yaml:"layer"`
	AppliesTo       AppliesTo       `yaml:"applies_to"`
	Requires        []string        `yaml:"requires"`
	RequiresAny     []string        `yaml:"requires_any"`
	Optional        []string        `yaml:"optional"`
	Role            string          `yaml:"role"`
	Density         string          `yaml:"density"`
	Interaction     map[string]bool `yaml:"interaction"`
	StyleRecipe     string          `yaml:"style_recipe"`
	Fallbacks       []string        `yaml:"fallbacks"`
	Extra           map[string]any  `yaml:",inline"`
}

type AppliesTo struct {
	Capabilities []string `yaml:"capabilities"`
	Archetypes   []string `yaml:"archetypes"`
	DomainTypes  []string `yaml:"domain_types"`
}

type Action struct {
	Description     string              `yaml:"description"`
	LongDescription string              `yaml:"long_description"`
	Category        string              `yaml:"category"`
	Accepts         []Selector          `yaml:"accepts"`
	Arguments       map[string]Argument `yaml:"arguments"`
	Result          ActionResult        `yaml:"result"`
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
	SchemaVersion              int                           `yaml:"schema_version"`
	ArtifactType               string                        `yaml:"artifact_type"`
	Summary                    string                        `yaml:"summary"`
	LongSummary                string                        `yaml:"long_summary"`
	References                 map[string]string             `yaml:"references"`
	Status                     string                        `yaml:"status"`
	Mode                       string                        `yaml:"mode"`
	ThemeAxesSummary           string                        `yaml:"theme_axes_summary"`
	ThemeAxes                  map[string]ThemeAxis          `yaml:"theme_axes"`
	Typography                 Typography                    `yaml:"typography"`
	Density                    Density                       `yaml:"density"`
	Spacing                    Spacing                       `yaml:"spacing"`
	Color                      map[string]any                `yaml:"color"`
	Borders                    map[string]any                `yaml:"borders"`
	Elevation                  map[string]any                `yaml:"elevation"`
	Layout                     map[string]any                `yaml:"layout"`
	PresentationRecipesSummary string                        `yaml:"presentation_recipes_summary"`
	PresentationRecipes        map[string]PresentationRecipe `yaml:"presentation_recipes"`
	InteractionStates          InteractionStates             `yaml:"interaction_states"`
	DataAttributes             map[string]any                `yaml:"data_attributes"`
	LintRulesSummary           string                        `yaml:"lint_rules_summary"`
	LintRules                  map[string]LintRule           `yaml:"lint_rules"`
	Validation                 map[string]any                `yaml:"validation"`
}

type ThemeAxis struct {
	Values      []string `yaml:"values"`
	Default     string   `yaml:"default"`
	Description string   `yaml:"description"`
}

type Typography struct {
	LongSummary string                      `yaml:"long_summary"`
	Families    map[string]TypographyFamily `yaml:"families"`
	Roles       map[string]TypographyRole   `yaml:"roles"`
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
	LongPurpose     string    `yaml:"long_purpose"`
}

type Density struct {
	LongSummary string                 `yaml:"long_summary"`
	Modes       map[string]DensityMode `yaml:"modes"`
}

type DensityMode struct {
	Description       string    `yaml:"description"`
	RowHeightRange    []float64 `yaml:"row_height_range"`
	CellPaddingXRange []float64 `yaml:"cell_padding_x_range"`
	CellPaddingYRange []float64 `yaml:"cell_padding_y_range"`
	FontBodyRange     []float64 `yaml:"font_body_range"`
}

type Spacing struct {
	LongSummary string   `yaml:"long_summary"`
	BaseGrid    int      `yaml:"base_grid"`
	Tokens      []int    `yaml:"tokens"`
	Rules       []string `yaml:"rules"`
}

type PresentationRecipe struct {
	Description  string   `yaml:"description"`
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
	LongSummary string                      `yaml:"long_summary"`
	States      map[string]InteractionState `yaml:"states"`
	Rules       []string                    `yaml:"rules"`
}

type InteractionState struct {
	Purpose     string `yaml:"purpose"`
	Description string `yaml:"description"`
}

type LintRule struct {
	Severity        string `yaml:"severity"`
	Description     string `yaml:"description"`
	LongDescription string `yaml:"long_description"`
}

type WidgetIRFile struct {
	SchemaVersion int               `yaml:"schema_version"`
	ArtifactType  string            `yaml:"artifact_type"`
	Summary       string            `yaml:"summary"`
	LongSummary   string            `yaml:"long_summary"`
	Status        string            `yaml:"status"`
	Files         map[string]string `yaml:"files"`
	Widgets       []Widget          `yaml:"widgets"`
	Validation    map[string]any    `yaml:"validation"`
}

type WidgetTemplatesFile struct {
	SchemaVersion int               `yaml:"schema_version"`
	ArtifactType  string            `yaml:"artifact_type"`
	Category      string            `yaml:"category"`
	Summary       string            `yaml:"summary"`
	LongSummary   string            `yaml:"long_summary"`
	References    map[string]string `yaml:"references"`
	Templates     []Widget          `yaml:"templates"`
}

type Widget struct {
	ID              string                `yaml:"id"`
	Name            string                `yaml:"name"`
	Status          string                `yaml:"status"`
	Classification  map[string]any        `yaml:"classification"`
	ComponentSystem WidgetComponentSystem `yaml:"component_system"`
	Composition     WidgetComposition     `yaml:"composition"`
	Intent          WidgetIntent          `yaml:"intent"`
	Template        TemplateMetadata      `yaml:"template"`
	Consumes        Consumes              `yaml:"consumes"`
	SemanticContext WidgetSemanticContext `yaml:"semantic_context"`
	ProjectionHints WidgetProjectionHints `yaml:"projection_hints"`
	Contract        WidgetContract        `yaml:"contract"`
	Style           SourceBlock           `yaml:"style"`
	Stories         []string              `yaml:"stories"`
	Storybook       WidgetStorybook       `yaml:"storybook"`
	Outputs         map[string]string     `yaml:"outputs"`
}

// SourceBlock carries a source-language snippet embedded in IR. The first use is
// pragmatic React generation: TypeScript owns rich prop contracts, and CSS owns
// baseline generated style recipes, while YAML continues to own semantic
// metadata, lifecycle, and compiler routing.
type SourceBlock struct {
	Language string `yaml:"language"`
	Source   string `yaml:"source"`
	Code     string `yaml:"code"`
}

type WidgetComponentSystem struct {
	Kind            string                 `yaml:"kind"`
	Level           string                 `yaml:"level"`
	Specificity     string                 `yaml:"specificity"`
	Family          string                 `yaml:"family"`
	Role            string                 `yaml:"role"`
	RoleDescription string                 `yaml:"role_description"`
	PromotionOrder  int                    `yaml:"promotion_order"`
	OwnsLayout      bool                   `yaml:"owns_layout"`
	OwnsBehavior    bool                   `yaml:"owns_behavior"`
	Lifecycle       WidgetLifecyclePolicy  `yaml:"lifecycle"`
	Extra           map[string]interface{} `yaml:",inline"`
}

type WidgetLifecyclePolicy struct {
	Default     string   `yaml:"default"`
	Component   string   `yaml:"component"`
	Types       string   `yaml:"types"`
	Styles      string   `yaml:"styles"`
	Stories     string   `yaml:"stories"`
	Metadata    string   `yaml:"metadata"`
	Adapter     string   `yaml:"adapter"`
	Protected   []string `yaml:"protected"`
	PromoteInto string   `yaml:"promote_into"`
}

type WidgetComposition struct {
	Uses     []WidgetDependency `yaml:"uses"`
	Provides []string           `yaml:"provides"`
	Slots    []ComponentSlot    `yaml:"slots"`
}

type WidgetDependency struct {
	Template    string `yaml:"template"`
	Component   string `yaml:"component"`
	Role        string `yaml:"role"`
	Required    bool   `yaml:"required"`
	Description string `yaml:"description"`
}

type ComponentSlot struct {
	Name        string `yaml:"name"`
	Role        string `yaml:"role"`
	Required    bool   `yaml:"required"`
	Description string `yaml:"description"`
}

type WidgetStorybook struct {
	TitlePrefix string      `yaml:"title_prefix"`
	Coverage    []string    `yaml:"coverage"`
	Stories     []StoryCase `yaml:"stories"`
}

type StoryCase struct {
	Name        string         `yaml:"name"`
	Description string         `yaml:"description"`
	State       string         `yaml:"state"`
	Props       map[string]any `yaml:"props"`
}

type TemplateMetadata struct {
	Category           string                     `yaml:"category"`
	Selection          string                     `yaml:"selection"`
	Maturity           string                     `yaml:"maturity"`
	DefaultImportance  string                     `yaml:"default_importance"`
	SelectionQuestions []string                   `yaml:"selection_questions"`
	AdaptationPoints   map[string]AdaptationPoint `yaml:"adaptation_points"`
	CommonVariants     []string                   `yaml:"common_variants"`
	AvoidWhen          []string                   `yaml:"avoid_when"`
}

type AdaptationPoint struct {
	Type                string   `yaml:"type"`
	Required            bool     `yaml:"required"`
	RequiredForVariants []string `yaml:"required_for_variants"`
	Description         string   `yaml:"description"`
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

type WidgetSemanticContext struct {
	Presentations        []string `yaml:"presentations"`
	Capabilities         []string `yaml:"capabilities"`
	Archetypes           []string `yaml:"archetypes"`
	Intent               string   `yaml:"intent"`
	InheritedContextNote string   `yaml:"inherited_context_note"`
}

type WidgetProjectionHints struct {
	Required          []string `yaml:"required"`
	Recommended       []string `yaml:"recommended"`
	Optional          []string `yaml:"optional"`
	DocumentationOnly []string `yaml:"documentation_only"`
	AdapterTODOs      []string `yaml:"adapter_todos"`
}

type WidgetContract struct {
	TypeScript  SourceBlock                  `yaml:"typescript"`
	Props       map[string]InterfaceContract `yaml:"props"`
	State       map[string]PropField         `yaml:"state"`
	Events      map[string]EventContract     `yaml:"events"`
	ActionSlots map[string]ActionSlot        `yaml:"action_slots"`
}

type InterfaceContract struct {
	Description string               `yaml:"description"`
	Source      string               `yaml:"source"`
	SourceRef   string               `yaml:"source_ref"`
	Required    bool                 `yaml:"required"`
	Fields      map[string]PropField `yaml:"fields"`
}

type PropField struct {
	Type        string   `yaml:"type"`
	TypeRef     string   `yaml:"type_ref"`
	ItemTypeRef string   `yaml:"item_type_ref"`
	Source      string   `yaml:"source"`
	SourceRef   string   `yaml:"source_ref"`
	Required    bool     `yaml:"required"`
	Values      []string `yaml:"values"`
	Default     string   `yaml:"default"`
	Description string   `yaml:"description"`
}

type EventContract struct {
	ActionRef   string `yaml:"action_ref"`
	PayloadType string `yaml:"payload_type"`
	Source      string `yaml:"source"`
	Required    bool   `yaml:"required"`
	Description string `yaml:"description"`
}

type ActionSlot struct {
	Accepts     string `yaml:"accepts"`
	ActionRef   string `yaml:"action_ref"`
	PayloadType string `yaml:"payload_type"`
	Source      string `yaml:"source"`
	Description string `yaml:"description"`
}
