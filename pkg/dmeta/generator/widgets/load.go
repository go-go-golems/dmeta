package widgets

import (
	"context"
	"os"
	"path/filepath"

	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
	"github.com/pkg/errors"
	"gopkg.in/yaml.v3"
)

func LoadInstance(path string) (InstanceManifest, string, error) {
	var instance InstanceManifest
	abs, err := filepath.Abs(path)
	if err != nil {
		return instance, "", errors.Wrap(err, "resolve instance manifest path")
	}
	b, err := os.ReadFile(abs)
	if err != nil {
		return instance, "", errors.Wrap(err, "read instance manifest")
	}
	if err := yaml.Unmarshal(b, &instance); err != nil {
		return instance, "", errors.Wrap(err, "parse instance manifest")
	}
	if instance.ArtifactType != "dmeta_instance" {
		return instance, "", errors.Errorf("instance artifact_type is %q, expected dmeta_instance", instance.ArtifactType)
	}
	return instance, filepath.Dir(abs), nil
}

func ResolveTemplates(ctx context.Context, globalRoot string, instanceDir string, instance InstanceManifest) ([]ResolvedTemplate, error) {
	if globalRoot == "" {
		globalRoot = instance.TemplateSources.GlobalIRRoot
	}
	if globalRoot == "" {
		return nil, errors.New("no global IR root supplied and template_sources.global_ir_root is empty")
	}
	if !filepath.IsAbs(globalRoot) {
		globalRoot = filepath.Join(instanceDir, globalRoot)
	}
	pkg, err := validator.LoadPackage(ctx, globalRoot)
	if err != nil {
		return nil, errors.Wrap(err, "load global DMETA IR")
	}

	catalog := map[string]validator.Widget{}
	for _, widget := range pkg.Widgets.Widgets {
		catalog[widget.ID] = widget
	}
	for _, localPath := range instance.TemplateSources.LocalTemplateFiles {
		path := localPath
		if !filepath.IsAbs(path) {
			path = filepath.Join(instanceDir, path)
		}
		local, err := loadLocalTemplates(path)
		if err != nil {
			return nil, err
		}
		for _, widget := range local.Templates {
			catalog[widget.ID] = widget
		}
	}

	resolved := make([]ResolvedTemplate, 0, len(instance.SelectedTemplates))
	seenAs := map[string]bool{}
	for _, selected := range instance.SelectedTemplates {
		widget, ok := catalog[selected.Template]
		if !ok {
			return nil, errors.Errorf("selected template %q not found", selected.Template)
		}
		name := selected.As
		if name == "" {
			name = widget.Name
		}
		if seenAs[name] {
			return nil, errors.Errorf("selected component name %q is used more than once", name)
		}
		seenAs[name] = true
		resolved = append(resolved, ResolvedTemplate{Selected: selected, Template: widget})
	}
	return resolved, nil
}

func loadLocalTemplates(path string) (validator.WidgetTemplatesFile, error) {
	var out validator.WidgetTemplatesFile
	b, err := os.ReadFile(path)
	if err != nil {
		return out, errors.Wrapf(err, "read local template file %s", path)
	}
	if err := yaml.Unmarshal(b, &out); err != nil {
		return out, errors.Wrapf(err, "parse local template file %s", path)
	}
	if out.ArtifactType != "dmeta_widget_templates" {
		return out, errors.Errorf("local template file %s artifact_type is %q, expected dmeta_widget_templates", path, out.ArtifactType)
	}
	return out, nil
}
