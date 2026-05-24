package profile

import (
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/pkg/errors"
)

type ReactAppWriteOptions struct {
	DryRun bool
	Force  bool
}

type ReactAppWriteResult struct {
	Path   string
	Kind   string
	Action string
}

func WriteReactAppPlan(pkg *Package, concretePlan ConcretePresentationPlan, reactPlan ReactAppPlan, opts ReactAppWriteOptions) ([]ReactAppWriteResult, error) {
	var results []ReactAppWriteResult
	for _, file := range reactPlan.Files {
		result := ReactAppWriteResult{Path: file.Path, Kind: file.Kind, Action: "write"}
		if file.Kind == "font_assets" {
			result.Action = "copy"
			if opts.DryRun {
				result.Action = "dry-run-copy"
				results = append(results, result)
				continue
			}
			if err := copyFontAsset(pkg, file.Path, opts.Force); err != nil {
				return results, err
			}
			results = append(results, result)
			continue
		}

		content, ok, err := RenderReactAppFile(pkg, concretePlan, reactPlan, file)
		if err != nil {
			return results, err
		}
		if !ok {
			result.Action = "skip"
			results = append(results, result)
			continue
		}
		if opts.DryRun {
			result.Action = "dry-run-write"
			results = append(results, result)
			continue
		}
		if err := writeFile(file.Path, content, opts.Force); err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func writeFile(path string, content []byte, force bool) error {
	if !force {
		if _, err := os.Stat(path); err == nil {
			return errors.Errorf("refusing to overwrite existing file %s without --force", path)
		} else if !os.IsNotExist(err) {
			return err
		}
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	return os.WriteFile(path, content, 0o644)
}

func copyFontAsset(pkg *Package, dst string, force bool) error {
	if !force {
		if _, err := os.Stat(dst); err == nil {
			return errors.Errorf("refusing to overwrite existing file %s without --force", dst)
		} else if !os.IsNotExist(err) {
			return err
		}
	}
	fontName := filepath.Base(dst)
	src := filepath.Join(pkg.Root, "..", "..", "prototype-clim", "fonts", fontName)
	in, err := os.Open(filepath.Clean(src))
	if err != nil {
		return errors.Wrapf(err, "open font asset %s", src)
	}
	defer in.Close()
	if err := os.MkdirAll(filepath.Dir(dst), 0o755); err != nil {
		return err
	}
	out, err := os.Create(filepath.Clean(dst))
	if err != nil {
		return err
	}
	defer out.Close()
	_, err = io.Copy(out, in)
	return err
}

func ResolveReactAppOutputDir(profileRoot string, outputDir string) string {
	if filepath.IsAbs(outputDir) {
		return filepath.Clean(outputDir)
	}
	if strings.HasPrefix(outputDir, ".") {
		return filepath.Clean(filepath.Join(profileRoot, outputDir))
	}
	return filepath.Clean(outputDir)
}
