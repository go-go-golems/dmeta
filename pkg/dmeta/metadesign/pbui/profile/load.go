package profile

import (
	"context"
	"os"
	"path/filepath"

	"github.com/pkg/errors"
	"gopkg.in/yaml.v3"
)

const (
	PresentationSystemArtifactType   = "dmeta_pbui_presentation_system"
	StyleProfileArtifactType         = "dmeta_pbui_style_profile"
	SurfacesArtifactType             = "dmeta_pbui_surfaces"
	ViewModelsArtifactType           = "dmeta_pbui_view_models"
	PresentationBindingsArtifactType = "dmeta_pbui_presentation_bindings"
	ReactAppTargetArtifactType       = "dmeta_pbui_react_app_target"
)

func LoadPackage(ctx context.Context, root string) (*Package, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	default:
	}

	absRoot, err := filepath.Abs(root)
	if err != nil {
		return nil, errors.Wrap(err, "resolve PBUI profile root")
	}

	meta, err := loadYAML[PresentationSystemFile](filepath.Join(absRoot, "presentation-system.yaml"))
	if err != nil {
		return nil, errors.Wrap(err, "load PBUI presentation system")
	}
	if meta.ArtifactType != PresentationSystemArtifactType {
		return nil, errors.Errorf("PBUI presentation system artifact_type is %q, expected %s", meta.ArtifactType, PresentationSystemArtifactType)
	}

	style, err := loadYAML[StyleProfileFile](filepath.Join(absRoot, fileOrDefault(meta.Files["style_profile"], "./style-profile.yaml")))
	if err != nil {
		return nil, errors.Wrap(err, "load PBUI style profile")
	}
	if style.ArtifactType != StyleProfileArtifactType {
		return nil, errors.Errorf("PBUI style profile artifact_type is %q, expected %s", style.ArtifactType, StyleProfileArtifactType)
	}

	surfaces, err := loadYAML[SurfacesFile](filepath.Join(absRoot, fileOrDefault(meta.Files["surfaces"], "./surfaces.yaml")))
	if err != nil {
		return nil, errors.Wrap(err, "load PBUI surfaces")
	}
	if surfaces.ArtifactType != SurfacesArtifactType {
		return nil, errors.Errorf("PBUI surfaces artifact_type is %q, expected %s", surfaces.ArtifactType, SurfacesArtifactType)
	}

	viewModels, err := loadYAML[ViewModelsFile](filepath.Join(absRoot, fileOrDefault(meta.Files["view_models"], "./view-models.yaml")))
	if err != nil {
		return nil, errors.Wrap(err, "load PBUI view models")
	}
	if viewModels.ArtifactType != ViewModelsArtifactType {
		return nil, errors.Errorf("PBUI view models artifact_type is %q, expected %s", viewModels.ArtifactType, ViewModelsArtifactType)
	}

	bindings, err := loadYAML[PresentationBindingsFile](filepath.Join(absRoot, fileOrDefault(meta.Files["presentation_bindings"], "./presentation-bindings.yaml")))
	if err != nil {
		return nil, errors.Wrap(err, "load PBUI presentation bindings")
	}
	if bindings.ArtifactType != PresentationBindingsArtifactType {
		return nil, errors.Errorf("PBUI presentation bindings artifact_type is %q, expected %s", bindings.ArtifactType, PresentationBindingsArtifactType)
	}

	reactAppTarget, err := loadYAML[ReactAppTargetFile](filepath.Join(absRoot, fileOrDefault(meta.Files["react_app_target"], "./targets/react-app.yaml")))
	if err != nil {
		return nil, errors.Wrap(err, "load PBUI React app target")
	}
	if reactAppTarget.ArtifactType != ReactAppTargetArtifactType {
		return nil, errors.Errorf("PBUI React app target artifact_type is %q, expected %s", reactAppTarget.ArtifactType, ReactAppTargetArtifactType)
	}

	return &Package{
		Root:                 absRoot,
		Meta:                 meta,
		Style:                style,
		Surfaces:             surfaces,
		ViewModels:           viewModels,
		PresentationBindings: bindings,
		ReactAppTarget:       reactAppTarget,
	}, nil
}

func fileOrDefault(value string, fallback string) string {
	if value == "" {
		return fallback
	}
	return value
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
