package pbui

import (
	"bytes"
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"sort"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

type lowerGoldenRow struct {
	ExampleID          string   `json:"example_id"`
	DomainTypeID       string   `json:"domain_type_id"`
	PresentationTypeID string   `json:"presentation_type_id"`
	SourceRuleID       string   `json:"source_rule_id"`
	Representations    []string `json:"representations"`
	Actions            []string `json:"actions"`
	PresenterIntent    string   `json:"presenter_intent"`
	RecognizerIntent   string   `json:"recognizer_intent"`
}

func TestGoldenValidatePBUI(t *testing.T) {
	_, interactionPkg, pbuiPkg, _ := loadStreetDeliPBUIFixture(t)
	assertGoldenJSON(t, "validate_pbui_findings.golden.json", ValidatePackage(pbuiPkg, interactionPkg))
}

func TestGoldenLowerStreetDeliPBUI(t *testing.T) {
	semanticPkg, interactionPkg, pbuiPkg, resolved := loadStreetDeliPBUIFixture(t)
	interactionObligations, findings := interaction.ElaborateInteractions(semanticPkg.CoreModel, resolved, interactionPkg)
	if validator.HasErrors(findings) {
		t.Fatalf("interaction elaboration has errors: %#v", findings)
	}
	rows := make([]lowerGoldenRow, 0)
	for _, obligation := range Lower(interactionObligations, pbuiPkg) {
		rows = append(rows, lowerGoldenRow{
			ExampleID:          obligation.ExampleID,
			DomainTypeID:       obligation.DomainTypeID,
			PresentationTypeID: obligation.PresentationTypeID,
			SourceRuleID:       obligation.SourceRuleID,
			Representations:    obligation.SourceRepresentations,
			Actions:            obligation.SourceActions,
			PresenterIntent:    obligation.PresenterIntent,
			RecognizerIntent:   obligation.RecognizerIntent,
		})
	}
	assertGoldenJSON(t, "lower_street_deli_pbui.golden.json", rows)
}

func TestGoldenRenderedCompositionMetadata(t *testing.T) {
	plan := buildStreetDeliPBUIReactPlan(t)
	files, err := RenderReactPlan(plan)
	if err != nil {
		t.Fatalf("render PBUI React plan: %v", err)
	}
	for _, file := range files {
		if file.Kind == "metadata" && file.Symbol == "PbuiCompositionPresentationMetadata" {
			var decoded ReactFileProvenance
			if err := json.Unmarshal([]byte(file.Content), &decoded); err != nil {
				t.Fatalf("metadata is not valid JSON: %v", err)
			}
			assertGoldenJSON(t, "composition_metadata.golden.json", decoded)
			return
		}
	}
	t.Fatalf("PbuiCompositionPresentation metadata file not found")
}

func loadStreetDeliPBUIFixture(t *testing.T) (*validator.Package, *interaction.Package, *Package, *validator.ResolvedCoreModel) {
	t.Helper()
	ctx := context.Background()
	repoRoot := filepath.Join("..", "..", "..", "..")
	semanticPkg, err := validator.LoadPackage(ctx, filepath.Join(repoRoot, "examples", "street-deli-ordering"))
	if err != nil {
		t.Fatalf("load Street Deli package: %v", err)
	}
	resolved, findings := validator.ResolveCoreInheritance(semanticPkg.CoreModel)
	if validator.HasErrors(findings) {
		t.Fatalf("semantic inheritance has errors: %#v", findings)
	}
	interactionPkg, err := interaction.LoadPackage(ctx, filepath.Join(repoRoot, "sources", "dmeta-ir"))
	if err != nil {
		t.Fatalf("load interaction package: %v", err)
	}
	if findings := interaction.ValidatePackage(interactionPkg); validator.HasErrors(findings) {
		t.Fatalf("interaction package has errors: %#v", findings)
	}
	pbuiPkg, err := LoadPackage(ctx, filepath.Join(repoRoot, "sources", "dmeta-ir", "meta-design-systems", "pbui"))
	if err != nil {
		t.Fatalf("load PBUI package: %v", err)
	}
	return semanticPkg, interactionPkg, pbuiPkg, resolved
}

func assertGoldenJSON(t *testing.T, name string, value any) {
	t.Helper()
	actual, err := json.MarshalIndent(normalizeForGolden(value), "", "  ")
	if err != nil {
		t.Fatalf("marshal golden value: %v", err)
	}
	actual = append(actual, '\n')
	path := filepath.Join("testdata", name)
	if os.Getenv("UPDATE_GOLDEN") == "1" {
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			t.Fatalf("create golden dir: %v", err)
		}
		if err := os.WriteFile(path, actual, 0o644); err != nil {
			t.Fatalf("write golden file: %v", err)
		}
		return
	}
	expected, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read golden file %s: %v", path, err)
	}
	if !bytes.Equal(expected, actual) {
		t.Fatalf("golden mismatch for %s\nexpected:\n%s\nactual:\n%s", path, expected, actual)
	}
}

func normalizeForGolden(value any) any {
	switch v := value.(type) {
	case []validator.Finding:
		out := append([]validator.Finding{}, v...)
		sort.SliceStable(out, func(i, j int) bool {
			if out[i].Artifact != out[j].Artifact {
				return out[i].Artifact < out[j].Artifact
			}
			if out[i].Path != out[j].Path {
				return out[i].Path < out[j].Path
			}
			return out[i].Code < out[j].Code
		})
		return out
	default:
		return value
	}
}
