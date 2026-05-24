package profile

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	pbuimds "github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestBuildReactAppPlanForStreetDeliProfile(t *testing.T) {
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

	concretePlan := InstantiateProfile(profilePkg, pbuimds.Lower(interactionObligations, pbuiPkg))
	reactPlan := BuildReactAppPlan(profilePkg, concretePlan, "")

	if reactPlan.OutputDir != "../../www/clim-react" {
		t.Fatalf("expected default clim-react output dir, got %q", reactPlan.OutputDir)
	}
	expectPlannedFile(t, reactPlan, "../../www/clim-react/package.json", "package_json")
	expectPlannedFile(t, reactPlan, "../../www/clim-react/src/clim/store.ts", "clim_store")
	expectPlannedFile(t, reactPlan, "../../www/clim-react/src/styles/clim.css", "style_profile_css")
	expectPlannedFile(t, reactPlan, "../../www/clim-react/fonts/BerkeleyMono-Regular.woff2", "font_assets")
	expectPlannedFile(t, reactPlan, "../../www/clim-react/src/components/presentations/PresentationRefLine.tsx", "presentation_component")
	expectPlannedFile(t, reactPlan, "../../www/clim-react/src/views/MenuView.tsx", "view_component")
}

func expectPlannedFile(t *testing.T, plan ReactAppPlan, path, kind string) {
	t.Helper()
	for _, file := range plan.Files {
		if file.Path == path && file.Kind == kind {
			return
		}
	}
	t.Fatalf("expected planned file %s kind %s; got %#v", path, kind, plan.Files)
}
