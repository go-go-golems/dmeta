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
	widgets, err := loadYAML[WidgetIRFile](filepath.Join(absRoot, "03-widgets.yaml"))
	if err != nil {
		return nil, errors.Wrap(err, "load 03-widgets.yaml")
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
	if len(core.Archetypes) > 0 || len(core.Capabilities) > 0 || len(core.Presentations) > 0 || len(core.Actions) > 0 || len(core.DomainExamples) > 0 {
		return nil
	}

	if core.Files.CoreModel != "" {
		meta, err := loadYAML[CoreModelMetadataFile](filepath.Join(root, core.Files.CoreModel))
		if err != nil {
			return errors.Wrap(err, "load core model metadata")
		}
		core.LogicalTypes = meta.LogicalTypes
	}
	if core.Files.Archetypes != "" {
		archetypes, err := loadYAML[ArchetypesFile](filepath.Join(root, core.Files.Archetypes))
		if err != nil {
			return errors.Wrap(err, "load archetypes")
		}
		core.Archetypes = archetypes.Archetypes
	}
	if core.Files.Capabilities != "" {
		capabilities, err := loadYAML[CapabilitiesFile](filepath.Join(root, core.Files.Capabilities))
		if err != nil {
			return errors.Wrap(err, "load capabilities")
		}
		core.Capabilities = capabilities.Capabilities
	}
	if core.Files.Presentations != "" {
		presentations, err := loadYAML[PresentationsFile](filepath.Join(root, core.Files.Presentations))
		if err != nil {
			return errors.Wrap(err, "load presentations")
		}
		core.Presentations = presentations.Presentations
		core.Actions = presentations.Actions
	}
	if len(core.Files.Examples) > 0 {
		core.DomainExamples = map[string]DomainExample{}
		for _, examplePath := range core.Files.Examples {
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
