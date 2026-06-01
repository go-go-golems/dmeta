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
	DomainExamples map[string]DomainExample `yaml:"domain_examples"`
	Validation     map[string]any           `yaml:"validation"`
}

type CoreModelFiles struct {
	CoreModel     string   `yaml:"core_model"`
	Archetypes    FileList `yaml:"archetypes"`
	Capabilities  FileList `yaml:"capabilities"`
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
	Description         string   `yaml:"description"`
	LongDescription     string   `yaml:"long_description"`
	Extends             []string `yaml:"extends"`
	Abstract            bool     `yaml:"abstract"`
	DefaultCapabilities []string `yaml:"default_capabilities"`
	Examples            []string `yaml:"examples"`
	Notes               string   `yaml:"notes"`
}

type Capability struct {
	Description     string                `yaml:"description"`
	LongDescription string                `yaml:"long_description"`
	Extends         []string              `yaml:"extends"`
	Abstract        bool                  `yaml:"abstract"`
	Projections     map[string]Projection `yaml:"projections"`
	Notes           string                `yaml:"notes"`
}

type Projection struct {
	Type        string `yaml:"type"`
	Required    bool   `yaml:"required"`
	Description string `yaml:"description"`
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
	Description     string                `yaml:"description"`
	Component       WidgetComponent       `yaml:"component"`
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
	ContractActions []string              `yaml:"contract_action_slots"`
}

// SourceBlock carries a source-language snippet embedded in IR. The first use is
// pragmatic React generation: TypeScript owns rich prop contracts, and CSS owns
// baseline generated style recipes, while YAML continues to own semantic
// metadata, lifecycle, and compiler routing.
type SourceBlock struct {
	Language    string `yaml:"language"`
	Description string `yaml:"description"`
	Intent      string `yaml:"intent"`
	Notes       string `yaml:"notes"`
	Source      string `yaml:"source"`
	Code        string `yaml:"code"`
}

type WidgetComponent struct {
	Level            string           `yaml:"level"`
	Specificity      string           `yaml:"specificity"`
	Role             string           `yaml:"role"`
	GenerationPolicy string           `yaml:"generation_policy"`
	Layout           WidgetLayoutHint `yaml:"layout"`
	Responsibilities []string         `yaml:"responsibilities"`
	Notes            []string         `yaml:"notes"`
}

type WidgetLayoutHint struct {
	Primitive  string `yaml:"primitive" json:"primitive,omitempty"`
	Container  string `yaml:"container" json:"container,omitempty"`
	GridRecipe string `yaml:"grid_recipe" json:"gridRecipe,omitempty"`
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
	Representations []string `yaml:"representations"`
	Capabilities    []string `yaml:"capabilities"`
	Archetypes      []string `yaml:"archetypes"`
}

type WidgetSemanticContext struct {
	Representations      []string `yaml:"representations"`
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
	Prop        string `yaml:"prop"`
	Description string `yaml:"description"`
}
