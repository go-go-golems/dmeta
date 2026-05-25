package pbui

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestLoadAndValidateGlobalPBUI(t *testing.T) {
	ctx := context.Background()
	repoRoot := filepath.Join("..", "..", "..", "..")

	interactionPkg, err := interaction.LoadPackage(ctx, filepath.Join(repoRoot, "examples", "street-deli-ordering"))
	if err != nil {
		t.Fatalf("load interaction package: %v", err)
	}
	if findings := interaction.ValidatePackage(interactionPkg); validator.HasErrors(findings) {
		t.Fatalf("interaction package has error findings: %#v", findings)
	}

	pkg, err := LoadPackage(ctx, filepath.Join(repoRoot, "sources", "dmeta-ir", "meta-design-systems", "pbui"))
	if err != nil {
		t.Fatalf("load PBUI package: %v", err)
	}

	if len(pkg.PresentationTypes.PresentationTypes) == 0 {
		t.Fatalf("expected presentation types to load")
	}
	if _, ok := pkg.PresentationTypes.PresentationTypes["pbui.action_presentation"]; !ok {
		t.Fatalf("expected action presentation type to load")
	}

	findings := ValidatePackage(pkg, interactionPkg)
	if validator.HasErrors(findings) {
		t.Fatalf("PBUI package has error findings: %#v", findings)
	}
}
