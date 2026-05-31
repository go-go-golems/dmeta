package validator

import "testing"

func TestValidateWidgetReflectionFields(t *testing.T) {
	pkg := &Package{CoreModel: CoreModelFile{
		Archetypes: map[string]Archetype{
			RootArchetypeID: {Abstract: true, Extends: []string{}},
			"WorkItem":      {Extends: []string{RootArchetypeID}},
		},
		Capabilities: map[string]Capability{
			RootCapabilityID: {Abstract: true, Extends: []string{}},
			"stateful": {
				Extends: []string{RootCapabilityID},
				Projections: map[string]Projection{
					"state": {Type: "string", Required: true},
				},
			},
			"available": {
				Extends: []string{"stateful"},
				Projections: map[string]Projection{
					"availability_state": {Type: "string", Required: true},
				},
			},
		},
	}}
	resolved, inheritanceFindings := ResolveCoreInheritance(pkg.CoreModel)
	if HasErrors(inheritanceFindings) {
		t.Fatalf("unexpected inheritance errors: %#v", inheritanceFindings)
	}
	pkg.Widgets.Widgets = []Widget{
		{
			ID:       "ok",
			Name:     "OKWidget",
			Consumes: Consumes{Capabilities: []string{"available"}, Archetypes: []string{"WorkItem"}, Representations: []string{"status_badge"}},
			SemanticContext: WidgetSemanticContext{
				Capabilities:    []string{"available"},
				Archetypes:      []string{"WorkItem"},
				Representations: []string{"status_badge"},
			},
			ProjectionHints: WidgetProjectionHints{
				Recommended: []string{"available.availability_state", "available.state"},
				Optional:    []string{"stateful.state"},
			},
			Outputs: map[string]string{"metadata": "ok.metadata.ts"},
		},
		{
			ID:              "bad-context",
			Name:            "BadContextWidget",
			SemanticContext: WidgetSemanticContext{Capabilities: []string{"missing_cap"}, Archetypes: []string{"MissingArch"}, Representations: []string{"missing_representation"}},
			Outputs:         map[string]string{"metadata": "bad.metadata.ts"},
		},
		{
			ID:      "bad-required-hint",
			Name:    "BadRequiredHintWidget",
			Outputs: map[string]string{"metadata": "required.metadata.ts"},
			ProjectionHints: WidgetProjectionHints{
				Required: []string{"available.missing"},
			},
		},
		{
			ID:      "warn-bad-hint",
			Name:    "WarnBadHintWidget",
			Outputs: map[string]string{"metadata": "warn.metadata.ts"},
			ProjectionHints: WidgetProjectionHints{
				Recommended: []string{"available.missing"},
			},
		},
	}

	findings := validateWidgets(pkg, resolved)
	assertFinding(t, findings, "unknown_semantic_context_capability", SeverityError)
	assertFinding(t, findings, "unknown_semantic_context_archetype", SeverityError)
	assertFinding(t, findings, "unknown_required_projection_hint", SeverityWarning)
	assertFinding(t, findings, "unknown_recommended_projection_hint", SeverityWarning)
}

func assertFinding(t *testing.T, findings []Finding, code, severity string) {
	t.Helper()
	for _, finding := range findings {
		if finding.Code == code && finding.Severity == severity {
			return
		}
	}
	t.Fatalf("missing %s finding with severity %s in %#v", code, severity, findings)
}
