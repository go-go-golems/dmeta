package pbui

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestBuildReactPlanIncludesRegistriesPresentersRecognizersAndMetadata(t *testing.T) {
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

	interactionPkg, err := interaction.LoadPackage(ctx, filepath.Join(repoRoot, "examples", "street-deli-ordering"))
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
	objectDescriptors := DeriveObjectTypeDescriptors(semanticPkg.CoreModel, resolved)
	actionDescriptors := DeriveActionDescriptors(interactionPkg)

	plan := BuildReactPlan(pkg, pkg.ReactTarget, obligations, objectDescriptors, actionDescriptors, filepath.Join("generated", "pbui-react-test"))
	if len(plan.ObjectDescriptors) == 0 || len(plan.ActionDescriptors) == 0 || len(plan.PresentationPlans) == 0 || len(plan.Files) == 0 {
		t.Fatalf("expected complete PBUI React plan, got %#v", plan)
	}
	kinds := map[string]bool{}
	for _, file := range plan.Files {
		kinds[file.Kind] = true
		if file.Kind == "metadata" && file.Provenance.PresenterIntent == "" {
			t.Fatalf("expected metadata file provenance to preserve presenter intent: %#v", file)
		}
	}
	for _, expected := range []string{"object_type_registry", "action_descriptor_registry", "presentation_type_registry", "session_slice", "selectors", "event_adapter", "component", "presenter_hook", "metadata", "stories"} {
		if !kinds[expected] {
			t.Fatalf("expected planned file kind %s; got %#v", expected, kinds)
		}
	}
}
