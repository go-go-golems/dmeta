package pbui

import (
	"sort"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

// ObjectTypeDescriptor is the PBUI/target-facing descriptor for a semantic
// domain type.
//
// It is derived, not authored. Semantic IR remains the source of truth for
// archetypes, capabilities, projections, and human-readable descriptions. PBUI
// targets use these descriptors to make object types inspectable and to power
// generated registries, inspector panels, command palettes, and documentation.
type ObjectTypeDescriptor struct {
	ExampleID              string                          `json:"exampleId" yaml:"example_id"`
	ID                     string                          `json:"id" yaml:"id"`
	Description            string                          `json:"description" yaml:"description"`
	Archetypes             []string                        `json:"archetypes" yaml:"archetypes"`
	Capabilities           []string                        `json:"capabilities" yaml:"capabilities"`
	CapabilityDescriptions map[string]string               `json:"capabilityDescriptions" yaml:"capability_descriptions"`
	Projections            map[string]ProjectionDescriptor `json:"projections" yaml:"projections"`
	Provenance             DescriptorProvenance            `json:"provenance" yaml:"provenance"`
}

type ProjectionDescriptor struct {
	Capability  string `json:"capability" yaml:"capability"`
	Type        string `json:"type" yaml:"type"`
	Required    bool   `json:"required" yaml:"required"`
	Description string `json:"description" yaml:"description"`
}

// ActionDescriptor is the PBUI/target-facing descriptor for an Interaction IR
// action.
//
// It is derived from Interaction IR so actions can become first-class objects in
// generated targets without duplicating the authored action catalog. Targets can
// render these descriptors as action presentations, command palette entries,
// inspector affordances, or metadata sidecars.
type ActionDescriptor struct {
	ID              string                             `json:"id" yaml:"id"`
	Intent          string                             `json:"intent" yaml:"intent"`
	Description     string                             `json:"description" yaml:"description"`
	LongDescription string                             `json:"longDescription" yaml:"long_description"`
	Extends         []string                           `json:"extends" yaml:"extends"`
	Abstract        bool                               `json:"abstract" yaml:"abstract"`
	Inputs          map[string]interaction.ActionInput `json:"inputs" yaml:"inputs"`
	Effects         interaction.ActionEffects          `json:"effects" yaml:"effects"`
	Result          validator.ActionResult             `json:"result" yaml:"result"`
	Safety          interaction.ActionSafety           `json:"safety" yaml:"safety"`
	Notes           string                             `json:"notes" yaml:"notes"`
	Provenance      DescriptorProvenance               `json:"provenance" yaml:"provenance"`
}

type DescriptorProvenance struct {
	SourceLayer      string   `json:"sourceLayer" yaml:"source_layer"`
	SourceArtifact   string   `json:"sourceArtifact" yaml:"source_artifact"`
	SourcePass       string   `json:"sourcePass" yaml:"source_pass"`
	SourceReferences []string `json:"sourceReferences" yaml:"source_references"`
}

func DeriveObjectTypeDescriptors(core validator.CoreModelFile, resolved *validator.ResolvedCoreModel) []ObjectTypeDescriptor {
	var out []ObjectTypeDescriptor
	for exampleID, example := range core.DomainExamples {
		for domainTypeID, domainType := range example.DomainTypes {
			capabilityIDs := effectiveCapabilityIDs(domainType, resolved)
			out = append(out, ObjectTypeDescriptor{
				ExampleID:              exampleID,
				ID:                     domainTypeID,
				Description:            domainType.Description,
				Archetypes:             effectiveArchetypeIDs(domainType, resolved),
				Capabilities:           capabilityIDs,
				CapabilityDescriptions: capabilityDescriptions(capabilityIDs, resolved),
				Projections:            projectionDescriptors(capabilityIDs, resolved),
				Provenance: DescriptorProvenance{
					SourceLayer:      "semantic-ir",
					SourceArtifact:   "domain_examples",
					SourcePass:       "pbui-descriptor-derivation",
					SourceReferences: []string{exampleID + ".domain_types." + domainTypeID},
				},
			})
		}
	}
	sort.SliceStable(out, func(i, j int) bool {
		if out[i].ExampleID != out[j].ExampleID {
			return out[i].ExampleID < out[j].ExampleID
		}
		return out[i].ID < out[j].ID
	})
	return out
}

func DeriveActionDescriptors(pkg *interaction.Package) []ActionDescriptor {
	ids := make([]string, 0, len(pkg.ActionsFile.Actions))
	for id := range pkg.ActionsFile.Actions {
		ids = append(ids, id)
	}
	sort.Strings(ids)

	out := make([]ActionDescriptor, 0, len(ids))
	for _, id := range ids {
		action := pkg.ActionsFile.Actions[id]
		out = append(out, ActionDescriptor{
			ID:              id,
			Intent:          action.Intent,
			Description:     action.Description,
			LongDescription: action.LongDescription,
			Extends:         append([]string{}, action.Extends...),
			Abstract:        action.Abstract,
			Inputs:          copyActionInputs(action.Inputs),
			Effects:         action.Effects,
			Result:          action.Result,
			Safety:          action.Safety,
			Notes:           action.Notes,
			Provenance: DescriptorProvenance{
				SourceLayer:      "interaction-ir",
				SourceArtifact:   "actions",
				SourcePass:       "pbui-descriptor-derivation",
				SourceReferences: []string{"actions." + id},
			},
		})
	}
	return out
}

func effectiveArchetypeIDs(domainType validator.DomainType, resolved *validator.ResolvedCoreModel) []string {
	out := []string{}
	for _, archetypeID := range domainType.Archetypes {
		out = stableAppendDescriptor(out, archetypeID)
		if resolved == nil {
			continue
		}
		if resolvedArchetype, ok := resolved.Archetypes[archetypeID]; ok {
			out = stableUnionDescriptor(out, resolvedArchetype.Ancestors)
		}
	}
	sort.Strings(out)
	return out
}

func effectiveCapabilityIDs(domainType validator.DomainType, resolved *validator.ResolvedCoreModel) []string {
	out := []string{}
	for _, archetypeID := range domainType.Archetypes {
		if resolved == nil {
			continue
		}
		if resolvedArchetype, ok := resolved.Archetypes[archetypeID]; ok {
			out = stableUnionDescriptor(out, resolvedArchetype.EffectiveDefaultCapabilities)
		}
	}
	for capabilityID := range domainType.Capabilities {
		out = stableAppendDescriptor(out, capabilityID)
		if resolved == nil {
			continue
		}
		if resolvedCapability, ok := resolved.Capabilities[capabilityID]; ok {
			out = stableUnionDescriptor(out, resolvedCapability.Ancestors)
		}
	}
	sort.Strings(out)
	return out
}

func capabilityDescriptions(capabilityIDs []string, resolved *validator.ResolvedCoreModel) map[string]string {
	out := map[string]string{}
	if resolved == nil {
		return out
	}
	for _, capabilityID := range capabilityIDs {
		if resolvedCapability, ok := resolved.Capabilities[capabilityID]; ok {
			out[capabilityID] = resolvedCapability.Raw.Description
		}
	}
	return out
}

func projectionDescriptors(capabilityIDs []string, resolved *validator.ResolvedCoreModel) map[string]ProjectionDescriptor {
	out := map[string]ProjectionDescriptor{}
	if resolved == nil {
		return out
	}
	for _, capabilityID := range capabilityIDs {
		resolvedCapability, ok := resolved.Capabilities[capabilityID]
		if !ok {
			continue
		}
		for projectionName, projection := range resolvedCapability.EffectiveProjections {
			key := capabilityID + "." + projectionName
			out[key] = ProjectionDescriptor{
				Capability:  capabilityID,
				Type:        projection.Type,
				Required:    projection.Required,
				Description: projection.Description,
			}
		}
	}
	return out
}

func copyActionInputs(inputs map[string]interaction.ActionInput) map[string]interaction.ActionInput {
	out := map[string]interaction.ActionInput{}
	for k, v := range inputs {
		v.Accepts = append([]interaction.SemanticSelector{}, v.Accepts...)
		out[k] = v
	}
	return out
}

func stableUnionDescriptor(dst, src []string) []string {
	out := append([]string{}, dst...)
	for _, value := range src {
		out = stableAppendDescriptor(out, value)
	}
	return out
}

func stableAppendDescriptor(values []string, value string) []string {
	if value == "" {
		return values
	}
	for _, existing := range values {
		if existing == value {
			return values
		}
	}
	return append(values, value)
}
