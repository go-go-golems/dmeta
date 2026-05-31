package web

import (
	"context"
	"os"
	"path/filepath"
	"testing"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func TestLoadPackageLoadsComponentSystem(t *testing.T) {
	root := t.TempDir()
	writeTestFile(t, root, "meta-design-system.yaml", `schema_version: 0
artifact_type: dmeta_meta_design_system
id: test_web
name: Test Web
files:
  lowering_rules: ./lowering-rules.yaml
  component_system: ./component-system.yaml
  widgets: ./widgets.yaml
`)
	writeTestFile(t, root, "lowering-rules.yaml", `schema_version: 0
artifact_type: dmeta_web_lowering_rules
rules: []
`)
	writeTestFile(t, root, "component-system.yaml", `schema_version: 0
artifact_type: dmeta_web_component_system
id: web_component_system
levels:
  atom:
    description: Primitive.
    allowed_children: []
specificity:
  allowed: [generic]
`)
	writeTestFile(t, root, "widgets.yaml", `schema_version: 0
artifact_type: dmeta_web_widget_templates
templates:
  - id: test.atom
    name: TestAtom
    component:
      level: atom
      specificity: generic
      role: test_atom
      generation_policy: scaffold_once
    intent:
      purpose: Render a primitive.
      adapter_boundary: Receives normalized props and emits local callbacks only.
`)

	pkg, err := LoadPackage(context.Background(), root)
	if err != nil {
		t.Fatalf("LoadPackage() error = %v", err)
	}
	if pkg.ComponentSystem == nil {
		t.Fatalf("expected component system to be loaded")
	}
	if _, ok := pkg.ComponentSystem.Levels["atom"]; !ok {
		t.Fatalf("expected atom level in component system")
	}
}

func TestValidateComponentSystemPolicyUnknownAllowedChild(t *testing.T) {
	pkg := &Package{
		ComponentSystem: &ComponentSystemFile{
			Levels: map[string]ComponentLevel{
				"organism": {Description: "Section.", AllowedChildren: []string{"molecule"}},
			},
		},
	}

	findings := ValidatePackage(pkg, emptyInteractionPackage())
	if !validator.HasErrors(findings) {
		t.Fatalf("expected error finding for unknown allowed child, got %#v", findings)
	}
}

func TestValidateErrorsOnMissingCanonicalComponentLevel(t *testing.T) {
	pkg := &Package{
		Widgets: map[string]validator.Widget{
			"test.card": {
				ID:   "test.card",
				Name: "TestCard",
				Intent: validator.WidgetIntent{
					Purpose:         "Render a test card.",
					AdapterBoundary: "Receives normalized props and emits typed callbacks.",
				},
			},
		},
	}

	findings := ValidatePackage(pkg, emptyInteractionPackage())
	if !validator.HasErrors(findings) {
		t.Fatalf("expected missing canonical component errors, got %#v", findings)
	}
	for _, finding := range findings {
		if finding.Code == "missing_component_level" && finding.Severity == validator.SeverityError {
			return
		}
	}
	t.Fatalf("expected missing component level error, got %#v", findings)
}

func TestValidateAcceptsCanonicalComponentLevel(t *testing.T) {
	pkg := &Package{
		ComponentSystem: &ComponentSystemFile{
			Levels: map[string]ComponentLevel{
				"molecule": {Description: "Small composition."},
			},
			Specificity: SpecificityPolicy{Allowed: []string{"generic"}},
		},
		Widgets: map[string]validator.Widget{
			"test.card": {
				ID:        "test.card",
				Name:      "TestCard",
				Component: validator.WidgetComponent{Level: "molecule", Specificity: "generic", Role: "test_card", GenerationPolicy: "scaffold_once"},
				Intent: validator.WidgetIntent{
					Purpose:         "Render a test card.",
					AdapterBoundary: "Receives normalized props and emits typed callbacks.",
				},
			},
		},
	}

	findings := ValidatePackage(pkg, emptyInteractionPackage())
	if validator.HasErrors(findings) {
		t.Fatalf("unexpected errors for canonical component block: %#v", findings)
	}
}

func TestValidateWarnsWhenLoweringEmitsDependencyOnlyLevel(t *testing.T) {
	pkg := &Package{
		LoweringRules: LoweringRulesFile{Rules: []LoweringRule{
			{
				ID:   "emit_atom",
				When: LoweringSelector{Representations: []string{"compact_ref"}, Actions: []string{"select_subject"}},
				Emits: LoweringEmits{
					WidgetTemplates: []string{"test.atom"},
				},
			},
		}},
		ComponentSystem: &ComponentSystemFile{
			Levels: map[string]ComponentLevel{
				"atom": {Description: "Primitive.", CanBeEmittedByLowering: false},
			},
			LoweringRules: ComponentLoweringPolicy{
				DependencyOnlyLevels:                []string{"atom"},
				WarnWhenEmittingDependencyOnlyLevel: true,
			},
		},
		Widgets: map[string]validator.Widget{
			"test.atom": {
				ID:        "test.atom",
				Name:      "TestAtom",
				Component: validator.WidgetComponent{Level: "atom", Specificity: "generic", Role: "test_atom", GenerationPolicy: "scaffold_once"},
				Intent: validator.WidgetIntent{
					Purpose:         "Render a primitive.",
					AdapterBoundary: "Receives normalized props and emits local callbacks only.",
				},
			},
		},
	}

	findings := ValidatePackage(pkg, &interaction.Package{
		ActionsFile:     interaction.ActionsFile{Actions: map[string]interaction.Action{"select_subject": {}}},
		Representations: interaction.RepresentationsFile{Representations: map[string]interaction.Representation{"compact_ref": {}}},
	})
	if validator.HasErrors(findings) {
		t.Fatalf("unexpected error findings: %#v", findings)
	}
	for _, finding := range findings {
		if finding.Code == "lowering_emits_dependency_only_component" && finding.Severity == validator.SeverityWarning {
			return
		}
	}
	t.Fatalf("expected dependency-only lowering warning, got %#v", findings)
}

func emptyInteractionPackage() *interaction.Package {
	return &interaction.Package{
		ActionsFile:     interaction.ActionsFile{Actions: map[string]interaction.Action{}},
		Representations: interaction.RepresentationsFile{Representations: map[string]interaction.Representation{}},
	}
}

func writeTestFile(t *testing.T, root, name, content string) {
	t.Helper()
	path := filepath.Join(root, name)
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatalf("write %s: %v", path, err)
	}
}
