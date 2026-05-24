package pbui

import (
	"context"
	"encoding/json"
	"path/filepath"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestRenderReactPlanIncludesMetadataAndRegistries(t *testing.T) {
	plan := buildStreetDeliPBUIReactPlan(t)
	files, err := RenderReactPlan(plan)
	if err != nil {
		t.Fatalf("render PBUI React plan: %v", err)
	}
	if len(files) == 0 {
		t.Fatalf("expected rendered files")
	}
	seenMetadata := false
	seenObjectRegistry := false
	for _, file := range files {
		if file.Kind == "object_type_registry" && file.Content != "" {
			seenObjectRegistry = true
		}
		if file.Kind == "metadata" {
			seenMetadata = true
			var provenance ReactFileProvenance
			if err := json.Unmarshal([]byte(file.Content), &provenance); err != nil {
				t.Fatalf("metadata content should be valid JSON: %v\n%s", err, file.Content)
			}
			if provenance.PresentationTypeID == "" || provenance.PresenterIntent == "" || provenance.RecognizerIntent == "" {
				t.Fatalf("metadata should preserve PBUI provenance and intent: %#v", provenance)
			}
		}
	}
	if !seenMetadata || !seenObjectRegistry {
		t.Fatalf("expected metadata and object registry files; metadata=%v objectRegistry=%v", seenMetadata, seenObjectRegistry)
	}
}

func TestWriteReactFilesDryRunDoesNotCreateFiles(t *testing.T) {
	file := ReactRenderedFile{Path: filepath.Join(t.TempDir(), "generated", "metadata.json"), Kind: "metadata", Content: "{}\n"}
	results, err := WriteReactFiles([]ReactRenderedFile{file}, WriteOptions{DryRun: true})
	if err != nil {
		t.Fatalf("dry-run write: %v", err)
	}
	if len(results) != 1 || results[0].Action != "dry-run" {
		t.Fatalf("expected dry-run result, got %#v", results)
	}
	if _, err := filepath.Abs(file.Path); err != nil {
		t.Fatalf("bad path: %v", err)
	}
}

func buildStreetDeliPBUIReactPlan(t *testing.T) ReactPlan {
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
	interactionObligations, findings := interaction.ElaborateInteractions(semanticPkg.CoreModel, resolved, interactionPkg)
	if validator.HasErrors(findings) {
		t.Fatalf("interaction elaboration has errors: %#v", findings)
	}
	pkg, err := LoadPackage(ctx, filepath.Join(repoRoot, "sources", "dmeta-ir", "meta-design-systems", "pbui"))
	if err != nil {
		t.Fatalf("load PBUI package: %v", err)
	}
	return BuildReactPlan(
		pkg,
		pkg.ReactTarget,
		Lower(interactionObligations, pkg),
		DeriveObjectTypeDescriptors(semanticPkg.CoreModel, resolved),
		DeriveActionDescriptors(interactionPkg),
		filepath.Join(t.TempDir(), "pbui-react"),
	)
}
