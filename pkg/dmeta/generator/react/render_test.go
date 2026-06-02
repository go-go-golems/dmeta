package react

import (
	"encoding/json"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestRenderMetadataSidecarIncludesWebAndReactProvenance(t *testing.T) {
	component := ComponentPlan{
		TemplateID:              "deli.composition_card",
		ComponentName:           "StreetDeliCompositionCard",
		Variant:                 "mobile_default",
		OutputDir:               "generated/react",
		PackageName:             "dmeta-web-react",
		Slots:                   []string{"description", "dietary_tags", "price", "title"},
		VisualStates:            []string{"default", "selected", "unavailable"},
		EventBindings:           []string{"inspect_subject"},
		RealizesActions:         []string{"inspect_subject"},
		RealizesRepresentations: []string{"composition_summary", "dietary_summary"},
		SourceDomainTypes:       []string{"MenuItem", "OrderItem"},
		SourceRules:             []string{"composition_summary_to_deli_card"},
		Template: validator.Widget{
			Component: validator.WidgetComponent{
				Layout: validator.WidgetLayoutHint{Primitive: "section", Container: "site", GridRecipe: "productCards"},
			},
		},
		Files: []PlannedFile{
			{
				Path:   "generated/react/StreetDeliCompositionCard/StreetDeliCompositionCard.tsx",
				Kind:   "component",
				Symbol: "StreetDeliCompositionCard",
				Provenance: FileProvenance{
					Passes: []string{"semantic-ir", "interaction-elaboration", "web-lowering", "react-planning"},
				},
			},
		},
	}

	plan := ScaffoldPlan{TargetID: "react", MetaDesignSystem: "web", PackageName: "dmeta-web-react", SemanticRoot: "examples/street-deli-ordering", InteractionsRoot: "sources/dmeta-ir", WebRoot: "examples/street-deli-ordering/meta-design-systems/web", TargetFile: "sources/dmeta-ir/meta-design-systems/web/targets/react.yaml"}
	content, err := RenderMetadataSidecar(plan, component)
	if err != nil {
		t.Fatalf("RenderMetadataSidecar returned error: %v", err)
	}

	var payload map[string]any
	if err := json.Unmarshal(content, &payload); err != nil {
		t.Fatalf("metadata sidecar is not valid JSON: %v\n%s", err, string(content))
	}

	generated := payload["generated"].(map[string]any)
	assertEqual(t, generated["by"], "dmeta scaffold-react")
	artifact := payload["artifact"].(map[string]any)
	assertEqual(t, artifact["symbol"], "StreetDeliCompositionCardMetadata")
	pipeline := payload["pipeline"].(map[string]any)
	assertEqual(t, pipeline["metaDesignSystem"], "web")
	assertEqual(t, pipeline["target"], "react")

	semantics := payload["semantics"].(map[string]any)
	assertStringSlice(t, semantics["representations"], []string{"composition_summary", "dietary_summary"})
	assertStringSlice(t, semantics["actions"], []string{"inspect_subject"})
	assertStringSlice(t, semantics["domainTypes"], []string{"MenuItem", "OrderItem"})
	assertStringSlice(t, semantics["sourceRules"], []string{"composition_summary_to_deli_card"})

	web := payload["web"].(map[string]any)
	assertEqual(t, web["templateId"], "deli.composition_card")
	assertStringSlice(t, web["slots"], []string{"description", "dietary_tags", "price", "title"})
	assertStringSlice(t, web["visualStates"], []string{"default", "selected", "unavailable"})
	assertStringSlice(t, web["eventBindings"], []string{"inspect_subject"})
	layout := web["layout"].(map[string]any)
	assertEqual(t, layout["primitive"], "section")
	assertEqual(t, layout["container"], "site")
	assertEqual(t, layout["gridRecipe"], "productCards")
}

func assertEqual(t *testing.T, got any, want string) {
	t.Helper()
	if got != want {
		t.Fatalf("got %v, want %v", got, want)
	}
}

func assertStringSlice(t *testing.T, got any, want []string) {
	t.Helper()
	gotValues, ok := got.([]any)
	if !ok {
		t.Fatalf("got %T, want []any", got)
	}
	if len(gotValues) != len(want) {
		t.Fatalf("got %v, want %v", gotValues, want)
	}
	for i, value := range gotValues {
		if value != want[i] {
			t.Fatalf("got %v, want %v", gotValues, want)
		}
	}
}
