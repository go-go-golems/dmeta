package react

import (
	"encoding/json"
	"testing"
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

	content, err := RenderMetadataSidecar(component)
	if err != nil {
		t.Fatalf("RenderMetadataSidecar returned error: %v", err)
	}

	var payload map[string]any
	if err := json.Unmarshal(content, &payload); err != nil {
		t.Fatalf("metadata sidecar is not valid JSON: %v\n%s", err, string(content))
	}

	assertEqual(t, payload["generatedBy"], "dmeta plan-scaffold --target react")
	assertEqual(t, payload["metaDesignSystem"], "web")
	assertEqual(t, payload["codegenTarget"], "react")
	assertEqual(t, payload["componentName"], "StreetDeliCompositionCard")
	assertEqual(t, payload["templateId"], "deli.composition_card")

	realizes := payload["realizes"].(map[string]any)
	assertStringSlice(t, realizes["representations"], []string{"composition_summary", "dietary_summary"})
	assertStringSlice(t, realizes["actions"], []string{"inspect_subject"})

	web := payload["web"].(map[string]any)
	assertStringSlice(t, web["slots"], []string{"description", "dietary_tags", "price", "title"})
	assertStringSlice(t, web["visualStates"], []string{"default", "selected", "unavailable"})
	assertStringSlice(t, web["eventBindings"], []string{"inspect_subject"})

	provenance := payload["provenance"].(map[string]any)
	assertStringSlice(t, provenance["domainTypes"], []string{"MenuItem", "OrderItem"})
	assertStringSlice(t, provenance["sourceRules"], []string{"composition_summary_to_deli_card"})
	assertStringSlice(t, provenance["passes"], []string{"semantic-ir", "interaction-elaboration", "web-lowering", "react-planning"})
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
