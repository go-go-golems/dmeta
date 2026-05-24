package profile

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	pbuimds "github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestLoadAndValidateStreetDeliProfile(t *testing.T) {
	ctx := context.Background()
	repoRoot := filepath.Join("..", "..", "..", "..", "..")

	interactionPkg, err := interaction.LoadPackage(ctx, filepath.Join(repoRoot, "sources", "dmeta-ir"))
	if err != nil {
		t.Fatalf("load interaction package: %v", err)
	}
	if findings := interaction.ValidatePackage(interactionPkg); validator.HasErrors(findings) {
		t.Fatalf("interaction package has error findings: %#v", findings)
	}

	pbuiPkg, err := pbuimds.LoadPackage(ctx, filepath.Join(repoRoot, "sources", "dmeta-ir", "meta-design-systems", "pbui"))
	if err != nil {
		t.Fatalf("load PBUI package: %v", err)
	}
	if findings := pbuimds.ValidatePackage(pbuiPkg, interactionPkg); validator.HasErrors(findings) {
		t.Fatalf("PBUI package has error findings: %#v", findings)
	}

	profilePkg, err := LoadPackage(ctx, filepath.Join(repoRoot, "examples", "street-deli-ordering", "meta-design-systems", "pbui"))
	if err != nil {
		t.Fatalf("load PBUI profile package: %v", err)
	}

	if profilePkg.Meta.ID != "street_deli_clim" {
		t.Fatalf("expected street_deli_clim profile id, got %q", profilePkg.Meta.ID)
	}
	if _, ok := profilePkg.ViewModels.Views["menu"]; !ok {
		t.Fatalf("expected menu view to load")
	}
	if binding, ok := profilePkg.PresentationBindings.Bindings["pbui.presentation_ref"]; !ok {
		t.Fatalf("expected pbui.presentation_ref binding to load")
	} else if binding.Component != "PresentationRefLine" {
		t.Fatalf("expected PresentationRefLine component, got %q", binding.Component)
	}

	findings := ValidatePackage(profilePkg, pbuiPkg)
	if validator.HasErrors(findings) {
		t.Fatalf("PBUI profile package has error findings: %#v", findings)
	}
}

func TestValidateProfileRejectsUnknownBindingPresentationType(t *testing.T) {
	ctx := context.Background()
	repoRoot := filepath.Join("..", "..", "..", "..", "..")

	pbuiPkg, err := pbuimds.LoadPackage(ctx, filepath.Join(repoRoot, "sources", "dmeta-ir", "meta-design-systems", "pbui"))
	if err != nil {
		t.Fatalf("load PBUI package: %v", err)
	}
	profilePkg, err := LoadPackage(ctx, filepath.Join(repoRoot, "examples", "street-deli-ordering", "meta-design-systems", "pbui"))
	if err != nil {
		t.Fatalf("load PBUI profile package: %v", err)
	}

	profilePkg.PresentationBindings.Bindings["pbui.nope"] = PresentationBinding{
		Component: "NopePresentation",
		Intent:    "Exercise validation for unknown concrete binding ids.",
		Classes:   map[string]string{"base": "pres"},
	}

	findings := ValidatePackage(profilePkg, pbuiPkg)
	if !validator.HasErrors(findings) {
		t.Fatalf("expected error finding for unknown binding presentation type; got %#v", findings)
	}
	for _, finding := range findings {
		if finding.Code == "unknown_presentation_type" && finding.Artifact == "pbui_presentation_bindings" {
			return
		}
	}
	t.Fatalf("expected unknown_presentation_type binding finding; got %#v", findings)
}
