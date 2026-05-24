package web

import (
	"sort"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
)

func Lower(obligations []interaction.Obligation, pkg *Package) []Obligation {
	groups := map[string]*obligationGroup{}
	for _, obligation := range obligations {
		key := obligation.ExampleID + "\x00" + obligation.DomainTypeID
		group := groups[key]
		if group == nil {
			group = &obligationGroup{
				exampleID:        obligation.ExampleID,
				domainTypeID:     obligation.DomainTypeID,
				representations:  map[string]bool{},
				actions:          map[string]bool{},
				sourceRuleByKind: map[string]map[string]string{"representation": {}, "action": {}},
			}
			groups[key] = group
		}
		if obligation.Kind == "representation" {
			group.representations[obligation.ID] = true
			group.sourceRuleByKind["representation"][obligation.ID] = obligation.SourceRuleID
		}
		if obligation.Kind == "action" {
			group.actions[obligation.ID] = true
			group.sourceRuleByKind["action"][obligation.ID] = obligation.SourceRuleID
		}
	}

	var out []Obligation
	seen := map[string]bool{}
	for _, group := range groups {
		for _, rule := range pkg.LoweringRules.Rules {
			if !matchesRule(rule, group) {
				continue
			}
			for _, widgetID := range rule.Emits.WidgetTemplates {
				key := group.exampleID + "\x00" + group.domainTypeID + "\x00" + rule.ID + "\x00" + widgetID
				if seen[key] {
					continue
				}
				seen[key] = true
				out = append(out, Obligation{
					ExampleID:             group.exampleID,
					DomainTypeID:          group.domainTypeID,
					WidgetTemplateID:      widgetID,
					Slots:                 append([]string{}, rule.Emits.Slots...),
					VisualStates:          append([]string{}, rule.Emits.VisualStates...),
					EventBindings:         append([]string{}, rule.Emits.EventBindings...),
					SourceRuleID:          rule.ID,
					SourceRepresentations: append([]string{}, rule.When.Representations...),
					SourceActions:         append([]string{}, rule.When.Actions...),
					Description:           rule.Description,
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
		if a.WidgetTemplateID != b.WidgetTemplateID {
			return a.WidgetTemplateID < b.WidgetTemplateID
		}
		return a.SourceRuleID < b.SourceRuleID
	})
	return out
}

type obligationGroup struct {
	exampleID        string
	domainTypeID     string
	representations  map[string]bool
	actions          map[string]bool
	sourceRuleByKind map[string]map[string]string
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
