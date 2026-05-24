package pbui

import (
	"context"
	"os"
	"path/filepath"
	"sort"

	"github.com/pkg/errors"
	"gopkg.in/yaml.v3"
)

const (
	MetaDesignSystemArtifactType  = "dmeta_meta_design_system"
	PresentationTypesArtifactType = "dmeta_pbui_presentation_types"
	LoweringRulesArtifactType     = "dmeta_pbui_lowering_rules"
	ReactTargetArtifactType       = "dmeta_pbui_react_target"
)

func LoadPackage(ctx context.Context, root string) (*Package, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	default:
	}

	absRoot, err := filepath.Abs(root)
	if err != nil {
		return nil, errors.Wrap(err, "resolve PBUI MetaDesignSystem root")
	}

	meta, err := loadYAML[MetaDesignSystemFile](filepath.Join(absRoot, "meta-design-system.yaml"))
	if err != nil {
		return nil, errors.Wrap(err, "load PBUI MetaDesignSystem")
	}
	if meta.ArtifactType != MetaDesignSystemArtifactType {
		return nil, errors.Errorf("PBUI MetaDesignSystem artifact_type is %q, expected %s", meta.ArtifactType, MetaDesignSystemArtifactType)
	}

	presentationTypesPath := meta.Files["presentation_types"]
	if presentationTypesPath == "" {
		presentationTypesPath = "./presentation-types.yaml"
	}
	presentationTypesFullPath := filepath.Join(absRoot, presentationTypesPath)
	duplicatePresentationTypeIDs, err := duplicateMappingKeys(presentationTypesFullPath, "presentation_types")
	if err != nil {
		return nil, errors.Wrap(err, "scan PBUI presentation type keys")
	}
	presentationTypes, err := loadYAML[PresentationTypesFile](presentationTypesFullPath)
	if err != nil {
		return nil, errors.Wrap(err, "load PBUI presentation types")
	}
	if presentationTypes.ArtifactType != PresentationTypesArtifactType {
		return nil, errors.Errorf("PBUI presentation types artifact_type is %q, expected %s", presentationTypes.ArtifactType, PresentationTypesArtifactType)
	}

	loweringRulesPath := meta.Files["lowering_rules"]
	if loweringRulesPath == "" {
		loweringRulesPath = "./lowering-rules.yaml"
	}
	loweringRules, err := loadYAML[LoweringRulesFile](filepath.Join(absRoot, loweringRulesPath))
	if err != nil {
		return nil, errors.Wrap(err, "load PBUI lowering rules")
	}
	if loweringRules.ArtifactType != LoweringRulesArtifactType {
		return nil, errors.Errorf("PBUI lowering rules artifact_type is %q, expected %s", loweringRules.ArtifactType, LoweringRulesArtifactType)
	}

	reactTargetPath := meta.Files["react_target"]
	if reactTargetPath == "" {
		reactTargetPath = "./targets/react.yaml"
	}
	reactTarget, err := loadYAML[ReactTargetFile](filepath.Join(absRoot, reactTargetPath))
	if err != nil {
		return nil, errors.Wrap(err, "load PBUI React target")
	}
	if reactTarget.ArtifactType != ReactTargetArtifactType {
		return nil, errors.Errorf("PBUI React target artifact_type is %q, expected %s", reactTarget.ArtifactType, ReactTargetArtifactType)
	}

	return &Package{
		Root:                         absRoot,
		Meta:                         meta,
		PresentationTypes:            presentationTypes,
		LoweringRules:                loweringRules,
		ReactTarget:                  reactTarget,
		DuplicatePresentationTypeIDs: duplicatePresentationTypeIDs,
	}, nil
}

func duplicateMappingKeys(path string, topLevelKey string) ([]string, error) {
	b, err := os.ReadFile(filepath.Clean(path))
	if err != nil {
		return nil, err
	}
	var node yaml.Node
	if err := yaml.Unmarshal(b, &node); err != nil {
		return nil, err
	}
	if len(node.Content) == 0 || node.Content[0].Kind != yaml.MappingNode {
		return nil, nil
	}
	root := node.Content[0]
	for i := 0; i+1 < len(root.Content); i += 2 {
		key := root.Content[i]
		value := root.Content[i+1]
		if key.Value != topLevelKey || value.Kind != yaml.MappingNode {
			continue
		}
		seen := map[string]bool{}
		duplicates := map[string]bool{}
		for j := 0; j+1 < len(value.Content); j += 2 {
			id := value.Content[j].Value
			if seen[id] {
				duplicates[id] = true
			}
			seen[id] = true
		}
		out := make([]string, 0, len(duplicates))
		for id := range duplicates {
			out = append(out, id)
		}
		sort.Strings(out)
		return out, nil
	}
	return nil, nil
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
