package core

// GeneratedFile is one TypeScript file rendered by the core registry generator.
type GeneratedFile struct {
	Path    string
	Content []byte
}

// WriteResult describes what happened for one generated output file.
type WriteResult struct {
	File   string
	Status string
	Bytes  int
	Reason string
}

const (
	StatusPlanned = "planned"
	StatusWritten = "written"
	StatusSkipped = "skipped"
)
