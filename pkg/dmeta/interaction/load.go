package interaction

import (
	"context"
	"os"
	"path/filepath"

	"github.com/pkg/errors"
	"gopkg.in/yaml.v3"
)

func LoadPackage(ctx context.Context, root string) (*Package, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	default:
	}

	absRoot, err := filepath.Abs(root)
	if err != nil {
		return nil, errors.Wrap(err, "resolve interaction root")
	}
	interactionsRoot := filepath.Join(absRoot, "interactions")

	index, err := loadYAML[IndexFile](filepath.Join(interactionsRoot, "00-index.yaml"))
	if err != nil {
		return nil, errors.Wrap(err, "load interactions/00-index.yaml")
	}
	if index.ArtifactType != "dmeta_interaction_package" {
		return nil, errors.Errorf("interactions/00-index.yaml artifact_type is %q, expected dmeta_interaction_package", index.ArtifactType)
	}

	actionsPath := index.Files["actions"]
	if actionsPath == "" {
		actionsPath = "./actions.yaml"
	}
	actions, err := loadYAML[ActionsFile](filepath.Join(interactionsRoot, actionsPath))
	if err != nil {
		return nil, errors.Wrap(err, "load interaction actions")
	}
	if actions.ArtifactType != "dmeta_interaction_actions" {
		return nil, errors.Errorf("interaction actions artifact_type is %q, expected dmeta_interaction_actions", actions.ArtifactType)
	}

	representationsPath := index.Files["representations"]
	if representationsPath == "" {
		representationsPath = "./representations.yaml"
	}
	representations, err := loadYAML[RepresentationsFile](filepath.Join(interactionsRoot, representationsPath))
	if err != nil {
		return nil, errors.Wrap(err, "load interaction representations")
	}
	if representations.ArtifactType != "dmeta_interaction_representations" {
		return nil, errors.Errorf("interaction representations artifact_type is %q, expected dmeta_interaction_representations", representations.ArtifactType)
	}

	rulesPath := index.Files["elaboration_rules"]
	if rulesPath == "" {
		rulesPath = "./elaboration-rules.yaml"
	}
	rules, err := loadYAML[ElaborationRulesFile](filepath.Join(interactionsRoot, rulesPath))
	if err != nil {
		return nil, errors.Wrap(err, "load interaction elaboration rules")
	}
	if rules.ArtifactType != "dmeta_interaction_elaboration_rules" {
		return nil, errors.Errorf("interaction elaboration rules artifact_type is %q, expected dmeta_interaction_elaboration_rules", rules.ArtifactType)
	}

	return &Package{
		Root:            absRoot,
		Index:           index,
		ActionsFile:     actions,
		Representations: representations,
		RulesFile:       rules,
	}, nil
}

func loadYAML[T any](path string) (T, error) {
	var out T
	b, err := os.ReadFile(filepath.Clean(path))
	if err != nil {
		return out, err
	}
	if err := yaml.Unmarshal(b, &out); err != nil {
		return out, err
	}
	return out, nil
}
