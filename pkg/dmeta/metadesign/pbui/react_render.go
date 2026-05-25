package pbui

import (
	"bytes"
	"encoding/json"
	"fmt"
	"path/filepath"
	"strings"

	genmeta "github.com/go-go-golems/dmeta/pkg/dmeta/generator/metadata"
)

type ReactRenderedFile struct {
	Path    string
	Kind    string
	Symbol  string
	Content string
}

func RenderReactPlan(plan ReactPlan) ([]ReactRenderedFile, error) {
	presentationByComponent := map[string]PresentationPlan{}
	for _, presentationPlan := range plan.PresentationPlans {
		presentationByComponent[presentationPlan.ComponentName] = presentationPlan
	}

	var files []ReactRenderedFile
	for _, planned := range plan.Files {
		content, err := renderReactFile(plan, presentationByComponent, planned)
		if err != nil {
			return nil, err
		}
		files = append(files, ReactRenderedFile{Path: planned.Path, Kind: planned.Kind, Symbol: planned.Symbol, Content: content})
	}
	return files, nil
}

func renderReactFile(plan ReactPlan, presentationByComponent map[string]PresentationPlan, planned ReactPlannedFile) (string, error) {
	switch planned.Kind {
	case "package_json":
		return renderPackageJSON(plan), nil
	case "tsconfig":
		return renderTSConfig(), nil
	case "object_type_registry":
		return renderConstJSON(plan, planned, "objectTypeDescriptors", plan.ObjectDescriptors)
	case "action_descriptor_registry":
		return renderConstJSON(plan, planned, "actionDescriptors", plan.ActionDescriptors)
	case "presentation_type_registry":
		return renderConstJSON(plan, planned, "presentationTypeDescriptors", plan.PresentationPlans)
	case "session_slice":
		return renderSessionSlice(plan, planned)
	case "selectors":
		return renderSelectors(plan, planned)
	case "action_request_builder":
		return renderActionRequests(plan, planned)
	case "event_adapter":
		return renderEventAdapters(plan, planned)
	case "command_parser":
		return renderCommandParser(plan, planned)
	case "README":
		return renderPackageReadme(plan), nil
	case "presenter_hook":
		presentationPlan := presentationByComponent[planned.Provenance.ComponentName]
		return renderPresenterHook(plan, planned, presentationPlan)
	case "component":
		presentationPlan := presentationByComponent[planned.Provenance.ComponentName]
		return renderComponent(plan, planned, presentationPlan)
	case "metadata":
		return renderMetadata(plan, planned)
	case "stories":
		presentationPlan := presentationByComponent[planned.Provenance.ComponentName]
		return renderStories(plan, planned, presentationPlan)
	case "barrel":
		return renderBarrel(plan, planned)
	default:
		return fmt.Sprintf("// Planned PBUI React file kind %q for symbol %q.\n", planned.Kind, planned.Symbol), nil
	}
}

func renderPackageJSON(plan ReactPlan) string {
	return fmt.Sprintf(`{
  "name": %q,
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "typescript": "~6.0.2"
  }
}
`, plan.PackageName)
}

func renderTSConfig() string {
	return `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["**/*.stories.tsx", "node_modules"]
}
`
}

func renderConstJSON(plan ReactPlan, planned ReactPlannedFile, symbol string, value any) (string, error) {
	b, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return "", err
	}
	meta := pbuiGeneratedMetadata(plan, planned, nil)
	prelude, err := genmeta.RenderTypeScriptPrelude(meta)
	if err != nil {
		return "", err
	}
	var buf bytes.Buffer
	buf.WriteString(prelude)
	buf.WriteString("// This registry preserves PBUI/Semantic/Interaction metadata for introspection surfaces.\n\n")
	buf.WriteString("export const ")
	buf.WriteString(symbol)
	buf.WriteString(" = ")
	buf.Write(b)
	buf.WriteString(" as const;\n")
	return buf.String(), nil
}

func renderSessionSlice(plan ReactPlan, planned ReactPlannedFile) (string, error) {
	prelude, err := genmeta.RenderTypeScriptPrelude(pbuiGeneratedMetadata(plan, planned, nil))
	if err != nil {
		return "", err
	}
	return prelude + `export type PBUIInteractionState =
  | { kind: 'idle' }
  | { kind: 'objectSelected'; semanticId: string; domainType: string }
  | { kind: 'choosingAction'; actionId: string; semanticId: string; domainType: string }
  | { kind: 'choosingArgument'; actionId: string }
  | { kind: 'confirming'; actionId: string; semanticId?: string };

export interface PBUISessionState {
  selection: { currentObjectId?: string; currentObjectType?: string };
  interaction: PBUIInteractionState;
  commandBuffer: string;
  commandHistory: string[];
  commandHint: string;
  actionResult?: string;
}

export const initialPBUISessionState: PBUISessionState = {
  selection: {},
  interaction: { kind: 'idle' },
  commandBuffer: '',
  commandHistory: [],
  commandHint: '',
};
`, nil
}

func renderSelectors(plan ReactPlan, planned ReactPlannedFile) (string, error) {
	prelude, err := genmeta.RenderTypeScriptPrelude(pbuiGeneratedMetadata(plan, planned, nil))
	if err != nil {
		return "", err
	}
	return prelude + `// Presenter logic should compile into selectors/projection functions like these.

export interface PBUIRootStateLike {
  pbui?: unknown;
}

export function selectPBUISession(state: PBUIRootStateLike) {
  return state.pbui;
}

export function projectPresentationRef(input: { id: string; domainType: string; label: string }) {
  return {
    semanticId: input.id,
    domainType: input.domainType,
    presentationType: 'pbui.presentation_ref',
    label: input.label,
  };
}
`, nil
}

func renderActionRequests(plan ReactPlan, planned ReactPlannedFile) (string, error) {
	prelude, err := genmeta.RenderTypeScriptPrelude(pbuiGeneratedMetadata(plan, planned, nil))
	if err != nil {
		return "", err
	}
	return prelude + `export interface PBUIActionRequest {
  actionId: string;
  subjectRef?: string;
  arguments?: Record<string, unknown>;
  sourcePresentationType?: string;
}

export function buildPBUIActionRequest(request: PBUIActionRequest): PBUIActionRequest {
  return request;
}
`, nil
}

func renderEventAdapters(plan ReactPlan, planned ReactPlannedFile) (string, error) {
	prelude, err := genmeta.RenderTypeScriptPrelude(pbuiGeneratedMetadata(plan, planned, nil))
	if err != nil {
		return "", err
	}
	return prelude + `import type { PBUIActionRequest } from './actionRequests';

export function eventToPBUIActionRequest(actionId: string, subjectRef?: string): PBUIActionRequest {
  return { actionId, subjectRef };
}
`, nil
}

func renderCommandParser(plan ReactPlan, planned ReactPlannedFile) (string, error) {
	prelude, err := genmeta.RenderTypeScriptPrelude(pbuiGeneratedMetadata(plan, planned, nil))
	if err != nil {
		return "", err
	}
	return prelude + `export interface ParsedPBUICommand {
  kind: 'empty' | 'action';
  actionId?: string;
  raw: string;
}

export function parsePBUICommand(raw: string): ParsedPBUICommand {
  const trimmed = raw.trim();
  if (!trimmed) return { kind: 'empty', raw };
  return { kind: 'action', actionId: trimmed.split(/\s+/)[0], raw };
}
`, nil
}

func renderPackageReadme(plan ReactPlan) string {
	return fmt.Sprintf("# %s\n\nGenerated PBUI React scaffold plan.\n\nThis package is generated from the DMETA PBUI MetaDesignSystem. It keeps actions,\nobject types, and presentations visible as first-class descriptors so generated\ncomponents can be inspected and traced back to Semantic IR, Interaction IR, and\nPBUI lowering rules.\n\n- MetaDesignSystem: `%s`\n- Target: `%s`\n- Object descriptors: %d\n- Action descriptors: %d\n- Presentation components: %d\n", plan.PackageName, plan.MetaDesignSystem, plan.TargetID, len(plan.ObjectDescriptors), len(plan.ActionDescriptors), len(plan.PresentationPlans))
}

func renderPresenterHook(parent ReactPlan, planned ReactPlannedFile, plan PresentationPlan) (string, error) {
	prelude, err := genmeta.RenderTypeScriptPrelude(pbuiGeneratedMetadata(parent, planned, &plan))
	if err != nil {
		return "", err
	}
	return prelude + fmt.Sprintf(`// Presenter intent: %s

export interface %sViewModel {
  presentationType: %q;
  semanticId?: string;
  label?: string;
}

export function use%sPresentation(seed: Partial<%sViewModel> = {}): %sViewModel {
  return {
    presentationType: %q,
    ...seed,
  };
}
`, tsComment(plan.PresenterIntent), plan.ComponentName, plan.PresentationTypeID, plan.ComponentName, plan.ComponentName, plan.ComponentName, plan.PresentationTypeID), nil
}

func renderComponent(parent ReactPlan, planned ReactPlannedFile, plan PresentationPlan) (string, error) {
	prelude, err := genmeta.RenderTypeScriptPrelude(pbuiGeneratedMetadata(parent, planned, &plan))
	if err != nil {
		return "", err
	}
	return prelude + fmt.Sprintf(`// Presenter intent: %s
// Recognizer intent: %s

export interface %sProps {
  semanticId?: string;
  label?: string;
}

export function %s(props: %sProps) {
  return (
    <section
      data-dmeta-meta-design-system="pbui"
      data-dmeta-codegen-target="react"
      data-dmeta-presentation-type=%q
      data-dmeta-representations=%q
      data-dmeta-actions=%q
    >
      <strong>%s</strong>
      {props.label ? <span>{props.label}</span> : null}
    </section>
  );
}
`, tsComment(plan.PresenterIntent), tsComment(plan.RecognizerIntent), plan.ComponentName, plan.ComponentName, plan.ComponentName, plan.PresentationTypeID, strings.Join(plan.SourceRepresentations, ","), strings.Join(plan.SourceActions, ","), plan.ComponentName), nil
}

func renderMetadata(plan ReactPlan, planned ReactPlannedFile) (string, error) {
	payload, err := genmeta.RenderJSON(pbuiGeneratedMetadata(plan, planned, nil))
	if err != nil {
		return "", err
	}
	return string(payload), nil
}

func renderStories(parent ReactPlan, planned ReactPlannedFile, plan PresentationPlan) (string, error) {
	prelude, err := genmeta.RenderTypeScriptPrelude(pbuiGeneratedMetadata(parent, planned, &plan))
	if err != nil {
		return "", err
	}
	return prelude + fmt.Sprintf(`import type { Meta, StoryObj } from '@storybook/react';
import { %s } from './%s';

const meta = {
  title: 'PBUI/%s',
  component: %s,
  parameters: {
    docs: {
      description: {
        component: %q,
      },
    },
  },
} satisfies Meta<typeof %s>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: %q,
  },
};
`, plan.ComponentName, plan.ComponentName, plan.ComponentName, plan.ComponentName, plan.Rationale, plan.ComponentName, plan.PresentationTypeID), nil
}

func renderBarrel(plan ReactPlan, planned ReactPlannedFile) (string, error) {
	prelude, err := genmeta.RenderTypeScriptPrelude(pbuiGeneratedMetadata(plan, planned, nil))
	if err != nil {
		return "", err
	}
	return prelude + fmt.Sprintf("export * from './%s';\n", filepath.Base(planned.Symbol)), nil
}

func pbuiGeneratedMetadata(plan ReactPlan, planned ReactPlannedFile, presentation *PresentationPlan) genmeta.GeneratedFileMetadata {
	generated := plan.Generated
	if generated.By == "" {
		generated.By = "dmeta plan-pbui-react/scaffold-pbui-react"
	}
	meta := genmeta.GeneratedFileMetadata{
		Generated: generated,
		Artifact: genmeta.ArtifactInfo{
			Path:       planned.Path,
			Kind:       planned.Kind,
			Language:   reactLanguageForPath(planned.Path),
			Symbol:     planned.Symbol,
			Promotable: false,
		},
		Pipeline: genmeta.PipelineInfo{
			SemanticRoot:     plan.SemanticRoot,
			InteractionsRoot: plan.InteractionsRoot,
			MetaDesignSystem: "pbui",
			Target:           plan.TargetID,
			Passes:           append([]string{}, planned.Provenance.Passes...),
		},
		Sources: []genmeta.SourceReference{
			{Path: plan.SemanticRoot, Role: "semantic package", Why: "Provides domain object types, archetypes, capabilities, and source examples used to derive PBUI object descriptors."},
			{Path: plan.InteractionsRoot, Role: "interaction package", Why: "Provides action and representation obligations lowered into PBUI presentations."},
			{Path: plan.PBUIRoot, Role: "PBUI MetaDesignSystem", Why: "Provides presentation types, lowering rules, and React target file kinds."},
		},
		Guidance: &genmeta.HumanGuidance{
			Summary: "Generated generic PBUI React proof artifact. Regenerate from DMETA sources; promote only by copying into a maintained target and preserving the metadata trail.",
			ImplementationNotes: []string{
				"Use dmetaGeneratedMetadata to trace this file back to Semantic IR, Interaction IR, and PBUI lowering rules.",
				"Do not hand-edit ignored generated/pbui-react output; update source IR or renderer code instead.",
			},
		},
	}
	if presentation != nil {
		meta.Semantics = &genmeta.SemanticGuidance{
			DomainTypes:     append([]string{}, presentation.SourceDomainTypes...),
			Representations: append([]string{}, presentation.SourceRepresentations...),
			Actions:         append([]string{}, presentation.SourceActions...),
			SourceRules:     append([]string{}, presentation.SourceRules...),
		}
		meta.PBUI = &genmeta.PBUIGuidance{
			PresentationType: presentation.PresentationTypeID,
			PresenterIntent:  presentation.PresenterIntent,
			RecognizerIntent: presentation.RecognizerIntent,
		}
	} else if planned.Provenance.PresentationTypeID != "" {
		meta.Semantics = &genmeta.SemanticGuidance{
			DomainTypes:     append([]string{}, planned.Provenance.DomainTypes...),
			Representations: append([]string{}, planned.Provenance.Representations...),
			Actions:         append([]string{}, planned.Provenance.Actions...),
			SourceRules:     append([]string{}, planned.Provenance.SourceRules...),
		}
		meta.PBUI = &genmeta.PBUIGuidance{
			PresentationType: planned.Provenance.PresentationTypeID,
			PresenterIntent:  planned.Provenance.PresenterIntent,
			RecognizerIntent: planned.Provenance.RecognizerIntent,
		}
	}
	return genmeta.WithDefaults(meta)
}

func reactLanguageForPath(path string) string {
	switch filepath.Ext(path) {
	case ".tsx":
		return "tsx"
	case ".ts":
		return "ts"
	case ".json":
		return "json"
	case ".md":
		return "markdown"
	default:
		return "text"
	}
}

func tsComment(value string) string {
	return strings.ReplaceAll(value, "\n", " ")
}
