package validator

import (
	"fmt"
	"strings"

	"gopkg.in/yaml.v3"
)

// FileList is a manifest helper for catalog files that can be authored either
// as a single scalar path or as an explicit ordered list of paths.
type FileList []string

func (f *FileList) UnmarshalYAML(value *yaml.Node) error {
	switch value.Kind {
	case yaml.ScalarNode:
		path := strings.TrimSpace(value.Value)
		if path == "" {
			*f = nil
			return nil
		}
		*f = FileList{path}
		return nil
	case yaml.SequenceNode:
		paths := make([]string, 0, len(value.Content))
		for i, item := range value.Content {
			if item.Kind != yaml.ScalarNode {
				return fmt.Errorf("file list item %d must be a string", i)
			}
			path := strings.TrimSpace(item.Value)
			if path == "" {
				return fmt.Errorf("file list item %d must not be empty", i)
			}
			paths = append(paths, path)
		}
		*f = FileList(paths)
		return nil
	case 0:
		*f = nil
		return nil
	default:
		return fmt.Errorf("expected string or list of strings")
	}
}

func (f FileList) WithDefault(defaultPath string) []string {
	if len(f) == 0 && strings.TrimSpace(defaultPath) != "" {
		return []string{defaultPath}
	}
	return append([]string{}, f...)
}
