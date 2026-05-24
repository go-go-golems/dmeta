package pbui

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestLowerStreetDeliInteractionsToPBUI(t *testing.T) {
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

	obligations := Lower(interactionObligations, pkg)
	if len(obligations) == 0 {
		t.Fatalf("expected PBUI obligations for Street Deli")
	}

	seen := map[string]bool{}
	for _, obligation := range obligations {
		seen[obligation.PresentationTypeID] = true
		if obligation.PresenterIntent == "" || obligation.RecognizerIntent == "" || obligation.Rationale == "" {
			t.Fatalf("expected obligation to preserve explanation fields: %#v", obligation)
		}
	}
	for _, expected := range []string{"pbui.composition_presentation", "pbui.lifecycle_status"} {
		if !seen[expected] {
			t.Fatalf("expected lowered PBUI obligations to include %s; got %#v", expected, seen)
		}
	}
}
