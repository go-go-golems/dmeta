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
