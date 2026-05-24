package interaction

import (
	"sort"

	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

type DomainFacts struct {
	ExampleID    string
	DomainTypeID string
	Archetypes   map[string]bool
	Capabilities map[string]bool
}

type Obligation struct {
	ExampleID     string
	DomainTypeID  string
	Kind          string
	ID            string
	SourceRuleID  string
	SourceSummary string
}

func ElaborateInteractions(core validator.CoreModelFile, resolved *validator.ResolvedCoreModel, pkg *Package) ([]Obligation, []validator.Finding) {
	var obligations []Obligation
	var findings []validator.Finding
	seen := map[string]bool{}

	for exampleID, example := range core.DomainExamples {
		for domainTypeID, domainType := range example.DomainTypes {
			facts := BuildDomainFacts(exampleID, domainTypeID, domainType, resolved)
			for _, rule := range pkg.RulesFile.Rules {
				if !SelectorMatches(rule.When, facts) {
					continue
				}
				for _, representationID := range rule.Emits.Representations {
					representation, ok := pkg.Representations.Representations[representationID]
					if !ok || representation.Abstract {
						continue
					}
					key := exampleID + "\x00" + domainTypeID + "\x00representation\x00" + representationID + "\x00" + rule.ID
					if seen[key] {
						continue
					}
					seen[key] = true
					obligations = append(obligations, Obligation{ExampleID: exampleID, DomainTypeID: domainTypeID, Kind: "representation", ID: representationID, SourceRuleID: rule.ID, SourceSummary: representation.Intent})
				}
				for _, actionID := range rule.Emits.Actions {
					action, ok := pkg.ActionsFile.Actions[actionID]
					if !ok || action.Abstract {
						continue
					}
					key := exampleID + "\x00" + domainTypeID + "\x00action\x00" + actionID + "\x00" + rule.ID
					if seen[key] {
						continue
					}
					seen[key] = true
					obligations = append(obligations, Obligation{ExampleID: exampleID, DomainTypeID: domainTypeID, Kind: "action", ID: actionID, SourceRuleID: rule.ID, SourceSummary: action.Intent})
				}
			}
		}
	}

	sort.SliceStable(obligations, func(i, j int) bool {
		a, b := obligations[i], obligations[j]
		if a.ExampleID != b.ExampleID {
			return a.ExampleID < b.ExampleID
		}
		if a.DomainTypeID != b.DomainTypeID {
			return a.DomainTypeID < b.DomainTypeID
		}
		if a.Kind != b.Kind {
			return a.Kind < b.Kind
		}
		if a.ID != b.ID {
			return a.ID < b.ID
		}
		return a.SourceRuleID < b.SourceRuleID
	})

	return obligations, findings
}

func BuildDomainFacts(exampleID string, domainTypeID string, domainType validator.DomainType, resolved *validator.ResolvedCoreModel) DomainFacts {
	facts := DomainFacts{ExampleID: exampleID, DomainTypeID: domainTypeID, Archetypes: map[string]bool{}, Capabilities: map[string]bool{}}
	for _, archetypeID := range domainType.Archetypes {
		facts.Archetypes[archetypeID] = true
		if resolved != nil {
			if resolvedArchetype, ok := resolved.Archetypes[archetypeID]; ok {
				for _, ancestor := range resolvedArchetype.Ancestors {
					facts.Archetypes[ancestor] = true
				}
				for _, capabilityID := range resolvedArchetype.EffectiveDefaultCapabilities {
					addCapabilityFact(facts.Capabilities, capabilityID, resolved)
				}
			}
		}
	}
	for capabilityID := range domainType.Capabilities {
		addCapabilityFact(facts.Capabilities, capabilityID, resolved)
	}
	return facts
}

func addCapabilityFact(capabilities map[string]bool, capabilityID string, resolved *validator.ResolvedCoreModel) {
	capabilities[capabilityID] = true
	if resolved == nil {
		return
	}
	if resolvedCapability, ok := resolved.Capabilities[capabilityID]; ok {
		for _, ancestor := range resolvedCapability.Ancestors {
			capabilities[ancestor] = true
		}
	}
}

func SelectorMatches(selector SemanticSelector, facts DomainFacts) bool {
	if len(selector.DomainTypes) > 0 && !contains(selector.DomainTypes, facts.DomainTypeID) {
		return false
	}
	for _, archetypeID := range selector.AllArchetypes {
		if !facts.Archetypes[archetypeID] {
			return false
		}
	}
	if len(selector.AnyArchetypes) > 0 && !intersects(selector.AnyArchetypes, facts.Archetypes) {
		return false
	}
	for _, capabilityID := range selector.AllCapabilities {
		if !facts.Capabilities[capabilityID] {
			return false
		}
	}
	if len(selector.AnyCapabilities) > 0 && !intersects(selector.AnyCapabilities, facts.Capabilities) {
		return false
	}
	for _, excluded := range selector.Excludes {
		if facts.Archetypes[excluded] || facts.Capabilities[excluded] || facts.DomainTypeID == excluded {
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

func intersects(values []string, set map[string]bool) bool {
	for _, value := range values {
		if set[value] {
			return true
		}
	}
	return false
}
