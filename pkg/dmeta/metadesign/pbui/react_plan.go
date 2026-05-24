package pbui

import (
	"path/filepath"
	"sort"
	"strings"
)

// ReactPlan is the PBUI React target planning result.
//
// It is intentionally inspectable before rendering. The plan records static
// registry files, session/presenter/recognizer support files, presentation
// component files, metadata sidecars, and enough provenance for generated files
// to explain their Semantic IR, Interaction IR, and PBUI lowering origins.
type ReactPlan struct {
	TargetID          string
	MetaDesignSystem  string
	OutputDir         string
	PackageName       string
	ObjectDescriptors []ObjectTypeDescriptor
	ActionDescriptors []ActionDescriptor
	PresentationPlans []PresentationPlan
	Files             []ReactPlannedFile
}

type PresentationPlan struct {
	PresentationTypeID    string
	ComponentName         string
	SourceDomainTypes     []string
	SourceRules           []string
	SourceRepresentations []string
	SourceActions         []string
	Description           string
	Rationale             string
	PresenterIntent       string
	RecognizerIntent      string
	Files                 []ReactPlannedFile
}

type ReactPlannedFile struct {
	Path       string
	Kind       string
	Symbol     string
	Provenance ReactFileProvenance
}

type ReactFileProvenance struct {
	MetaDesignSystem   string
	CodegenTarget      string
	PresentationTypeID string
	ComponentName      string
	Representations    []string
	Actions            []string
	DomainTypes        []string
	SourceRules        []string
	PresenterIntent    string
	RecognizerIntent   string
	LoweringRationale  string
	Passes             []string
}

func BuildReactPlan(pkg *Package, target ReactTargetFile, obligations []Obligation, objectDescriptors []ObjectTypeDescriptor, actionDescriptors []ActionDescriptor, outputDir string) ReactPlan {
	if outputDir == "" {
		outputDir = target.Defaults.OutputDir
	}
	packageName := target.Defaults.PackageName
	plan := ReactPlan{
		TargetID:          target.ID,
		MetaDesignSystem:  target.Provenance.MetaDesignSystem,
		OutputDir:         outputDir,
		PackageName:       packageName,
		ObjectDescriptors: append([]ObjectTypeDescriptor{}, objectDescriptors...),
		ActionDescriptors: append([]ActionDescriptor{}, actionDescriptors...),
	}

	plan.Files = append(plan.Files, planRegistryAndRuntimeFiles(plan, target)...)
	for _, group := range groupPBUIObligations(obligations) {
		presentationPlan := buildPresentationPlan(group, target, outputDir)
		plan.PresentationPlans = append(plan.PresentationPlans, presentationPlan)
		plan.Files = append(plan.Files, presentationPlan.Files...)
	}
	sort.SliceStable(plan.Files, func(i, j int) bool {
		return plan.Files[i].Path < plan.Files[j].Path
	})
	return plan
}

type presentationObligationGroup struct {
	presentationTypeID string
	domainTypes        map[string]bool
	rules              map[string]bool
	representations    map[string]bool
	actions            map[string]bool
	description        string
	rationale          string
	presenterIntent    string
	recognizerIntent   string
}

func groupPBUIObligations(obligations []Obligation) []presentationObligationGroup {
	byPresentation := map[string]*presentationObligationGroup{}
	for _, obligation := range obligations {
		group := byPresentation[obligation.PresentationTypeID]
		if group == nil {
			group = &presentationObligationGroup{
				presentationTypeID: obligation.PresentationTypeID,
				domainTypes:        map[string]bool{},
				rules:              map[string]bool{},
				representations:    map[string]bool{},
				actions:            map[string]bool{},
				description:        obligation.Description,
				rationale:          obligation.Rationale,
				presenterIntent:    obligation.PresenterIntent,
				recognizerIntent:   obligation.RecognizerIntent,
			}
			byPresentation[obligation.PresentationTypeID] = group
		}
		group.domainTypes[obligation.DomainTypeID] = true
		group.rules[obligation.SourceRuleID] = true
		addPlanSet(group.representations, obligation.SourceRepresentations)
		addPlanSet(group.actions, obligation.SourceActions)
	}

	out := make([]presentationObligationGroup, 0, len(byPresentation))
	for _, group := range byPresentation {
		out = append(out, *group)
	}
	sort.SliceStable(out, func(i, j int) bool {
		return out[i].presentationTypeID < out[j].presentationTypeID
	})
	return out
}

func buildPresentationPlan(group presentationObligationGroup, target ReactTargetFile, outputDir string) PresentationPlan {
	componentName := reactComponentNameFromPresentation(group.presentationTypeID)
	plan := PresentationPlan{
		PresentationTypeID:    group.presentationTypeID,
		ComponentName:         componentName,
		SourceDomainTypes:     sortedPlanSet(group.domainTypes),
		SourceRules:           sortedPlanSet(group.rules),
		SourceRepresentations: sortedPlanSet(group.representations),
		SourceActions:         sortedPlanSet(group.actions),
		Description:           group.description,
		Rationale:             group.rationale,
		PresenterIntent:       group.presenterIntent,
		RecognizerIntent:      group.recognizerIntent,
	}
	plan.Files = planPresentationFiles(plan, target, outputDir)
	return plan
}

func planRegistryAndRuntimeFiles(plan ReactPlan, target ReactTargetFile) []ReactPlannedFile {
	baseProvenance := ReactFileProvenance{
		MetaDesignSystem: target.Provenance.MetaDesignSystem,
		CodegenTarget:    target.Provenance.CodegenTarget,
		Passes:           append([]string{}, target.Provenance.SourcePasses...),
	}
	kindToPathSymbol := map[string][2]string{
		"package_json":               {"package.json", plan.PackageName},
		"tsconfig":                   {"tsconfig.json", "tsconfig"},
		"object_type_registry":       {"registries/objectTypes.ts", "objectTypeDescriptors"},
		"action_descriptor_registry": {"registries/actions.ts", "actionDescriptors"},
		"presentation_type_registry": {"registries/presentationTypes.ts", "presentationTypeDescriptors"},
		"session_slice":              {"state/pbuiSessionSlice.ts", "pbuiSessionSlice"},
		"selectors":                  {"state/selectors.ts", "pbuiSelectors"},
		"action_request_builder":     {"actions/actionRequests.ts", "buildPBUIActionRequest"},
		"event_adapter":              {"actions/eventAdapters.ts", "pbuiEventAdapters"},
		"command_parser":             {"commands/commandParser.ts", "parsePBUICommand"},
		"README":                     {"README.md", plan.PackageName},
	}
	var files []ReactPlannedFile
	for _, kind := range target.FileKinds {
		pathSymbol, ok := kindToPathSymbol[kind]
		if !ok {
			continue
		}
		files = append(files, ReactPlannedFile{
			Path:       filepath.Join(plan.OutputDir, pathSymbol[0]),
			Kind:       kind,
			Symbol:     pathSymbol[1],
			Provenance: baseProvenance,
		})
	}
	return files
}

func planPresentationFiles(plan PresentationPlan, target ReactTargetFile, outputDir string) []ReactPlannedFile {
	base := filepath.Join(outputDir, "presentations", plan.ComponentName)
	provenance := ReactFileProvenance{
		MetaDesignSystem:   target.Provenance.MetaDesignSystem,
		CodegenTarget:      target.Provenance.CodegenTarget,
		PresentationTypeID: plan.PresentationTypeID,
		ComponentName:      plan.ComponentName,
		Representations:    append([]string{}, plan.SourceRepresentations...),
		Actions:            append([]string{}, plan.SourceActions...),
		DomainTypes:        append([]string{}, plan.SourceDomainTypes...),
		SourceRules:        append([]string{}, plan.SourceRules...),
		PresenterIntent:    plan.PresenterIntent,
		RecognizerIntent:   plan.RecognizerIntent,
		LoweringRationale:  plan.Rationale,
		Passes:             append([]string{}, target.Provenance.SourcePasses...),
	}
	kindToPathSymbol := map[string][2]string{
		"presenter_hook": {plan.ComponentName + ".hook.ts", "use" + plan.ComponentName + "Presentation"},
		"component":      {plan.ComponentName + ".tsx", plan.ComponentName},
		"metadata":       {plan.ComponentName + ".metadata.json", plan.ComponentName + "Metadata"},
		"stories":        {plan.ComponentName + ".stories.tsx", plan.ComponentName + "Stories"},
	}
	var files []ReactPlannedFile
	for _, kind := range target.FileKinds {
		pathSymbol, ok := kindToPathSymbol[kind]
		if !ok {
			continue
		}
		files = append(files, ReactPlannedFile{Path: filepath.Join(base, pathSymbol[0]), Kind: kind, Symbol: pathSymbol[1], Provenance: provenance})
	}
	files = append(files, ReactPlannedFile{Path: filepath.Join(base, "index.ts"), Kind: "barrel", Symbol: plan.ComponentName, Provenance: provenance})
	return files
}

func reactComponentNameFromPresentation(presentationTypeID string) string {
	parts := strings.FieldsFunc(presentationTypeID, func(r rune) bool {
		return r == '.' || r == '_' || r == '-'
	})
	for i, part := range parts {
		if part == "" {
			continue
		}
		parts[i] = strings.ToUpper(part[:1]) + part[1:]
	}
	return strings.Join(parts, "")
}

func addPlanSet(set map[string]bool, values []string) {
	for _, value := range values {
		if value != "" {
			set[value] = true
		}
	}
}

func sortedPlanSet(set map[string]bool) []string {
	values := make([]string, 0, len(set))
	for value := range set {
		values = append(values, value)
	}
	sort.Strings(values)
	return values
}
