package pbui

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestDeriveObjectTypeDescriptorsPreservesSemanticMetadata(t *testing.T) {
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

	descriptors := DeriveObjectTypeDescriptors(semanticPkg.CoreModel, resolved)
	byID := map[string]ObjectTypeDescriptor{}
	for _, descriptor := range descriptors {
		byID[descriptor.ID] = descriptor
	}
	menuItem, ok := byID["MenuItem"]
	if !ok {
		t.Fatalf("expected MenuItem descriptor")
	}
	if menuItem.Description == "" {
		t.Fatalf("expected MenuItem descriptor to preserve semantic description")
	}
	if len(menuItem.Capabilities) == 0 || len(menuItem.CapabilityDescriptions) == 0 {
		t.Fatalf("expected MenuItem descriptor to include capabilities and descriptions: %#v", menuItem)
	}
	if len(menuItem.Projections) == 0 {
		t.Fatalf("expected MenuItem descriptor to include projection descriptors")
	}
	if menuItem.Provenance.SourceLayer != "semantic-ir" {
		t.Fatalf("expected semantic provenance, got %#v", menuItem.Provenance)
	}
}

func TestDeriveActionDescriptorsPreservesInteractionMetadata(t *testing.T) {
	ctx := context.Background()
	repoRoot := filepath.Join("..", "..", "..", "..")
	interactionPkg, err := interaction.LoadPackage(ctx, filepath.Join(repoRoot, "examples", "street-deli-ordering"))
	if err != nil {
		t.Fatalf("load interaction package: %v", err)
	}
	descriptors := DeriveActionDescriptors(interactionPkg)
	byID := map[string]ActionDescriptor{}
	for _, descriptor := range descriptors {
		byID[descriptor.ID] = descriptor
	}
	submitOrder, ok := byID["submit_order"]
	if !ok {
		t.Fatalf("expected submit_order action descriptor")
	}
	if submitOrder.Intent == "" || submitOrder.Description == "" {
		t.Fatalf("expected submit_order descriptor to preserve natural language metadata: %#v", submitOrder)
	}
	if !submitOrder.Effects.MutatesBackend || !submitOrder.Safety.RequiresConfirmation {
		t.Fatalf("expected submit_order safety/effects metadata to be preserved: %#v", submitOrder)
	}
	if submitOrder.Provenance.SourceLayer != "interaction-ir" {
		t.Fatalf("expected interaction provenance, got %#v", submitOrder.Provenance)
	}
}
