package validator

import (
	"os"
	"path/filepath"
	"testing"

	"gopkg.in/yaml.v3"
)

func TestFileListUnmarshalStringAndList(t *testing.T) {
	var scalar struct {
		Files CoreModelFiles `yaml:"files"`
	}
	if err := yaml.Unmarshal([]byte("files:\n  archetypes: ./core-model/archetypes.yaml\n"), &scalar); err != nil {
		t.Fatalf("unmarshal scalar: %v", err)
	}
	if got := []string(scalar.Files.Archetypes); len(got) != 1 || got[0] != "./core-model/archetypes.yaml" {
		t.Fatalf("unexpected scalar file list: %#v", got)
	}

	var list struct {
		Files CoreModelFiles `yaml:"files"`
	}
	if err := yaml.Unmarshal([]byte("files:\n  archetypes:\n    - ./a.yaml\n    - ./b.yaml\n"), &list); err != nil {
		t.Fatalf("unmarshal list: %v", err)
	}
	if got := []string(list.Files.Archetypes); len(got) != 2 || got[0] != "./a.yaml" || got[1] != "./b.yaml" {
		t.Fatalf("unexpected sequence file list: %#v", got)
	}
}

func TestLoadSplitCoreModelMergesMultipleCatalogFiles(t *testing.T) {
	root := t.TempDir()
	writeValidatorTestFile(t, root, "core-model/archetypes-foundation.yaml", `schema_version: 0
artifact_type: dmeta_archetypes
archetypes:
  Archetype:
    abstract: true
    extends: []
`)
	writeValidatorTestFile(t, root, "core-model/archetypes-commerce.yaml", `schema_version: 0
artifact_type: dmeta_archetypes
archetypes:
  Product:
    extends: [Archetype]
`)
	writeValidatorTestFile(t, root, "core-model/capabilities-base.yaml", `schema_version: 0
artifact_type: dmeta_capabilities
capabilities:
  Capability:
    abstract: true
    extends: []
`)
	writeValidatorTestFile(t, root, "core-model/capabilities-commerce.yaml", `schema_version: 0
artifact_type: dmeta_capabilities
capabilities:
  purchasable:
    extends: [Capability]
    projections:
      price:
        type: money
        required: true
`)
	writeValidatorTestFile(t, root, "core-model/presentations-commerce.yaml", `schema_version: 0
artifact_type: dmeta_presentations
presentations:
  product_card:
    description: Product card presentation.
actions:
  open_product:
    description: Open product details.
`)
	writeValidatorTestFile(t, root, "core-model/presentations-landing.yaml", `schema_version: 0
artifact_type: dmeta_presentations
presentations:
  category_collection:
    description: Category collection presentation.
`)

	core := CoreModelFile{Files: CoreModelFiles{
		Archetypes:    FileList{"./core-model/archetypes-foundation.yaml", "./core-model/archetypes-commerce.yaml"},
		Capabilities:  FileList{"./core-model/capabilities-base.yaml", "./core-model/capabilities-commerce.yaml"},
		Presentations: FileList{"./core-model/presentations-commerce.yaml", "./core-model/presentations-landing.yaml"},
	}}
	if err := loadSplitCoreModel(root, &core); err != nil {
		t.Fatalf("load split core model: %v", err)
	}
	if _, ok := core.Archetypes["Archetype"]; !ok {
		t.Fatalf("missing merged root archetype")
	}
	if _, ok := core.Archetypes["Product"]; !ok {
		t.Fatalf("missing merged product archetype")
	}
	if _, ok := core.Capabilities["purchasable"]; !ok {
		t.Fatalf("missing merged purchasable capability")
	}
	if _, ok := core.Presentations["category_collection"]; !ok {
		t.Fatalf("missing merged landing presentation")
	}
	if _, ok := core.Actions["open_product"]; !ok {
		t.Fatalf("missing merged presentation action")
	}
}

func TestLoadSplitCoreModelRejectsDuplicateArchetypeIDs(t *testing.T) {
	root := t.TempDir()
	for _, name := range []string{"a.yaml", "b.yaml"} {
		writeValidatorTestFile(t, root, name, `schema_version: 0
artifact_type: dmeta_archetypes
archetypes:
  Product:
    extends: [Archetype]
`)
	}
	core := CoreModelFile{Files: CoreModelFiles{Archetypes: FileList{"./a.yaml", "./b.yaml"}}}
	if err := loadSplitCoreModel(root, &core); err == nil {
		t.Fatalf("expected duplicate archetype error")
	}
}

func writeValidatorTestFile(t *testing.T, root, name, content string) {
	t.Helper()
	path := filepath.Join(root, name)
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatalf("mkdir %s: %v", filepath.Dir(path), err)
	}
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatalf("write %s: %v", path, err)
	}
}
