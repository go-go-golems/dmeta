package react

import (
	"encoding/json"
	"path/filepath"
)

type GeneratedFile struct {
	Path    string
	Kind    string
	Content []byte
}

type MetadataSidecar struct {
	GeneratedBy      string             `json:"generatedBy"`
	MetaDesignSystem string             `json:"metaDesignSystem"`
	CodegenTarget    string             `json:"codegenTarget"`
	ComponentName    string             `json:"componentName"`
	TemplateID       string             `json:"templateId"`
	Variant          string             `json:"variant,omitempty"`
	Realizes         RealizesMetadata   `json:"realizes"`
	Web              WebMetadata        `json:"web"`
	React            ReactMetadata      `json:"react"`
	Provenance       ProvenanceMetadata `json:"provenance"`
}

type RealizesMetadata struct {
	Representations []string `json:"representations,omitempty"`
	Actions         []string `json:"actions,omitempty"`
}

type WebMetadata struct {
	Slots         []string `json:"slots,omitempty"`
	VisualStates  []string `json:"visualStates,omitempty"`
	EventBindings []string `json:"eventBindings,omitempty"`
}

type ReactMetadata struct {
	PackageName string         `json:"packageName,omitempty"`
	Files       []ReactFileRef `json:"files,omitempty"`
}

type ReactFileRef struct {
	Kind   string `json:"kind"`
	Path   string `json:"path"`
	Symbol string `json:"symbol,omitempty"`
}

type ProvenanceMetadata struct {
	DomainTypes []string `json:"domainTypes,omitempty"`
	SourceRules []string `json:"sourceRules,omitempty"`
	Passes      []string `json:"passes,omitempty"`
}

func RenderMetadataSidecar(component ComponentPlan) ([]byte, error) {
	metadata := MetadataSidecar{
		GeneratedBy:      "dmeta plan-scaffold --target react",
		MetaDesignSystem: "web",
		CodegenTarget:    "react",
		ComponentName:    component.ComponentName,
		TemplateID:       component.TemplateID,
		Variant:          component.Variant,
		Realizes: RealizesMetadata{
			Representations: append([]string{}, component.RealizesRepresentations...),
			Actions:         append([]string{}, component.RealizesActions...),
		},
		Web: WebMetadata{
			Slots:         append([]string{}, component.Slots...),
			VisualStates:  append([]string{}, component.VisualStates...),
			EventBindings: append([]string{}, component.EventBindings...),
		},
		React: ReactMetadata{
			PackageName: component.PackageName,
			Files:       reactFileRefs(component.Files),
		},
		Provenance: ProvenanceMetadata{
			DomainTypes: append([]string{}, component.SourceDomainTypes...),
			SourceRules: append([]string{}, component.SourceRules...),
			Passes:      passesFromComponent(component),
		},
	}
	return json.MarshalIndent(metadata, "", "  ")
}

func GenerateMetadataSidecars(plan ScaffoldPlan) ([]GeneratedFile, error) {
	files := make([]GeneratedFile, 0, len(plan.Components))
	for _, component := range plan.Components {
		content, err := RenderMetadataSidecar(component)
		if err != nil {
			return nil, err
		}
		files = append(files, GeneratedFile{Path: filepath.Join(component.OutputDir, component.ComponentName, component.ComponentName+".metadata.json"), Kind: "metadata", Content: append(content, '\n')})
	}
	return files, nil
}

func reactFileRefs(files []PlannedFile) []ReactFileRef {
	refs := make([]ReactFileRef, 0, len(files))
	for _, file := range files {
		refs = append(refs, ReactFileRef{Kind: file.Kind, Path: file.Path, Symbol: file.Symbol})
	}
	return refs
}

func passesFromComponent(component ComponentPlan) []string {
	for _, file := range component.Files {
		if len(file.Provenance.Passes) > 0 {
			return append([]string{}, file.Provenance.Passes...)
		}
	}
	return nil
}
