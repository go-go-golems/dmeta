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

	actions, err := loadActionsFiles(interactionsRoot, index.Files.Actions.WithDefault("./actions.yaml"))
	if err != nil {
		return nil, err
	}

	representations, err := loadRepresentationFiles(interactionsRoot, index.Files.Representations.WithDefault("./representations.yaml"))
	if err != nil {
		return nil, err
	}

	rules, err := loadElaborationRuleFiles(interactionsRoot, index.Files.ElaborationRules.WithDefault("./elaboration-rules.yaml"))
	if err != nil {
		return nil, err
	}

	pkg := &Package{
		Root:            absRoot,
		Index:           index,
		ActionsFile:     actions,
		Representations: representations,
		RulesFile:       rules,
	}
	if inheritedRoot := index.Inherits["interactions_root"]; inheritedRoot != "" {
		if !filepath.IsAbs(inheritedRoot) {
			inheritedRoot = filepath.Join(absRoot, inheritedRoot)
		}
		basePkg, err := LoadPackage(ctx, inheritedRoot)
		if err != nil {
			return nil, errors.Wrap(err, "load inherited interaction package")
		}
		pkg = mergePackages(basePkg, pkg)
	}
	return pkg, nil
}

func loadActionsFiles(root string, paths []string) (ActionsFile, error) {
	out := ActionsFile{Actions: map[string]Action{}}
	for _, actionPath := range paths {
		actions, err := loadYAML[ActionsFile](filepath.Join(root, actionPath))
		if err != nil {
			return out, errors.Wrapf(err, "load interaction actions %s", actionPath)
		}
		if actions.ArtifactType != "dmeta_interaction_actions" {
			return out, errors.Errorf("interaction actions %s artifact_type is %q, expected dmeta_interaction_actions", actionPath, actions.ArtifactType)
		}
		if out.SchemaVersion == 0 {
			out.SchemaVersion = actions.SchemaVersion
			out.ArtifactType = actions.ArtifactType
			out.Summary = actions.Summary
			out.LongSummary = actions.LongSummary
		}
		for id, action := range actions.Actions {
			if _, exists := out.Actions[id]; exists {
				return out, errors.Errorf("duplicate interaction action %q in %s", id, actionPath)
			}
			out.Actions[id] = action
		}
	}
	return out, nil
}

func loadRepresentationFiles(root string, paths []string) (RepresentationsFile, error) {
	out := RepresentationsFile{Representations: map[string]Representation{}}
	for _, representationPath := range paths {
		representations, err := loadYAML[RepresentationsFile](filepath.Join(root, representationPath))
		if err != nil {
			return out, errors.Wrapf(err, "load interaction representations %s", representationPath)
		}
		if representations.ArtifactType != "dmeta_interaction_representations" {
			return out, errors.Errorf("interaction representations %s artifact_type is %q, expected dmeta_interaction_representations", representationPath, representations.ArtifactType)
		}
		if out.SchemaVersion == 0 {
			out.SchemaVersion = representations.SchemaVersion
			out.ArtifactType = representations.ArtifactType
			out.Summary = representations.Summary
			out.LongSummary = representations.LongSummary
		}
		for id, representation := range representations.Representations {
			if _, exists := out.Representations[id]; exists {
				return out, errors.Errorf("duplicate interaction representation %q in %s", id, representationPath)
			}
			out.Representations[id] = representation
		}
	}
	return out, nil
}

func loadElaborationRuleFiles(root string, paths []string) (ElaborationRulesFile, error) {
	out := ElaborationRulesFile{}
	for _, rulesPath := range paths {
		rules, err := loadYAML[ElaborationRulesFile](filepath.Join(root, rulesPath))
		if err != nil {
			return out, errors.Wrapf(err, "load interaction elaboration rules %s", rulesPath)
		}
		if rules.ArtifactType != "dmeta_interaction_elaboration_rules" {
			return out, errors.Errorf("interaction elaboration rules %s artifact_type is %q, expected dmeta_interaction_elaboration_rules", rulesPath, rules.ArtifactType)
		}
		if out.SchemaVersion == 0 {
			out.SchemaVersion = rules.SchemaVersion
			out.ArtifactType = rules.ArtifactType
			out.Summary = rules.Summary
		}
		out.Rules = append(out.Rules, rules.Rules...)
	}
	return out, nil
}

func mergePackages(base *Package, local *Package) *Package {
	out := *local
	out.ActionsFile.Actions = map[string]Action{}
	for id, action := range base.ActionsFile.Actions {
		out.ActionsFile.Actions[id] = action
	}
	for id, action := range local.ActionsFile.Actions {
		out.ActionsFile.Actions[id] = action
	}

	out.Representations.Representations = map[string]Representation{}
	for id, representation := range base.Representations.Representations {
		out.Representations.Representations[id] = representation
	}
	for id, representation := range local.Representations.Representations {
		out.Representations.Representations[id] = representation
	}

	out.RulesFile.Rules = append([]ElaborationRule{}, base.RulesFile.Rules...)
	out.RulesFile.Rules = append(out.RulesFile.Rules, local.RulesFile.Rules...)
	return &out
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
