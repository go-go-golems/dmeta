package interaction

import (
	"fmt"
	"strings"

	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
)

func ValidatePackage(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	findings = append(findings, validateActionRoots(pkg)...)
	findings = append(findings, validateRepresentationRoots(pkg)...)
	findings = append(findings, validateActionGraph(pkg)...)
	findings = append(findings, validateRepresentationGraph(pkg)...)
	findings = append(findings, validateRepresentationActionReferences(pkg)...)
	findings = append(findings, validateElaborationRules(pkg)...)
	return findings
}

func validateActionRoots(pkg *Package) []validator.Finding {
	action, ok := pkg.ActionsFile.Actions[RootActionID]
	if !ok {
		return []validator.Finding{validator.Error("interactions", "actions."+RootActionID, "missing_root_action", "interaction actions are missing abstract root Action", "Add actions.Action with abstract: true and extends: [].")}
	}
	var findings []validator.Finding
	if len(action.Extends) != 0 {
		findings = append(findings, validator.Error("interactions", "actions."+RootActionID+".extends", "root_action_extends", "root action Action must not extend another action", "Set extends: []."))
	}
	if !action.Abstract {
		findings = append(findings, validator.Error("interactions", "actions."+RootActionID+".abstract", "root_action_not_abstract", "root action Action must be abstract", "Set abstract: true."))
	}
	return findings
}

func validateRepresentationRoots(pkg *Package) []validator.Finding {
	representation, ok := pkg.Representations.Representations[RootRepresentationID]
	if !ok {
		return []validator.Finding{validator.Error("interactions", "representations."+RootRepresentationID, "missing_root_representation", "interaction representations are missing abstract root Representation", "Add representations.Representation with abstract: true and extends: [].")}
	}
	var findings []validator.Finding
	if len(representation.Extends) != 0 {
		findings = append(findings, validator.Error("interactions", "representations."+RootRepresentationID+".extends", "root_representation_extends", "root representation Representation must not extend another representation", "Set extends: []."))
	}
	if !representation.Abstract {
		findings = append(findings, validator.Error("interactions", "representations."+RootRepresentationID+".abstract", "root_representation_not_abstract", "root representation Representation must be abstract", "Set abstract: true."))
	}
	return findings
}

func validateActionGraph(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	for id, action := range pkg.ActionsFile.Actions {
		if id != RootActionID && len(action.Extends) == 0 {
			findings = append(findings, validator.Error("interactions", "actions."+id+".extends", "missing_action_extends", fmt.Sprintf("action %q has no extends list", id), "Every non-root action must declare at least one parent."))
		}
		for _, parent := range action.Extends {
			if _, ok := pkg.ActionsFile.Actions[parent]; !ok {
				findings = append(findings, validator.Error("interactions", "actions."+id+".extends", "unknown_action_parent", fmt.Sprintf("action %q extends unknown action %q", id, parent), "Define the parent action or fix extends."))
			}
		}
	}
	findings = append(findings, detectActionCycles(pkg)...)
	return findings
}

func validateRepresentationGraph(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	for id, representation := range pkg.Representations.Representations {
		if id != RootRepresentationID && len(representation.Extends) == 0 {
			findings = append(findings, validator.Error("interactions", "representations."+id+".extends", "missing_representation_extends", fmt.Sprintf("representation %q has no extends list", id), "Every non-root representation must declare at least one parent."))
		}
		for _, parent := range representation.Extends {
			if _, ok := pkg.Representations.Representations[parent]; !ok {
				findings = append(findings, validator.Error("interactions", "representations."+id+".extends", "unknown_representation_parent", fmt.Sprintf("representation %q extends unknown representation %q", id, parent), "Define the parent representation or fix extends."))
			}
		}
	}
	findings = append(findings, detectRepresentationCycles(pkg)...)
	return findings
}

func validateRepresentationActionReferences(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	for id, representation := range pkg.Representations.Representations {
		for _, actionID := range representation.SupportsActions {
			action, ok := pkg.ActionsFile.Actions[actionID]
			if !ok {
				findings = append(findings, validator.Error("interactions", "representations."+id+".supports_actions", "unknown_supported_action", fmt.Sprintf("representation %q supports unknown action %q", id, actionID), "Define the action or remove the reference."))
				continue
			}
			if action.Abstract {
				findings = append(findings, validator.Error("interactions", "representations."+id+".supports_actions", "abstract_supported_action", fmt.Sprintf("representation %q supports abstract action %q", id, actionID), "Reference a concrete action descendant."))
			}
		}
	}
	return findings
}

func validateElaborationRules(pkg *Package) []validator.Finding {
	var findings []validator.Finding
	seen := map[string]bool{}
	for i, rule := range pkg.RulesFile.Rules {
		path := fmt.Sprintf("elaboration_rules[%d]", i)
		if rule.ID == "" {
			findings = append(findings, validator.Error("interactions", path+".id", "missing_rule_id", "elaboration rule has no id", "Add a stable rule id."))
		} else if seen[rule.ID] {
			findings = append(findings, validator.Error("interactions", path+".id", "duplicate_rule_id", fmt.Sprintf("duplicate elaboration rule id %q", rule.ID), "Use unique rule ids."))
		} else {
			seen[rule.ID] = true
		}
		for _, representationID := range rule.Emits.Representations {
			representation, ok := pkg.Representations.Representations[representationID]
			if !ok {
				findings = append(findings, validator.Error("interactions", path+".emits.representations", "unknown_emitted_representation", fmt.Sprintf("rule %q emits unknown representation %q", rule.ID, representationID), "Define the representation or fix the rule."))
				continue
			}
			if representation.Abstract {
				findings = append(findings, validator.Error("interactions", path+".emits.representations", "abstract_emitted_representation", fmt.Sprintf("rule %q emits abstract representation %q", rule.ID, representationID), "Emit a concrete representation descendant."))
			}
		}
		for _, actionID := range rule.Emits.Actions {
			action, ok := pkg.ActionsFile.Actions[actionID]
			if !ok {
				findings = append(findings, validator.Error("interactions", path+".emits.actions", "unknown_emitted_action", fmt.Sprintf("rule %q emits unknown action %q", rule.ID, actionID), "Define the action or fix the rule."))
				continue
			}
			if action.Abstract {
				findings = append(findings, validator.Error("interactions", path+".emits.actions", "abstract_emitted_action", fmt.Sprintf("rule %q emits abstract action %q", rule.ID, actionID), "Emit a concrete action descendant."))
			}
		}
	}
	return findings
}

func detectActionCycles(pkg *Package) []validator.Finding {
	visiting := map[string]bool{}
	visited := map[string]bool{}
	var findings []validator.Finding
	var visit func(id string, stack []string)
	visit = func(id string, stack []string) {
		if visited[id] {
			return
		}
		if visiting[id] {
			cycle := append(stack, id)
			findings = append(findings, validator.Error("interactions", "actions."+id+".extends", "action_inheritance_cycle", "action inheritance cycle: "+strings.Join(cycle, " -> "), "Remove or reorder extends entries so the action graph is acyclic."))
			return
		}
		visiting[id] = true
		for _, parent := range pkg.ActionsFile.Actions[id].Extends {
			if _, ok := pkg.ActionsFile.Actions[parent]; ok {
				visit(parent, append(stack, id))
			}
		}
		delete(visiting, id)
		visited[id] = true
	}
	for id := range pkg.ActionsFile.Actions {
		visit(id, nil)
	}
	return findings
}

func detectRepresentationCycles(pkg *Package) []validator.Finding {
	visiting := map[string]bool{}
	visited := map[string]bool{}
	var findings []validator.Finding
	var visit func(id string, stack []string)
	visit = func(id string, stack []string) {
		if visited[id] {
			return
		}
		if visiting[id] {
			cycle := append(stack, id)
			findings = append(findings, validator.Error("interactions", "representations."+id+".extends", "representation_inheritance_cycle", "representation inheritance cycle: "+strings.Join(cycle, " -> "), "Remove or reorder extends entries so the representation graph is acyclic."))
			return
		}
		visiting[id] = true
		for _, parent := range pkg.Representations.Representations[id].Extends {
			if _, ok := pkg.Representations.Representations[parent]; ok {
				visit(parent, append(stack, id))
			}
		}
		delete(visiting, id)
		visited[id] = true
	}
	for id := range pkg.Representations.Representations {
		visit(id, nil)
	}
	return findings
}
