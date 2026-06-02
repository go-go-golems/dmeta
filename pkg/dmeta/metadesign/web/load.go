package web

import (
	"context"
	"os"
	"path/filepath"

	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
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
		return nil, errors.Wrap(err, "resolve Web MetaDesignSystem root")
	}
	meta, err := loadYAML[MetaDesignSystemFile](filepath.Join(absRoot, "meta-design-system.yaml"))
	if err != nil {
		return nil, errors.Wrap(err, "load Web MetaDesignSystem")
	}
	if meta.ArtifactType != "dmeta_meta_design_system" {
		return nil, errors.Errorf("Web MetaDesignSystem artifact_type is %q, expected dmeta_meta_design_system", meta.ArtifactType)
	}

	loweringPath := meta.Files["lowering_rules"]
	if loweringPath == "" {
		loweringPath = "./lowering-rules.yaml"
	}
	loweringRules, err := loadYAML[LoweringRulesFile](filepath.Join(absRoot, loweringPath))
	if err != nil {
		return nil, errors.Wrap(err, "load Web lowering rules")
	}
	if loweringRules.ArtifactType != "dmeta_web_lowering_rules" {
		return nil, errors.Errorf("Web lowering rules artifact_type is %q, expected dmeta_web_lowering_rules", loweringRules.ArtifactType)
	}

	var componentSystem *ComponentSystemFile
	if componentSystemPath := meta.Files["component_system"]; componentSystemPath != "" {
		loaded, err := loadYAML[ComponentSystemFile](filepath.Join(absRoot, componentSystemPath))
		if err != nil {
			return nil, errors.Wrap(err, "load Web component system")
		}
		if loaded.ArtifactType != "dmeta_web_component_system" {
			return nil, errors.Errorf("Web component system artifact_type is %q, expected dmeta_web_component_system", loaded.ArtifactType)
		}
		componentSystem = &loaded
	}

	widgets := map[string]validator.Widget{}
	for key, templatePath := range meta.Files {
		if isNonWidgetMetaDesignSystemFile(key) || templatePath == "" {
			continue
		}
		templateFile, err := loadYAML[validator.WidgetTemplatesFile](filepath.Join(absRoot, templatePath))
		if err != nil {
			return nil, errors.Wrapf(err, "load Web widget template file %s", templatePath)
		}
		if templateFile.ArtifactType != "dmeta_web_widget_templates" {
			return nil, errors.Errorf("Web widget template file %s artifact_type is %q, expected dmeta_web_widget_templates", templatePath, templateFile.ArtifactType)
		}
		for _, widget := range templateFile.Templates {
			widgets[widget.ID] = widget
		}
	}

	return &Package{Root: absRoot, Meta: meta, LoweringRules: loweringRules, ComponentSystem: componentSystem, Widgets: widgets}, nil
}

func isNonWidgetMetaDesignSystemFile(key string) bool {
	switch key {
	case "index", "lowering_rules", "component_system", "style_tokens", "style_recipes":
		return true
	default:
		return false
	}
}

func loadYAML[T any](path string) (T, error) {
	var out T
	b, err := os.ReadFile(path)
	if err != nil {
		return out, err
	}
	if err := yaml.Unmarshal(b, &out); err != nil {
		return out, err
	}
	return out, nil
}
