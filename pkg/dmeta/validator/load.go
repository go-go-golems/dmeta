package validator

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
		return nil, errors.Wrap(err, "resolve IR root")
	}

	index, err := loadYAML[IndexFile](filepath.Join(absRoot, "00-index.yaml"))
	if err != nil {
		return nil, errors.Wrap(err, "load 00-index.yaml")
	}
	core, err := loadYAML[CoreModelFile](filepath.Join(absRoot, "01-core-model.yaml"))
	if err != nil {
		return nil, errors.Wrap(err, "load 01-core-model.yaml")
	}
	if err := loadSplitCoreModel(absRoot, &core); err != nil {
		return nil, errors.Wrap(err, "load split core model")
	}
	design, err := loadYAML[DesignLanguageFile](filepath.Join(absRoot, "02-design-language.yaml"))
	if err != nil {
		return nil, errors.Wrap(err, "load 02-design-language.yaml")
	}
	widgets, err := loadWidgetTemplates(absRoot)
	if err != nil {
		return nil, errors.Wrap(err, "load widget templates")
	}

	return &Package{
		Root:           absRoot,
		Index:          index,
		CoreModel:      core,
		DesignLanguage: design,
		Widgets:        widgets,
	}, nil
}

func loadSplitCoreModel(root string, core *CoreModelFile) error {
	// Backwards compatibility for the original monolithic 01-core-model.yaml:
	// if it already contains the model sections, there is nothing to merge.
	if len(core.Archetypes) > 0 || len(core.Capabilities) > 0 || len(core.DomainExamples) > 0 {
		return nil
	}

	if core.Files.CoreModel != "" {
		meta, err := loadYAML[CoreModelMetadataFile](filepath.Join(root, core.Files.CoreModel))
		if err != nil {
			return errors.Wrap(err, "load core model metadata")
		}
		core.LogicalTypes = meta.LogicalTypes
	}
	if len(core.Files.Archetypes) > 0 {
		core.Archetypes = map[string]Archetype{}
		for _, archetypePath := range core.Files.Archetypes {
			archetypes, err := loadYAML[ArchetypesFile](filepath.Join(root, archetypePath))
			if err != nil {
				return errors.Wrapf(err, "load archetypes %s", archetypePath)
			}
			if err := mergeArchetypes(core.Archetypes, archetypes.Archetypes, archetypePath); err != nil {
				return err
			}
		}
	}
	if len(core.Files.Capabilities) > 0 {
		core.Capabilities = map[string]Capability{}
		for _, capabilityPath := range core.Files.Capabilities {
			capabilities, err := loadYAML[CapabilitiesFile](filepath.Join(root, capabilityPath))
			if err != nil {
				return errors.Wrapf(err, "load capabilities %s", capabilityPath)
			}
			if err := mergeCapabilities(core.Capabilities, capabilities.Capabilities, capabilityPath); err != nil {
				return err
			}
		}
	}
	if core.Files.DomainExample != "" || len(core.Files.Examples) > 0 {
		core.DomainExamples = map[string]DomainExample{}
		paths := append([]string{}, core.Files.Examples...)
		if core.Files.DomainExample != "" {
			paths = append(paths, core.Files.DomainExample)
		}
		for _, examplePath := range paths {
			example, err := loadYAML[DomainExampleFile](filepath.Join(root, examplePath))
			if err != nil {
				return errors.Wrapf(err, "load domain example %s", examplePath)
			}
			id := example.ID
			if id == "" {
				id = filepath.Base(examplePath)
			}
			core.DomainExamples[id] = example.DomainExample
		}
	}
	return nil
}

func mergeArchetypes(dst map[string]Archetype, src map[string]Archetype, sourcePath string) error {
	for id, value := range src {
		if _, exists := dst[id]; exists {
			return errors.Errorf("duplicate archetype %q in %s", id, sourcePath)
		}
		dst[id] = value
	}
	return nil
}

func mergeCapabilities(dst map[string]Capability, src map[string]Capability, sourcePath string) error {
	for id, value := range src {
		if _, exists := dst[id]; exists {
			return errors.Errorf("duplicate capability %q in %s", id, sourcePath)
		}
		dst[id] = value
	}
	return nil
}

func loadWidgetTemplates(root string) (WidgetIRFile, error) {
	webRoot := filepath.Join(root, "meta-design-systems", "web")
	widgets, err := loadYAML[WidgetIRFile](filepath.Join(webRoot, "meta-design-system.yaml"))
	if err != nil {
		return widgets, errors.Wrap(err, "load Web MetaDesignSystem")
	}
	if widgets.ArtifactType != "dmeta_meta_design_system" {
		return widgets, errors.Errorf("Web MetaDesignSystem artifact_type is %q, expected dmeta_meta_design_system", widgets.ArtifactType)
	}
	widgets.Widgets = nil
	for key, templatePath := range widgets.Files {
		if isNonWidgetMetaDesignSystemFile(key) || templatePath == "" {
			continue
		}
		templateFile, err := loadYAML[WidgetTemplatesFile](filepath.Join(webRoot, templatePath))
		if err != nil {
			return widgets, errors.Wrapf(err, "load Web widget template file %s", templatePath)
		}
		if templateFile.ArtifactType != "dmeta_web_widget_templates" {
			return widgets, errors.Errorf("Web widget template file %s artifact_type is %q, expected dmeta_web_widget_templates", templatePath, templateFile.ArtifactType)
		}
		widgets.Widgets = append(widgets.Widgets, templateFile.Templates...)
	}
	return widgets, nil
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
