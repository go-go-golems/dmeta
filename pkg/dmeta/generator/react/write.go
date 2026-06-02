package react

import (
	"os"
	"path/filepath"
	"strings"

	coregen "github.com/go-go-golems/dmeta/pkg/dmeta/generator/core"
	"github.com/pkg/errors"
)

func WriteFiles(files []GeneratedFile, force bool, dryRun bool) ([]coregen.WriteResult, error) {
	results := make([]coregen.WriteResult, 0, len(files))
	for _, file := range files {
		lifecycle := normalizeWriteLifecycle(file.Lifecycle)
		result := coregen.WriteResult{File: file.Path, Bytes: len(file.Content), Reason: lifecycle}
		if dryRun {
			result.Status = coregen.StatusPlanned
			result.Reason = lifecycle + "; dry-run"
			results = append(results, result)
			continue
		}

		exists, err := fileExists(file.Path)
		if err != nil {
			return results, errors.Wrapf(err, "stat output file %s", file.Path)
		}
		if exists && lifecycle == "scaffold_once" {
			result.Status = coregen.StatusSkipped
			result.Reason = "scaffold_once; file exists"
			results = append(results, result)
			continue
		}
		if exists && lifecycle != "regenerate_only" && !force {
			result.Status = coregen.StatusSkipped
			result.Reason = lifecycle + "; file exists; pass --force to overwrite"
			results = append(results, result)
			continue
		}

		if err := os.MkdirAll(filepath.Dir(file.Path), 0o755); err != nil {
			return results, errors.Wrapf(err, "create output directory for %s", file.Path)
		}
		if err := os.WriteFile(file.Path, file.Content, 0o644); err != nil {
			return results, errors.Wrapf(err, "write output file %s", file.Path)
		}
		result.Status = coregen.StatusWritten
		results = append(results, result)
	}
	return results, nil
}

func fileExists(path string) (bool, error) {
	if _, err := os.Stat(path); err == nil {
		return true, nil
	} else if os.IsNotExist(err) {
		return false, nil
	} else {
		return false, err
	}
}

func normalizeWriteLifecycle(lifecycle string) string {
	normalized := strings.ToLower(strings.TrimSpace(strings.ReplaceAll(lifecycle, "-", "_")))
	switch normalized {
	case "", "generated_sidecar", "sidecar_for_merge", "sidecar", "scaffold":
		return "generated_sidecar"
	case "regenerate", "regenerate_only", "generated_only":
		return "regenerate_only"
	case "scaffold_once":
		return "scaffold_once"
	default:
		return normalized
	}
}
