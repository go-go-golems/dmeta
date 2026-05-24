package profile

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	pbuimds "github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestInstantiateStreetDeliProfile(t *testing.T) {
	ctx := context.Background()
	repoRoot := filepath.Join("..", "..", "..", "..", "..")

	semanticPkg, err := validator.LoadPackage(ctx, filepath.Join(repoRoot, "examples", "street-deli-ordering"))
	if err != nil {
		t.Fatalf("load semantic package: %v", err)
	}
	resolved, inheritanceFindings := validator.ResolveCoreInheritance(semanticPkg.CoreModel)
	if validator.HasErrors(inheritanceFindings) {
		t.Fatalf("semantic inheritance has errors: %#v", inheritanceFindings)
	}

	interactionPkg, err := interaction.LoadPackage(ctx, filepath.Join(repoRoot, "sources", "dmeta-ir"))
	if err != nil {
		t.Fatalf("load interaction package: %v", err)
	}
	interactionObligations, elaborationFindings := interaction.ElaborateInteractions(semanticPkg.CoreModel, resolved, interactionPkg)
	if validator.HasErrors(elaborationFindings) {
		t.Fatalf("interaction elaboration has errors: %#v", elaborationFindings)
	}

	pbuiPkg, err := pbuimds.LoadPackage(ctx, filepath.Join(repoRoot, "sources", "dmeta-ir", "meta-design-systems", "pbui"))
	if err != nil {
		t.Fatalf("load PBUI package: %v", err)
	}
	profilePkg, err := LoadPackage(ctx, filepath.Join(repoRoot, "examples", "street-deli-ordering", "meta-design-systems", "pbui"))
	if err != nil {
		t.Fatalf("load PBUI profile package: %v", err)
	}

	pbuiObligations := pbuimds.Lower(interactionObligations, pbuiPkg)
	plan := InstantiateProfile(profilePkg, pbuiObligations)

	if plan.ProfileID != "street_deli_clim" {
		t.Fatalf("expected street_deli_clim profile id, got %q", plan.ProfileID)
	}
	if plan.StyleProfileID != "street_deli_clim_mono" {
		t.Fatalf("expected street_deli_clim_mono style id, got %q", plan.StyleProfileID)
	}
	if len(plan.Views) == 0 {
		t.Fatalf("expected concrete view plans")
	}

	menuRef := findConcretePresentation(plan, "menu", "pbui.presentation_ref")
	if menuRef == nil {
		t.Fatalf("expected menu view to include pbui.presentation_ref")
	}
	if menuRef.Component != "PresentationRefLine" {
		t.Fatalf("expected menu presentation ref component PresentationRefLine, got %q", menuRef.Component)
	}
	if len(menuRef.DomainTypes) == 0 {
		t.Fatalf("expected menu presentation ref to aggregate domain types")
	}

	cartComposition := findConcretePresentation(plan, "cart", "pbui.composition_presentation")
	if cartComposition == nil {
		t.Fatalf("expected cart view to include pbui.composition_presentation")
	}
	if cartComposition.SurfaceID != "view" {
		t.Fatalf("expected cart composition to use view surface, got %q", cartComposition.SurfaceID)
	}
}

func findConcretePresentation(plan ConcretePresentationPlan, viewID string, presentationTypeID string) *ConcretePresentationInstance {
	for _, view := range plan.Views {
		if view.ID != viewID {
			continue
		}
		for i := range view.Presentations {
			if view.Presentations[i].PresentationTypeID == presentationTypeID {
				return &view.Presentations[i]
			}
		}
	}
	return nil
}
