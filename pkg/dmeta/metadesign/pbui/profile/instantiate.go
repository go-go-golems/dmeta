package profile

import (
	"sort"
	"strings"

	pbuimds "github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui"
)

// ConcretePresentationPlan is the target-neutral result of applying a concrete
// PBUI presentation-system profile to abstract PBUI obligations.
//
// It does not plan React files yet. Instead, it answers the presentation-system
// questions that must be resolved first: which concrete views can host each
// presentation type, which shell surface should contain it, which renderer
// component realizes it, and which style/runtime profile governs the result.
type ConcretePresentationPlan struct {
	ProfileID      string
	ProfileName    string
	StyleProfileID string
	ReactTargetID  string
	RuntimeStates  []string
	Views          []ConcreteViewPlan
}

type ConcreteViewPlan struct {
	ID               string
	ModeLabel        string
	SurfaceID        string
	SurfaceComponent string
	Summary          string
	Presentations    []ConcretePresentationInstance
}

type ConcretePresentationInstance struct {
	ViewID                string
	ModeLabel             string
	SurfaceID             string
	SurfaceComponent      string
	PresentationTypeID    string
	Component             string
	DomainTypes           []string
	SourceRules           []string
	SourceRepresentations []string
	SourceActions         []string
	PresenterIntent       string
	RecognizerIntent      string
	StyleProfileID        string
}

func InstantiateProfile(pkg *Package, obligations []pbuimds.Obligation) ConcretePresentationPlan {
	plan := ConcretePresentationPlan{
		ProfileID:      pkg.Meta.ID,
		ProfileName:    pkg.Meta.Name,
		StyleProfileID: pkg.Style.ID,
		ReactTargetID:  pkg.ReactAppTarget.ID,
		RuntimeStates:  append([]string{}, pkg.ReactAppTarget.RuntimeContract.InteractionStates...),
	}

	viewIDs := make([]string, 0, len(pkg.ViewModels.Views))
	for id := range pkg.ViewModels.Views {
		viewIDs = append(viewIDs, id)
	}
	sort.Strings(viewIDs)

	for _, viewID := range viewIDs {
		view := pkg.ViewModels.Views[viewID]
		viewPlan := ConcreteViewPlan{
			ID:               viewID,
			ModeLabel:        view.ModeLabel,
			SurfaceID:        "view",
			SurfaceComponent: surfaceComponent(pkg, "view"),
			Summary:          view.Summary,
		}

		groups := groupConcreteObligationsForView(pkg, view, viewID, obligations)
		for _, group := range groups {
			binding := pkg.PresentationBindings.Bindings[group.presentationTypeID]
			surfaceID := resolveSurfaceID(pkg, binding)
			viewPlan.Presentations = append(viewPlan.Presentations, ConcretePresentationInstance{
				ViewID:                viewID,
				ModeLabel:             view.ModeLabel,
				SurfaceID:             surfaceID,
				SurfaceComponent:      surfaceComponent(pkg, surfaceID),
				PresentationTypeID:    group.presentationTypeID,
				Component:             binding.Component,
				DomainTypes:           sortedStringSet(group.domainTypes),
				SourceRules:           sortedStringSet(group.rules),
				SourceRepresentations: sortedStringSet(group.representations),
				SourceActions:         sortedStringSet(group.actions),
				PresenterIntent:       joinIntent(view.PresenterIntent, binding.Intent, group.presenterIntent),
				RecognizerIntent:      joinIntent(view.RecognizerIntent, binding.Intent, group.recognizerIntent),
				StyleProfileID:        pkg.Style.ID,
			})
		}
		plan.Views = append(plan.Views, viewPlan)
	}
	return plan
}

type concreteObligationGroup struct {
	presentationTypeID string
	domainTypes        map[string]bool
	rules              map[string]bool
	representations    map[string]bool
	actions            map[string]bool
	presenterIntent    string
	recognizerIntent   string
}

func groupConcreteObligationsForView(pkg *Package, view View, viewID string, obligations []pbuimds.Obligation) []concreteObligationGroup {
	byPresentation := map[string]*concreteObligationGroup{}
	for _, obligation := range obligations {
		if !contains(view.PrimaryPresentations, obligation.PresentationTypeID) {
			continue
		}
		if _, ok := pkg.PresentationBindings.Bindings[obligation.PresentationTypeID]; !ok {
			continue
		}
		group := byPresentation[obligation.PresentationTypeID]
		if group == nil {
			group = &concreteObligationGroup{
				presentationTypeID: obligation.PresentationTypeID,
				domainTypes:        map[string]bool{},
				rules:              map[string]bool{},
				representations:    map[string]bool{},
				actions:            map[string]bool{},
				presenterIntent:    obligation.PresenterIntent,
				recognizerIntent:   obligation.RecognizerIntent,
			}
			byPresentation[obligation.PresentationTypeID] = group
		}
		addString(group.domainTypes, obligation.DomainTypeID)
		addString(group.rules, obligation.SourceRuleID)
		addStrings(group.representations, obligation.SourceRepresentations)
		addStrings(group.actions, obligation.SourceActions)
	}

	out := make([]concreteObligationGroup, 0, len(byPresentation))
	for _, group := range byPresentation {
		out = append(out, *group)
	}
	sort.SliceStable(out, func(i, j int) bool {
		leftRank := presentationRank(view.PrimaryPresentations, out[i].presentationTypeID)
		rightRank := presentationRank(view.PrimaryPresentations, out[j].presentationTypeID)
		if leftRank != rightRank {
			return leftRank < rightRank
		}
		return out[i].presentationTypeID < out[j].presentationTypeID
	})
	_ = viewID
	return out
}

func resolveSurfaceID(pkg *Package, binding PresentationBinding) string {
	preferred := binding.Placement["preferred_surface"]
	switch preferred {
	case "", "active_view", "tracker_view", "action_bar":
		return "view"
	case "command_line", "command_line_action_result":
		return "command_line"
	}
	if _, ok := pkg.Surfaces.Surfaces[preferred]; ok {
		return preferred
	}
	return "view"
}

func surfaceComponent(pkg *Package, surfaceID string) string {
	if surface, ok := pkg.Surfaces.Surfaces[surfaceID]; ok {
		return surface.Component
	}
	return ""
}

func presentationRank(values []string, value string) int {
	for i, v := range values {
		if v == value {
			return i
		}
	}
	return len(values)
}

func joinIntent(parts ...string) string {
	out := []string{}
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part != "" {
			out = append(out, part)
		}
	}
	return strings.Join(out, "\n\n")
}

func addString(set map[string]bool, value string) {
	if value != "" {
		set[value] = true
	}
}

func addStrings(set map[string]bool, values []string) {
	for _, value := range values {
		addString(set, value)
	}
}

func sortedStringSet(set map[string]bool) []string {
	values := make([]string, 0, len(set))
	for value := range set {
		values = append(values, value)
	}
	sort.Strings(values)
	return values
}
