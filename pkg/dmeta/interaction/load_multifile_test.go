package interaction

import (
	"context"
	"os"
	"path/filepath"
	"testing"
)

func TestLoadPackageMergesMultipleInteractionCatalogFiles(t *testing.T) {
	root := t.TempDir()
	writeInteractionTestFile(t, root, "interactions/00-index.yaml", `schema_version: 0
artifact_type: dmeta_interaction_package
files:
  actions:
    - ./actions/base.yaml
    - ./actions/landing.yaml
  representations:
    - ./representations/base.yaml
    - ./representations/landing.yaml
  elaboration_rules:
    - ./elaboration-rules/base.yaml
    - ./elaboration-rules/landing.yaml
`)
	writeInteractionTestFile(t, root, "interactions/actions/base.yaml", `schema_version: 0
artifact_type: dmeta_interaction_actions
actions:
  Action:
    abstract: true
    extends: []
`)
	writeInteractionTestFile(t, root, "interactions/actions/landing.yaml", `schema_version: 0
artifact_type: dmeta_interaction_actions
actions:
  browse_category:
    extends: [Action]
    description: Browse a landing-page category.
`)
	writeInteractionTestFile(t, root, "interactions/representations/base.yaml", `schema_version: 0
artifact_type: dmeta_interaction_representations
representations:
  Representation:
    abstract: true
    extends: []
`)
	writeInteractionTestFile(t, root, "interactions/representations/landing.yaml", `schema_version: 0
artifact_type: dmeta_interaction_representations
representations:
  category_collection:
    extends: [Representation]
    description: Landing-page category collection.
`)
	writeInteractionTestFile(t, root, "interactions/elaboration-rules/base.yaml", `schema_version: 0
artifact_type: dmeta_interaction_elaboration_rules
rules:
  - id: base_rule
    description: Base rule.
`)
	writeInteractionTestFile(t, root, "interactions/elaboration-rules/landing.yaml", `schema_version: 0
artifact_type: dmeta_interaction_elaboration_rules
rules:
  - id: landing_rule
    description: Landing rule.
`)

	pkg, err := LoadPackage(context.Background(), root)
	if err != nil {
		t.Fatalf("LoadPackage() error = %v", err)
	}
	if _, ok := pkg.ActionsFile.Actions["browse_category"]; !ok {
		t.Fatalf("missing merged action")
	}
	if _, ok := pkg.Representations.Representations["category_collection"]; !ok {
		t.Fatalf("missing merged representation")
	}
	if got := len(pkg.RulesFile.Rules); got != 2 {
		t.Fatalf("expected 2 merged rules, got %d", got)
	}
}

func TestLoadPackageRejectsDuplicateInteractionActionIDs(t *testing.T) {
	root := t.TempDir()
	writeInteractionTestFile(t, root, "interactions/00-index.yaml", `schema_version: 0
artifact_type: dmeta_interaction_package
files:
  actions:
    - ./actions/a.yaml
    - ./actions/b.yaml
  representations: ./representations.yaml
  elaboration_rules: ./elaboration-rules.yaml
`)
	for _, name := range []string{"interactions/actions/a.yaml", "interactions/actions/b.yaml"} {
		writeInteractionTestFile(t, root, name, `schema_version: 0
artifact_type: dmeta_interaction_actions
actions:
  browse_category:
    description: Browse category.
`)
	}
	writeInteractionTestFile(t, root, "interactions/representations.yaml", `schema_version: 0
artifact_type: dmeta_interaction_representations
representations: {}
`)
	writeInteractionTestFile(t, root, "interactions/elaboration-rules.yaml", `schema_version: 0
artifact_type: dmeta_interaction_elaboration_rules
rules: []
`)

	if _, err := LoadPackage(context.Background(), root); err == nil {
		t.Fatalf("expected duplicate action error")
	}
}

func writeInteractionTestFile(t *testing.T, root, name, content string) {
	t.Helper()
	path := filepath.Join(root, name)
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatalf("mkdir %s: %v", filepath.Dir(path), err)
	}
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatalf("write %s: %v", path, err)
	}
}
