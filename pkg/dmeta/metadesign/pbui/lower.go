package pbui

import (
	"sort"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
)

// Obligation is the PBUI-layer result of lowering Interaction IR obligations.
//
// It is intentionally explanatory: target planners should preserve the source
// representations/actions and natural-language rationale so generated React
// files and metadata sidecars can explain why a presentation exists.
type Obligation struct {
	ExampleID             string
	DomainTypeID          string
	PresentationTypeID    string
	SourceRuleID          string
	SourceRepresentations []string
	SourceActions         []string
	Description           string
	Rationale             string
	PresenterIntent       string
	RecognizerIntent      string
}

func Lower(obligations []interaction.Obligation, pkg *Package) []Obligation {
	groups := map[string]*obligationGroup{}
	for _, obligation := range obligations {
		key := obligation.ExampleID + "\x00" + obligation.DomainTypeID
		group := groups[key]
		if group == nil {
			group = &obligationGroup{
				exampleID:       obligation.ExampleID,
				domainTypeID:    obligation.DomainTypeID,
				representations: map[string]bool{},
				actions:         map[string]bool{},
			}
			groups[key] = group
		}
		if obligation.Kind == "representation" {
			group.representations[obligation.ID] = true
		}
		if obligation.Kind == "action" {
			group.actions[obligation.ID] = true
		}
	}

	var out []Obligation
	seen := map[string]bool{}
	for _, group := range groups {
		for _, rule := range pkg.LoweringRules.Rules {
			if !matchesRule(rule, group) {
				continue
			}
			for _, presentationTypeID := range rule.Emits.PresentationTypes {
				key := group.exampleID + "\x00" + group.domainTypeID + "\x00" + rule.ID + "\x00" + presentationTypeID
				if seen[key] {
					continue
				}
				seen[key] = true
				out = append(out, Obligation{
					ExampleID:             group.exampleID,
					DomainTypeID:          group.domainTypeID,
					PresentationTypeID:    presentationTypeID,
					SourceRuleID:          rule.ID,
					SourceRepresentations: append([]string{}, rule.When.Representations...),
					SourceActions:         append([]string{}, rule.When.Actions...),
					Description:           rule.Description,
					Rationale:             rule.Rationale,
					PresenterIntent:       rule.PresenterIntent,
					RecognizerIntent:      rule.RecognizerIntent,
				})
			}
		}
	}

	sort.SliceStable(out, func(i, j int) bool {
		a, b := out[i], out[j]
		if a.ExampleID != b.ExampleID {
			return a.ExampleID < b.ExampleID
		}
		if a.DomainTypeID != b.DomainTypeID {
			return a.DomainTypeID < b.DomainTypeID
		}
		if a.PresentationTypeID != b.PresentationTypeID {
			return a.PresentationTypeID < b.PresentationTypeID
		}
		return a.SourceRuleID < b.SourceRuleID
	})
	return out
}

type obligationGroup struct {
	exampleID       string
	domainTypeID    string
	representations map[string]bool
	actions         map[string]bool
}

func matchesRule(rule LoweringRule, group *obligationGroup) bool {
	if len(rule.When.DomainTypes) > 0 && !contains(rule.When.DomainTypes, group.domainTypeID) {
		return false
	}
	for _, representationID := range rule.When.Representations {
		if !group.representations[representationID] {
			return false
		}
	}
	for _, actionID := range rule.When.Actions {
		if !group.actions[actionID] {
			return false
		}
	}
	return true
}

func contains(values []string, value string) bool {
	for _, v := range values {
		if v == value {
			return true
		}
	}
	return false
}
