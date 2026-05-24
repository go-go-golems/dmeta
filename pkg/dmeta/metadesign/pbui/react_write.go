package pbui

import (
	"os"
	"path/filepath"
)

type WriteOptions struct {
	DryRun       bool
	Force        bool
	MetadataOnly bool
}

type WriteResult struct {
	Path   string
	Kind   string
	Action string
	Bytes  int
}

func WriteReactFiles(files []ReactRenderedFile, opts WriteOptions) ([]WriteResult, error) {
	var results []WriteResult
	for _, file := range files {
		if opts.MetadataOnly && file.Kind != "metadata" {
			continue
		}
		action := "write"
		if opts.DryRun {
			action = "dry-run"
		}
		if !opts.DryRun {
			if _, err := os.Stat(file.Path); err == nil && !opts.Force {
				action = "skip-existing"
				results = append(results, WriteResult{Path: file.Path, Kind: file.Kind, Action: action, Bytes: len(file.Content)})
				continue
			} else if err != nil && !os.IsNotExist(err) {
				return results, err
			}
			if err := os.MkdirAll(filepath.Dir(file.Path), 0o755); err != nil {
				return results, err
			}
			if err := os.WriteFile(file.Path, []byte(file.Content), 0o644); err != nil {
				return results, err
			}
		}
		results = append(results, WriteResult{Path: file.Path, Kind: file.Kind, Action: action, Bytes: len(file.Content)})
	}
	return results, nil
}
