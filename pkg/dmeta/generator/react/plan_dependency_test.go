package react

import (
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestDependencyClosureForTemplateReportsDirectAndTransitiveDependencies(t *testing.T) {
	widgets := map[string]validator.Widget{
		"test.organism": {
			ID:        "test.organism",
			Name:      "TestOrganism",
			Component: validator.WidgetComponent{Level: "organism", Role: "organism", Specificity: "generic", GenerationPolicy: "scaffold_then_promote"},
			Composition: validator.WidgetComposition{Uses: []validator.WidgetDependency{
				{Template: "test.molecule", Role: "summary_card", Required: true, Description: "Render the summary card."},
			}},
		},
		"test.molecule": {
			ID:        "test.molecule",
			Name:      "TestMolecule",
			Component: validator.WidgetComponent{Level: "molecule", Role: "summary_card", Specificity: "generic", GenerationPolicy: "scaffold_once"},
			Composition: validator.WidgetComposition{Uses: []validator.WidgetDependency{
				{Template: "test.atom", Role: "label", Required: true, Description: "Render the label."},
			}},
		},
		"test.atom": {
			ID:        "test.atom",
			Name:      "TestAtom",
			Component: validator.WidgetComponent{Level: "atom", Role: "label", Specificity: "generic", GenerationPolicy: "scaffold_once"},
		},
	}

	closure := dependencyClosureForTemplate("test.organism", widgets, map[string]bool{"test.organism": true, "test.atom": true})
	if len(closure) != 2 {
		t.Fatalf("expected 2 dependencies, got %#v", closure)
	}
	if closure[0].TemplateID != "test.molecule" || !closure[0].Direct || closure[0].Depth != 1 || closure[0].Planned {
		t.Fatalf("unexpected direct dependency: %#v", closure[0])
	}
	if closure[1].TemplateID != "test.atom" || closure[1].Direct || closure[1].Depth != 2 || !closure[1].Planned {
		t.Fatalf("unexpected transitive dependency: %#v", closure[1])
	}
	wantPath := []string{"test.organism", "test.molecule", "test.atom"}
	if len(closure[1].Path) != len(wantPath) {
		t.Fatalf("unexpected path length: %#v", closure[1].Path)
	}
	for i := range wantPath {
		if closure[1].Path[i] != wantPath[i] {
			t.Fatalf("unexpected path: got %#v want %#v", closure[1].Path, wantPath)
		}
	}
}

func TestDependencyClosureForTemplateDeduplicatesSharedDependencies(t *testing.T) {
	widgets := map[string]validator.Widget{
		"test.page": {
			ID:        "test.page",
			Name:      "TestPage",
			Component: validator.WidgetComponent{Level: "page", Role: "page", Specificity: "generic", GenerationPolicy: "scaffold_then_promote"},
			Composition: validator.WidgetComposition{Uses: []validator.WidgetDependency{
				{Template: "test.left", Role: "left", Description: "Render left region."},
				{Template: "test.right", Role: "right", Description: "Render right region."},
			}},
		},
		"test.left": {
			ID:          "test.left",
			Name:        "TestLeft",
			Component:   validator.WidgetComponent{Level: "organism", Role: "left", Specificity: "generic", GenerationPolicy: "scaffold_then_promote"},
			Composition: validator.WidgetComposition{Uses: []validator.WidgetDependency{{Template: "test.atom", Role: "label", Description: "Render label."}}},
		},
		"test.right": {
			ID:          "test.right",
			Name:        "TestRight",
			Component:   validator.WidgetComponent{Level: "organism", Role: "right", Specificity: "generic", GenerationPolicy: "scaffold_then_promote"},
			Composition: validator.WidgetComposition{Uses: []validator.WidgetDependency{{Template: "test.atom", Role: "label", Description: "Render label."}}},
		},
		"test.atom": {
			ID:        "test.atom",
			Name:      "TestAtom",
			Component: validator.WidgetComponent{Level: "atom", Role: "label", Specificity: "generic", GenerationPolicy: "scaffold_once"},
		},
	}

	closure := dependencyClosureForTemplate("test.page", widgets, map[string]bool{"test.page": true})
	seenAtom := 0
	for _, dependency := range closure {
		if dependency.TemplateID == "test.atom" {
			seenAtom++
		}
	}
	if seenAtom != 1 {
		t.Fatalf("expected shared atom dependency once, got %d in %#v", seenAtom, closure)
	}
}
