package widgets

import (
	"strings"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestGenerateReflectiveWidgetScaffold(t *testing.T) {
	emitAdapterTODOs := true
	instance := InstanceManifest{ID: "street_deli", Name: "Street Deli", Summary: "Deli widgets", Generation: Generation{OutputDir: "generated/widgets"}}
	resolved := []ResolvedTemplate{{
		Selected: Selected{Template: "deli.composition_card", As: "StreetDeliCompositionCard", Variant: "mobile_default", Reason: "Needs semantic reflection."},
		Template: validator.Widget{
			ID:       "deli.composition_card",
			Name:     "StreetDeliCompositionCard",
			Template: validator.TemplateMetadata{Category: "item_cards"},
			SemanticContext: validator.WidgetSemanticContext{
				Archetypes:           []string{"ProductComposition"},
				Capabilities:         []string{"ingredient_composable", "dietary"},
				Intent:               "Render a sellable product composition without forcing every projection into layout.",
				InheritedContextNote: "MenuItem extends ProductSpec and ProductComposition.",
			},
			ProjectionHints: validator.WidgetProjectionHints{
				Recommended:  []string{"labelable.label", "ingredient_composable.parts"},
				Optional:     []string{"dietary.dietary_tags"},
				AdapterTODOs: []string{"Decide compact summary versus full ingredient list."},
			},
			Generation: validator.WidgetGenerationPolicy{ScaffoldMode: "adapter_todos", EmitAdapterTODOs: &emitAdapterTODOs},
			Contract: validator.WidgetContract{Props: map[string]validator.InterfaceContract{
				"Props": {Fields: map[string]validator.PropField{"subject": {Type: "unknown", Required: true}}},
			}},
		},
	}}

	files, err := Generate(instance, resolved, "")
	if err != nil {
		t.Fatalf("Generate failed: %v", err)
	}
	byPath := map[string]string{}
	for _, file := range files {
		byPath[file.Path] = string(file.Content)
	}
	component := byPath["generated/widgets/StreetDeliCompositionCard/StreetDeliCompositionCard.tsx"]
	metadata := byPath["generated/widgets/StreetDeliCompositionCard/StreetDeliCompositionCard.metadata.ts"]
	adapter := byPath["generated/widgets/StreetDeliCompositionCard/StreetDeliCompositionCard.adapter.todo.ts"]
	readme := byPath["generated/widgets/README.md"]
	story := byPath["generated/widgets/StreetDeliCompositionCard/StreetDeliCompositionCard.stories.tsx"]

	assertContains(t, component, "Reflection-first scaffold generated from `deli.composition_card`")
	assertContains(t, component, "Archetype: ProductComposition")
	assertContains(t, component, "Projection hints are scaffold guidance")
	assertContains(t, metadata, "semanticContext")
	assertContains(t, metadata, "projectionHints")
	assertContains(t, metadata, "adapter_todos")
	assertContains(t, adapter, "mapDomainToStreetDeliCompositionCardProps")
	assertContains(t, adapter, "consider mapping recommended projection hint labelable.label")
	assertContains(t, readme, "Semantic context: archetypes:ProductComposition")
	assertContains(t, story, "Projection hints are scaffold guidance")
}

func assertContains(t *testing.T, haystack, needle string) {
	t.Helper()
	if !strings.Contains(haystack, needle) {
		t.Fatalf("expected output to contain %q\n--- output ---\n%s", needle, haystack)
	}
}
