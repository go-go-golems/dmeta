package validator

import (
	"fmt"
	"reflect"
	"strings"
)

const (
	RootArchetypeID  = "Archetype"
	RootCapabilityID = "Capability"
)

type ResolvedCoreModel struct {
	Raw                   CoreModelFile
	Archetypes            map[string]ResolvedArchetype
	Capabilities          map[string]ResolvedCapability
	ArchetypeDescendants  map[string][]string
	CapabilityDescendants map[string][]string
}

type ResolvedArchetype struct {
	ID                                string
	Raw                               Archetype
	Ancestors                         []string
	EffectiveDefaultCapabilities      []string
	EffectiveRecommendedPresentations []string
	EffectiveExamples                 []string
}

type ResolvedCapability struct {
	ID                     string
	Raw                    Capability
	Ancestors              []string
	EffectiveProjections   map[string]Projection
	EffectivePresentations []string
	EffectiveActions       []string
	EffectiveFilters       []string
}

type inheritanceResolver struct {
	core                CoreModelFile
	archetypes          map[string]ResolvedArchetype
	capabilities        map[string]ResolvedCapability
	archetypeResolving  map[string]bool
	capabilityResolving map[string]bool
	findings            []Finding
}

func ResolveCoreInheritance(core CoreModelFile) (*ResolvedCoreModel, []Finding) {
	r := &inheritanceResolver{
		core:                core,
		archetypes:          map[string]ResolvedArchetype{},
		capabilities:        map[string]ResolvedCapability{},
		archetypeResolving:  map[string]bool{},
		capabilityResolving: map[string]bool{},
	}

	r.validateRoots()
	for id := range core.Archetypes {
		r.resolveArchetype(id, nil)
	}
	for id := range core.Capabilities {
		r.resolveCapability(id, nil)
	}

	resolved := &ResolvedCoreModel{
		Raw:                   core,
		Archetypes:            r.archetypes,
		Capabilities:          r.capabilities,
		ArchetypeDescendants:  buildArchetypeDescendants(r.archetypes),
		CapabilityDescendants: buildCapabilityDescendants(r.capabilities),
	}
	return resolved, r.findings
}

func (r *inheritanceResolver) validateRoots() {
	arch, ok := r.core.Archetypes[RootArchetypeID]
	if !ok {
		r.findings = append(r.findings, Error("core_model", "archetypes."+RootArchetypeID, "missing_root_archetype", "core model is missing explicit root archetype \"Archetype\"", "Add an abstract Archetype root with extends: []."))
	} else {
		if len(arch.Extends) != 0 {
			r.findings = append(r.findings, Error("core_model", "archetypes."+RootArchetypeID+".extends", "root_archetype_extends", "root archetype \"Archetype\" must not extend another archetype", "Set extends: [] on the Archetype root."))
		}
		if !arch.Abstract {
			r.findings = append(r.findings, Error("core_model", "archetypes."+RootArchetypeID+".abstract", "root_archetype_not_abstract", "root archetype \"Archetype\" must be abstract", "Set abstract: true on the Archetype root."))
		}
	}
	cap, ok := r.core.Capabilities[RootCapabilityID]
	if !ok {
		r.findings = append(r.findings, Error("core_model", "capabilities."+RootCapabilityID, "missing_root_capability", "core model is missing explicit root capability \"Capability\"", "Add an abstract Capability root with extends: []."))
	} else {
		if len(cap.Extends) != 0 {
			r.findings = append(r.findings, Error("core_model", "capabilities."+RootCapabilityID+".extends", "root_capability_extends", "root capability \"Capability\" must not extend another capability", "Set extends: [] on the Capability root."))
		}
		if !cap.Abstract {
			r.findings = append(r.findings, Error("core_model", "capabilities."+RootCapabilityID+".abstract", "root_capability_not_abstract", "root capability \"Capability\" must be abstract", "Set abstract: true on the Capability root."))
		}
	}
}

func (r *inheritanceResolver) resolveArchetype(id string, stack []string) (ResolvedArchetype, bool) {
	if resolved, ok := r.archetypes[id]; ok {
		return resolved, true
	}
	raw, ok := r.core.Archetypes[id]
	if !ok {
		r.findings = append(r.findings, Error("core_model", "archetypes."+id, "unknown_archetype", fmt.Sprintf("archetype %q does not exist", id), "Define the archetype or fix the extends reference."))
		return ResolvedArchetype{}, false
	}
	if r.archetypeResolving[id] {
		cycle := append(append([]string{}, stack...), id)
		r.findings = append(r.findings, Error("core_model", "archetypes."+id+".extends", "archetype_inheritance_cycle", fmt.Sprintf("archetype inheritance cycle: %s", strings.Join(cycle, " -> ")), "Remove or reorder extends entries so the archetype graph is acyclic."))
		return ResolvedArchetype{}, false
	}
	if id != RootArchetypeID && len(raw.Extends) == 0 {
		r.findings = append(r.findings, Error("core_model", "archetypes."+id+".extends", "missing_archetype_extends", fmt.Sprintf("archetype %q has no extends list", id), "Every non-root archetype must declare at least one parent."))
	}
	if duplicate := firstDuplicate(raw.Extends); duplicate != "" {
		r.findings = append(r.findings, Error("core_model", "archetypes."+id+".extends", "duplicate_archetype_parent", fmt.Sprintf("archetype %q lists parent %q more than once", id, duplicate), "Remove duplicate parent ids."))
	}

	r.archetypeResolving[id] = true
	defer delete(r.archetypeResolving, id)

	ancestors := []string{}
	caps := []string{}
	presentations := []string{}
	examples := []string{}
	for _, parentID := range raw.Extends {
		parent, ok := r.resolveArchetype(parentID, append(stack, id))
		if !ok {
			continue
		}
		ancestors = stableUnion(ancestors, parent.Ancestors)
		ancestors = stableAppend(ancestors, parentID)
		caps = stableUnion(caps, parent.EffectiveDefaultCapabilities)
		presentations = stableUnion(presentations, parent.EffectiveRecommendedPresentations)
		examples = stableUnion(examples, parent.EffectiveExamples)
	}
	caps = stableUnion(caps, raw.DefaultCapabilities)
	presentations = stableUnion(presentations, raw.RecommendedPresentations)
	examples = stableUnion(examples, raw.Examples)

	resolved := ResolvedArchetype{ID: id, Raw: raw, Ancestors: ancestors, EffectiveDefaultCapabilities: caps, EffectiveRecommendedPresentations: presentations, EffectiveExamples: examples}
	r.archetypes[id] = resolved
	return resolved, true
}

func (r *inheritanceResolver) resolveCapability(id string, stack []string) (ResolvedCapability, bool) {
	if resolved, ok := r.capabilities[id]; ok {
		return resolved, true
	}
	raw, ok := r.core.Capabilities[id]
	if !ok {
		r.findings = append(r.findings, Error("core_model", "capabilities."+id, "unknown_capability", fmt.Sprintf("capability %q does not exist", id), "Define the capability or fix the extends reference."))
		return ResolvedCapability{}, false
	}
	if r.capabilityResolving[id] {
		cycle := append(append([]string{}, stack...), id)
		r.findings = append(r.findings, Error("core_model", "capabilities."+id+".extends", "capability_inheritance_cycle", fmt.Sprintf("capability inheritance cycle: %s", strings.Join(cycle, " -> ")), "Remove or reorder extends entries so the capability graph is acyclic."))
		return ResolvedCapability{}, false
	}
	if id != RootCapabilityID && len(raw.Extends) == 0 {
		r.findings = append(r.findings, Error("core_model", "capabilities."+id+".extends", "missing_capability_extends", fmt.Sprintf("capability %q has no extends list", id), "Every non-root capability must declare at least one parent."))
	}
	if duplicate := firstDuplicate(raw.Extends); duplicate != "" {
		r.findings = append(r.findings, Error("core_model", "capabilities."+id+".extends", "duplicate_capability_parent", fmt.Sprintf("capability %q lists parent %q more than once", id, duplicate), "Remove duplicate parent ids."))
	}

	r.capabilityResolving[id] = true
	defer delete(r.capabilityResolving, id)

	ancestors := []string{}
	projections := map[string]Projection{}
	presentations := []string{}
	actions := []string{}
	filters := []string{}
	for _, parentID := range raw.Extends {
		parent, ok := r.resolveCapability(parentID, append(stack, id))
		if !ok {
			continue
		}
		ancestors = stableUnion(ancestors, parent.Ancestors)
		ancestors = stableAppend(ancestors, parentID)
		projections = r.mergeProjections(projections, parent.EffectiveProjections, id, parentID)
		presentations = stableUnion(presentations, parent.EffectivePresentations)
		actions = stableUnion(actions, parent.EffectiveActions)
		filters = stableUnion(filters, parent.EffectiveFilters)
	}
	projections = r.mergeProjections(projections, raw.Projections, id, id)
	presentations = stableUnion(presentations, raw.Presentations)
	actions = stableUnion(actions, raw.Actions)
	filters = stableUnion(filters, raw.Filters)

	resolved := ResolvedCapability{ID: id, Raw: raw, Ancestors: ancestors, EffectiveProjections: projections, EffectivePresentations: presentations, EffectiveActions: actions, EffectiveFilters: filters}
	r.capabilities[id] = resolved
	return resolved, true
}

func (r *inheritanceResolver) mergeProjections(dst map[string]Projection, incoming map[string]Projection, capabilityID, sourceID string) map[string]Projection {
	if dst == nil {
		dst = map[string]Projection{}
	}
	for name, projection := range incoming {
		if existing, ok := dst[name]; ok {
			if reflect.DeepEqual(existing, projection) {
				continue
			}
			r.findings = append(r.findings, Error("core_model", fmt.Sprintf("capabilities.%s.projections.%s", capabilityID, name), "projection_inheritance_conflict", fmt.Sprintf("capability %q inherits conflicting projection %q from %q", capabilityID, name, sourceID), "Rename one projection or make inherited projection definitions identical. Explicit projection overrides are not supported in the overhaul v1."))
			continue
		}
		dst[name] = projection
	}
	return dst
}

func (r *ResolvedCoreModel) IsArchetypeA(child, ancestor string) bool {
	if child == ancestor {
		return true
	}
	resolved, ok := r.Archetypes[child]
	if !ok {
		return false
	}
	return contains(resolved.Ancestors, ancestor)
}

func (r *ResolvedCoreModel) IsCapabilityA(child, ancestor string) bool {
	if child == ancestor {
		return true
	}
	resolved, ok := r.Capabilities[child]
	if !ok {
		return false
	}
	return contains(resolved.Ancestors, ancestor)
}

func buildArchetypeDescendants(archetypes map[string]ResolvedArchetype) map[string][]string {
	out := map[string][]string{}
	for id, resolved := range archetypes {
		for _, ancestor := range resolved.Ancestors {
			out[ancestor] = stableAppend(out[ancestor], id)
		}
	}
	return out
}

func buildCapabilityDescendants(capabilities map[string]ResolvedCapability) map[string][]string {
	out := map[string][]string{}
	for id, resolved := range capabilities {
		for _, ancestor := range resolved.Ancestors {
			out[ancestor] = stableAppend(out[ancestor], id)
		}
	}
	return out
}

func stableUnion(dst, src []string) []string {
	out := append([]string{}, dst...)
	for _, value := range src {
		out = stableAppend(out, value)
	}
	return out
}

func stableAppend(values []string, value string) []string {
	if value == "" || contains(values, value) {
		return values
	}
	return append(values, value)
}

func firstDuplicate(values []string) string {
	seen := map[string]bool{}
	for _, value := range values {
		if seen[value] {
			return value
		}
		seen[value] = true
	}
	return ""
}
