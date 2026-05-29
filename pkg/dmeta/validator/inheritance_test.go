package validator

import "testing"

func TestResolveArchetypeInheritance(t *testing.T) {
	core := CoreModelFile{
		Archetypes: map[string]Archetype{
			RootArchetypeID: {Abstract: true},
			"Entity":        {Extends: []string{RootArchetypeID}, Abstract: true, DefaultCapabilities: []string{"identifiable"}},
			"WorkItem":      {Extends: []string{"Entity"}, DefaultCapabilities: []string{"stateful"}},
			"Order":         {Extends: []string{"WorkItem"}, DefaultCapabilities: []string{"priced"}},
		},
		Capabilities: map[string]Capability{
			RootCapabilityID: {Abstract: true},
		},
	}

	resolved, findings := ResolveCoreInheritance(core)
	assertNoErrorFindings(t, findings)

	order := resolved.Archetypes["Order"]
	assertStringSlice(t, order.Ancestors, []string{RootArchetypeID, "Entity", "WorkItem"})
	assertStringSlice(t, order.EffectiveDefaultCapabilities, []string{"identifiable", "stateful", "priced"})
	if !resolved.IsArchetypeA("Order", "Entity") {
		t.Fatalf("expected Order to be an Entity")
	}
}

func TestResolveArchetypeMultipleInheritanceStableOrder(t *testing.T) {
	core := CoreModelFile{
		Archetypes: map[string]Archetype{
			RootArchetypeID:    {Abstract: true},
			"Entity":           {Extends: []string{RootArchetypeID}, DefaultCapabilities: []string{"identifiable"}},
			"WorkItem":         {Extends: []string{"Entity"}, DefaultCapabilities: []string{"stateful"}},
			"Composition":      {Extends: []string{"Entity"}, DefaultCapabilities: []string{"composable"}},
			"OrderComposition": {Extends: []string{"Composition"}, DefaultCapabilities: []string{"configurable"}},
			"OrderItem":        {Extends: []string{"WorkItem", "OrderComposition"}, DefaultCapabilities: []string{"priced"}},
		},
		Capabilities: map[string]Capability{RootCapabilityID: {Abstract: true}},
	}

	resolved, findings := ResolveCoreInheritance(core)
	assertNoErrorFindings(t, findings)

	orderItem := resolved.Archetypes["OrderItem"]
	assertStringSlice(t, orderItem.Ancestors, []string{RootArchetypeID, "Entity", "WorkItem", "Composition", "OrderComposition"})
	assertStringSlice(t, orderItem.EffectiveDefaultCapabilities, []string{"identifiable", "stateful", "composable", "configurable", "priced"})
}

func TestResolveCapabilityInheritanceMergesProjections(t *testing.T) {
	core := CoreModelFile{
		Archetypes: map[string]Archetype{RootArchetypeID: {Abstract: true}},
		Capabilities: map[string]Capability{
			RootCapabilityID: {Abstract: true},
			"substitutable": {
				Extends: []string{RootCapabilityID},
				Projections: map[string]Projection{
					"replaces":               {Type: "string", Required: true},
					"replacement_candidates": {Type: "list", Required: true},
				},
			},
			"role_preserving_substitutable": {
				Extends: []string{"substitutable"},
				Projections: map[string]Projection{
					"role_preservation": {Type: "list", Required: true},
				},
			},
		},
	}

	resolved, findings := ResolveCoreInheritance(core)
	assertNoErrorFindings(t, findings)

	cap := resolved.Capabilities["role_preserving_substitutable"]
	assertStringSlice(t, cap.Ancestors, []string{RootCapabilityID, "substitutable"})
	for _, projection := range []string{"replaces", "replacement_candidates", "role_preservation"} {
		if _, ok := cap.EffectiveProjections[projection]; !ok {
			t.Fatalf("expected projection %q", projection)
		}
	}
	if !resolved.IsCapabilityA("role_preserving_substitutable", "substitutable") {
		t.Fatalf("expected role_preserving_substitutable to be substitutable")
	}
}

func TestResolveInheritanceReportsCyclesAndMissingExtends(t *testing.T) {
	core := CoreModelFile{
		Archetypes: map[string]Archetype{
			RootArchetypeID: {Abstract: true},
			"A":             {Extends: []string{"B"}},
			"B":             {Extends: []string{"A"}},
			"Flat":          {},
		},
		Capabilities: map[string]Capability{
			RootCapabilityID: {Abstract: true},
			"NoParent":       {},
		},
	}

	_, findings := ResolveCoreInheritance(core)
	assertHasFinding(t, findings, "archetype_inheritance_cycle")
	assertHasFinding(t, findings, "missing_archetype_extends")
	assertHasFinding(t, findings, "missing_capability_extends")
}

func TestResolveCapabilityProjectionConflict(t *testing.T) {
	core := CoreModelFile{
		Archetypes: map[string]Archetype{RootArchetypeID: {Abstract: true}},
		Capabilities: map[string]Capability{
			RootCapabilityID: {Abstract: true},
			"A": {Extends: []string{RootCapabilityID}, Projections: map[string]Projection{
				"value": {Type: "string", Required: true},
			}},
			"B": {Extends: []string{RootCapabilityID}, Projections: map[string]Projection{
				"value": {Type: "number", Required: true},
			}},
			"C": {Extends: []string{"A", "B"}},
		},
	}

	_, findings := ResolveCoreInheritance(core)
	assertHasFinding(t, findings, "projection_inheritance_conflict")
}

func assertNoErrorFindings(t *testing.T, findings []Finding) {
	t.Helper()
	for _, finding := range findings {
		if finding.Severity == SeverityError {
			t.Fatalf("unexpected error finding: %+v", finding)
		}
	}
}

func assertHasFinding(t *testing.T, findings []Finding, code string) {
	t.Helper()
	for _, finding := range findings {
		if finding.Code == code {
			return
		}
	}
	t.Fatalf("expected finding %q, got %+v", code, findings)
}

func assertStringSlice(t *testing.T, got, want []string) {
	t.Helper()
	if len(got) != len(want) {
		t.Fatalf("length mismatch: got %#v want %#v", got, want)
	}
	for i := range got {
		if got[i] != want[i] {
			t.Fatalf("slice mismatch: got %#v want %#v", got, want)
		}
	}
}
