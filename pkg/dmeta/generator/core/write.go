package core

import (
	"os"
	"path/filepath"

	"github.com/pkg/errors"
)

func WriteFiles(files []GeneratedFile, force bool, dryRun bool) ([]WriteResult, error) {
	results := make([]WriteResult, 0, len(files))
	for _, file := range files {
		result := WriteResult{
			File:  file.Path,
			Bytes: len(file.Content),
		}

		if dryRun {
			result.Status = StatusPlanned
			result.Reason = "dry-run"
			results = append(results, result)
			continue
		}

		if _, err := os.Stat(file.Path); err == nil && !force {
			result.Status = StatusSkipped
			result.Reason = "file exists; pass --force to overwrite"
			results = append(results, result)
			continue
		} else if err != nil && !os.IsNotExist(err) {
			return results, errors.Wrapf(err, "stat output file %s", file.Path)
		}

		if err := os.MkdirAll(filepath.Dir(file.Path), 0o755); err != nil {
			return results, errors.Wrapf(err, "create output directory for %s", file.Path)
		}
		if err := os.WriteFile(file.Path, file.Content, 0o644); err != nil {
			return results, errors.Wrapf(err, "write output file %s", file.Path)
		}
		result.Status = StatusWritten
		results = append(results, result)
	}
	return results, nil
}
