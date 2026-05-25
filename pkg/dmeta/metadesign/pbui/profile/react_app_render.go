package profile

import (
	"fmt"
	"path/filepath"
	"strings"

	genmeta "github.com/go-go-golems/dmeta/pkg/dmeta/generator/metadata"
)

func RenderReactAppFile(pkg *Package, concretePlan ConcretePresentationPlan, reactPlan ReactAppPlan, file ReactAppPlannedFile) ([]byte, bool, error) {
	switch file.Kind {
	case "font_assets":
		return nil, false, nil
	case "package_json":
		return []byte(renderPackageJSON(reactPlan.PackageName)), true, nil
	case "tsconfig":
		return []byte(renderTSConfig()), true, nil
	case "vite_config":
		return renderReactAppTypeScript(reactPlan, file, renderViteConfig()), true, nil
	case "index_html":
		return []byte(renderIndexHTML()), true, nil
	case "main_tsx":
		return renderReactAppTypeScript(reactPlan, file, renderMainTSX()), true, nil
	case "app_shell":
		return renderReactAppTypeScript(reactPlan, file, renderAppTSX(concretePlan)), true, nil
	case "storybook_main":
		return renderReactAppTypeScript(reactPlan, file, renderStorybookMain()), true, nil
	case "storybook_preview":
		return renderReactAppTypeScript(reactPlan, file, renderStorybookPreview()), true, nil
	case "storybook_preview_css":
		return []byte(renderStorybookPreviewCSS()), true, nil
	case "storybook_story_shell":
		return renderReactAppTypeScript(reactPlan, file, renderClimStoryShell()), true, nil
	case "storybook_fixtures":
		return renderReactAppTypeScript(reactPlan, file, renderPresentationFixtures()), true, nil
	case "clim_types":
		return renderReactAppTypeScript(reactPlan, file, renderClimTypes()), true, nil
	case "clim_store":
		return renderReactAppTypeScript(reactPlan, file, renderClimStore()), true, nil
	case "clim_actions":
		return renderReactAppTypeScript(reactPlan, file, renderClimActions()), true, nil
	case "clim_commands":
		return renderReactAppTypeScript(reactPlan, file, renderClimCommands()), true, nil
	case "clim_selectors":
		return renderReactAppTypeScript(reactPlan, file, renderClimSelectors()), true, nil
	case "clim_runtime":
		return renderReactAppTypeScript(reactPlan, file, renderClimRuntime()), true, nil
	case "style_profile_css":
		return []byte(renderClimCSS()), true, nil
	case "generated_registry_copy":
		return renderReactAppTypeScript(reactPlan, file, renderPBUIRegistries(concretePlan)), true, nil
	case "metadata":
		b, err := genmeta.RenderJSON(reactAppGeneratedMetadata(reactPlan, file))
		if err != nil {
			return nil, false, err
		}
		return b, true, nil
	case "shell_component", "command_line_component", "command_bar_component", "context_menu_component", "confirm_prompt_component", "presentation_component", "action_presentation_component":
		return renderReactAppTypeScript(reactPlan, file, renderComponent(file.Component)), true, nil
	case "view_component":
		return renderReactAppTypeScript(reactPlan, file, renderView(file.Component, file.ViewID)), true, nil
	case "shell_story", "command_line_story", "command_bar_story", "context_menu_story", "confirm_prompt_story", "presentation_story", "action_presentation_story", "view_story":
		return renderReactAppTypeScript(reactPlan, file, renderStory(file)), true, nil
	default:
		return nil, false, fmt.Errorf("unsupported React app file kind %q", file.Kind)
	}
}

func renderPackageJSON(packageName string) string {
	return fmt.Sprintf(`{
  "name": %q,
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "storybook": "storybook dev -p 6007",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "vite": "^8.0.12",
    "typescript": "~6.0.2",
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@storybook/react-vite": "10.4.0",
    "@storybook/addon-docs": "10.4.0",
    "storybook": "10.4.0"
  }
}
`, packageName)
}

func renderTSConfig() string {
	return `{
  "compilerOptions": {
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
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
    "jsx": "react-jsx",
    "types": ["vite/client"]
  },
  "include": ["src", ".storybook", "vite.config.ts"]
}
`
}

func renderViteConfig() string {
	return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`
}

func renderIndexHTML() string {
	return `<div id="root"></div><script type="module" src="/src/main.tsx"></script>
`
}

func renderMainTSX() string {
	return `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/clim.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`
}

func renderAppTSX(plan ConcretePresentationPlan) string {
	viewImports := []string{}
	viewElements := []string{}
	for _, view := range plan.Views {
		component := toPascal(view.ID) + "View"
		viewImports = append(viewImports, fmt.Sprintf("import { %s } from './views/%s';", component, component))
		viewElements = append(viewElements, fmt.Sprintf("          <%s />", component))
	}
	return fmt.Sprintf(`import { ClimShell } from './components/shell/ClimShell';
%s

export function App() {
  return (
    <ClimShell modeLabel="MENU" mode="normal">
      <div className="view active">
%s
      </div>
    </ClimShell>
  );
}
`, strings.Join(viewImports, "\n"), strings.Join(viewElements, "\n"))
}

func renderStorybookMain() string {
	return `import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
};

export default config;
`
}

func renderStorybookPreview() string {
	return `import type { Preview } from '@storybook/react-vite';
import '../src/styles/clim.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'clim-black',
      values: [{ name: 'clim-black', value: '#000000' }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
`
}

func renderStorybookPreviewCSS() string {
	return `body { margin: 0; background: #000; }
#storybook-root { min-height: 100vh; }
`
}

func renderClimStoryShell() string {
	return `import type { ReactNode } from 'react';

export interface ClimStoryShellProps {
  mode?: 'normal' | 'select' | 'confirm';
  modeLabel?: string;
  children: ReactNode;
}

export function ClimStoryShell({ mode = 'normal', modeLabel = 'MENU', children }: ClimStoryShellProps) {
  return (
    <div className="clim-shell" data-mode={mode}>
      <header className="header">
        <div className="brand">HUDSON STREET DELI</div>
        <div className="mode">{modeLabel}</div>
      </header>
      <main className="main">{children}</main>
      <footer className="command-line">
        <div className="cmd-input-area"><span className="prompt">:</span><span className="cmd-buffer"></span><span className="cmd-cursor">█</span></div>
        <div className="cmd-hint">Storybook fixture mode</div>
      </footer>
    </div>
  );
}
`
}

func renderPresentationFixtures() string {
	return `import type { ActionPresentation, LifecycleStep, PresentationRef } from '../clim/types';

export const menuItemPresentation: PresentationRef = {
  type: 'MenuItem',
  id: 'sandwich.hudson-classic',
  label: 'Hudson Classic',
  capabilities: ['composable', 'substitutable'],
  metadata: { price: '$12.50', category: 'Sandwiches', tags: ['popular'] },
};

export const ingredientPresentation: PresentationRef = {
  type: 'Ingredient',
  id: 'ingredient.tomato',
  label: 'tomato',
  capabilities: ['substitutable'],
  metadata: { role: 'freshness', state: 'selected' },
};

export const removeIngredientAction: ActionPresentation = {
  id: 'remove_part',
  label: 'REMOVE-INGREDIENT',
  description: 'Remove an ingredient from the selected composition.',
  dangerous: false,
  disabled: false,
};

export const placeOrderAction: ActionPresentation = {
  id: 'place_order',
  label: 'PLACE-ORDER',
  description: 'Submit the current cart.',
  dangerous: true,
  disabled: false,
};

export const trackerSteps: LifecycleStep[] = [
  { id: 'received', label: 'Received', state: 'done' },
  { id: 'preparing', label: 'Preparing', state: 'active' },
  { id: 'ready', label: 'Ready', state: 'pending' },
  { id: 'picked-up', label: 'Picked Up', state: 'pending' },
];
`
}

func renderClimTypes() string {
	return `export type InteractionMode = 'normal' | 'select' | 'confirm';

export interface PresentationRef {
  type: string;
  id: string;
  label: string;
  capabilities?: string[];
  metadata?: Record<string, string | string[]>;
}

export interface ActionPresentation {
  id: string;
  label: string;
  description?: string;
  dangerous?: boolean;
  disabled?: boolean;
}

export interface LifecycleStep {
  id: string;
  label: string;
  state: 'done' | 'active' | 'pending';
}

export interface ClimState {
  mode: InteractionMode;
  modeLabel: string;
  selectedPresentationId?: string;
  commandBuffer: string;
  actionResult?: string;
}
`
}

func renderClimStore() string {
	return `import type { ClimState } from './types';

export const initialClimState: ClimState = {
  mode: 'normal',
  modeLabel: 'MENU',
  commandBuffer: '',
  actionResult: 'Ready.',
};
`
}

func renderClimActions() string {
	return `import type { ActionPresentation, PresentationRef } from './types';

export interface ActionRequest {
  action: ActionPresentation;
  subject?: PresentationRef;
}

export function buildActionRequest(action: ActionPresentation, subject?: PresentationRef): ActionRequest {
  return { action, subject };
}
`
}

func renderClimCommands() string {
	return `export interface ParsedCommand {
  verb: string;
  args: string[];
}

export function parseClimCommand(input: string): ParsedCommand {
  const [verb = '', ...args] = input.trim().split(/\s+/).filter(Boolean);
  return { verb: verb.toUpperCase(), args };
}
`
}

func renderClimSelectors() string {
	return `import type { ActionPresentation, PresentationRef } from './types';

export function compatibleActionsFor(_presentation?: PresentationRef): ActionPresentation[] {
  return [
    { id: 'inspect_subject', label: 'DESCRIBE', description: 'Inspect this presentation.' },
    { id: 'copy_reference', label: 'COPY-REF', description: 'Copy a stable reference.' },
  ];
}
`
}

func renderClimRuntime() string {
	return `import type { ClimState, InteractionMode } from './types';

export function setMode(state: ClimState, mode: InteractionMode, modeLabel = state.modeLabel): ClimState {
  return { ...state, mode, modeLabel };
}
`
}

func renderClimCSS() string {
	return `@font-face { font-family: 'Berkeley Mono'; src: url('/fonts/BerkeleyMono-Regular.woff2') format('woff2'); font-weight: 400; }
@font-face { font-family: 'Berkeley Mono'; src: url('/fonts/BerkeleyMono-Bold.woff2') format('woff2'); font-weight: 700; }
@font-face { font-family: 'Berkeley Mono'; src: url('/fonts/BerkeleyMono-Oblique.woff2') format('woff2'); font-style: oblique; }
:root { --bg:#000; --fg:#ccc; --fg-dim:#666; --fg-bright:#fff; --highlight-bg:#333; --selection-bg:#444; --border:#333; --select:#ff4444; font-family:'Berkeley Mono', monospace; }
body { margin:0; background:var(--bg); color:var(--fg); font:13px/1.5 'Berkeley Mono', monospace; }
.clim-shell { min-height:100vh; background:var(--bg); color:var(--fg); display:grid; grid-template-rows:auto 1fr auto; }
.header { display:flex; justify-content:space-between; padding:4px 8px; border-bottom:1px solid var(--border); }
.brand, .mode, .section-label { color:var(--fg-bright); font-weight:700; }
.main { padding:8px; }
.view { display:grid; gap:12px; }
.pres, .action { cursor:default; }
.pres-block { display:block; padding:2px 0; }
.selected { background:var(--selection-bg); color:var(--fg-bright); }
.selectable { color:var(--select); }
.select-disabled { color:var(--fg-dim); }
.pres-type { color:var(--fg-bright); }
.pres-id, .role, .cmd-hint { color:var(--fg-dim); }
.cmd-bar { border-top:1px solid var(--border); border-bottom:1px solid var(--border); padding:4px 0; display:flex; gap:12px; flex-wrap:wrap; }
.action { color:var(--fg-bright); text-decoration:underline dotted; }
.pres-danger { color:var(--select); }
.command-line { border-top:1px solid var(--border); padding:4px 8px; }
.prompt { color:var(--fg-bright); margin-right:4px; }
.cmd-cursor { color:var(--fg-bright); }
.context-menu, .confirm-prompt { border:1px solid var(--border); padding:8px; background:#050505; }
.tracker-step.done { color:var(--fg-dim); }
.tracker-step.active { color:var(--fg-bright); background:var(--highlight-bg); }
.tracker-step.pending { color:var(--fg); }
.story-card { padding:8px; border:1px solid var(--border); }
`
}

func renderPBUIRegistries(plan ConcretePresentationPlan) string {
	presentationTypes := map[string]bool{}
	for _, view := range plan.Views {
		for _, p := range view.Presentations {
			presentationTypes[p.PresentationTypeID] = true
		}
	}
	ids := make([]string, 0, len(presentationTypes))
	for id := range presentationTypes {
		ids = append(ids, id)
	}
	return fmt.Sprintf("export const presentationTypeIds = %s as const;\n", renderTSStringArray(ids))
}

func renderComponent(component string) string {
	switch component {
	case "ClimShell":
		return `import type { ReactNode } from 'react';
import { ClimHeader } from './ClimHeader';

export interface ClimShellProps { mode?: 'normal' | 'select' | 'confirm'; modeLabel?: string; children?: ReactNode; }
export function ClimShell({ mode = 'normal', modeLabel = 'MENU', children }: ClimShellProps) {
  return <div className="clim-shell" data-mode={mode}><ClimHeader modeLabel={modeLabel} /><main className="main">{children}</main><footer className="command-line"><div><span className="prompt">:</span><span className="cmd-buffer"></span><span className="cmd-cursor">█</span></div><div className="cmd-hint">Type HELP for commands.</div></footer></div>;
}
`
	case "ClimHeader":
		return `export interface ClimHeaderProps { modeLabel?: string; }
export function ClimHeader({ modeLabel = 'MENU' }: ClimHeaderProps) {
  return <header className="header"><div className="brand">HUDSON STREET DELI</div><div className="mode">{modeLabel}</div></header>;
}
`
	case "ClimMain":
		return `import type { ReactNode } from 'react';
export function ClimMain({ children }: { children?: ReactNode }) { return <main className="main">{children}</main>; }
`
	}
	if strings.HasSuffix(component, "View") {
		return renderView(component, strings.TrimSuffix(strings.ToLower(component), "view"))
	}
	return fmt.Sprintf(`import type { ActionPresentation, LifecycleStep, PresentationRef } from '../../clim/types';
import { menuItemPresentation, removeIngredientAction, trackerSteps } from '../../fixtures/presentationFixtures';

export interface %[1]sProps {
  presentation?: PresentationRef;
  action?: ActionPresentation;
  steps?: LifecycleStep[];
  selected?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  title?: string;
}

export function %[1]s({ presentation = menuItemPresentation, action = removeIngredientAction, steps = trackerSteps, selected = false, selectable = false, disabled = false, title = '%[1]s' }: %[1]sProps) {
  const className = ['pres', 'pres-block', selected ? 'selected' : '', selectable ? 'selectable' : '', disabled ? 'select-disabled' : '', action.dangerous ? 'pres-danger' : ''].filter(Boolean).join(' ');
  if (title.includes('Lifecycle')) {
    return <div className="pres-block">{steps.map((step) => <div className={'tracker-step ' + step.state} key={step.id}>{step.label}</div>)}</div>;
  }
  if (title.includes('Action')) {
    return <span className={className}><span className="action">{action.label}</span> <span className="role">{action.description}</span></span>;
  }
  return <div className={className}><span className="pres-type">&lt;{presentation.type}&gt;</span> {presentation.label} <span className="pres-id">#{presentation.id}</span> <span className="role">{presentation.capabilities?.join(' ')}</span></div>;
}
`, component)
}

func renderView(component, viewID string) string {
	mode := strings.ToUpper(strings.TrimSuffix(viewID, "View"))
	if mode == "" {
		mode = strings.TrimSuffix(component, "View")
	}
	return fmt.Sprintf(`import { ActionHintBar } from '../components/command/ActionHintBar';
import { ActionPresentationInline } from '../components/presentations/ActionPresentationInline';
import { CompositionPresentationBlock } from '../components/presentations/CompositionPresentationBlock';
import { InspectorPanelBlock } from '../components/presentations/InspectorPanelBlock';
import { LifecycleStatusBlock } from '../components/presentations/LifecycleStatusBlock';
import { PresentationRefLine } from '../components/presentations/PresentationRefLine';
import { placeOrderAction, removeIngredientAction } from '../fixtures/presentationFixtures';

export function %[1]s() {
  return (
    <section className="story-card" aria-label="%[2]s view">
      <div className="cmd-bar"><span className="prompt">%[2]s&gt;</span><span className="cmd-text">LIST PRESENTATIONS</span></div>
      <div className="presentations">
        <PresentationRefLine />
        <CompositionPresentationBlock />
        <LifecycleStatusBlock />
        <InspectorPanelBlock />
      </div>
      <ActionHintBar />
      <div className="cmd-bar"><ActionPresentationInline action={removeIngredientAction} /> <ActionPresentationInline action={placeOrderAction} /></div>
    </section>
  );
}
`, component, mode)
}

func renderStory(file ReactAppPlannedFile) string {
	component := file.Component
	if component == "" {
		component = strings.TrimSuffix(filepath.Base(file.Path), ".stories.tsx")
	}
	importPath := "./" + component
	storyTitle := component
	storyShellImport := "../storybook/ClimStoryShell"
	includeStateStories := true
	if strings.Contains(file.Path, "/views/") {
		storyTitle = "CLIM/Views/" + component
		storyShellImport = "../components/storybook/ClimStoryShell"
		includeStateStories = false
	} else if strings.Contains(file.Path, "/presentations/") {
		storyTitle = "CLIM/Presentations/" + component
	} else if strings.Contains(file.Path, "/command/") {
		storyTitle = "CLIM/Command/" + component
	} else if strings.Contains(file.Path, "/shell/") {
		storyTitle = "CLIM/Shell/" + component
		includeStateStories = false
	}
	stateStories := ""
	if includeStateStories {
		stateStories = "export const Selected: Story = { args: { selected: true } };\nexport const SelectMode: Story = { decorators: [(Story) => <ClimStoryShell mode=\"select\" modeLabel=\"DETAIL ▸ SELECT\"><Story /></ClimStoryShell>], args: { selectable: true } };\n"
	}
	return fmt.Sprintf(`import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '%[4]s';
import { %[1]s } from '%[2]s';

const meta = {
  title: '%[3]s',
  component: %[1]s,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof %[1]s>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
%[5]s`, component, importPath, storyTitle, storyShellImport, stateStories)
}

func renderTSStringArray(values []string) string {
	quoted := make([]string, 0, len(values))
	for _, value := range values {
		quoted = append(quoted, fmt.Sprintf("%q", value))
	}
	return "[" + strings.Join(quoted, ", ") + "]"
}

func renderReactAppTypeScript(plan ReactAppPlan, file ReactAppPlannedFile, body string) []byte {
	prelude, err := genmeta.RenderTypeScriptPrelude(reactAppGeneratedMetadata(plan, file))
	if err != nil {
		return []byte(body)
	}
	return []byte(prelude + body)
}

func reactAppGeneratedMetadata(plan ReactAppPlan, file ReactAppPlannedFile) genmeta.GeneratedFileMetadata {
	generated := plan.Generated
	if generated.By == "" {
		generated.By = "dmeta plan-pbui-react-app/scaffold-pbui-react-app"
	}
	meta := genmeta.GeneratedFileMetadata{
		Generated: generated,
		Artifact: genmeta.ArtifactInfo{
			Path:       file.Path,
			Kind:       file.Kind,
			Language:   reactAppLanguageForPath(file.Path),
			Symbol:     file.Symbol,
			Promotable: reactAppFileIsPromotable(file.Kind),
		},
		Pipeline: genmeta.PipelineInfo{
			SemanticRoot:     plan.SemanticRoot,
			InteractionsRoot: plan.InteractionsRoot,
			MetaDesignSystem: "pbui",
			ProfileRoot:      plan.ProfileRoot,
			Target:           plan.TargetID,
			Passes:           append([]string{}, file.Provenance.SourcePasses...),
		},
		Sources: []genmeta.SourceReference{
			{Path: plan.SemanticRoot, Role: "semantic package", Why: "Provides Street Deli domain types, archetypes, capabilities, and examples."},
			{Path: plan.InteractionsRoot, Role: "interaction package", Why: "Provides actions and representations used by PBUI lowering."},
			{Path: plan.PBUIRoot, Role: "PBUI MetaDesignSystem", Why: "Provides abstract PBUI presentation types and lowering rules."},
			{Path: plan.ProfileRoot, Role: "concrete PBUI profile", Why: "Provides presentation-system, style, surface, view-model, and presentation-binding guidance for the CLIM React app."},
		},
		PBUI: &genmeta.PBUIGuidance{
			PresentationType: file.PresentationTypeID,
			ViewID:           file.ViewID,
			SurfaceID:        file.SurfaceID,
			BindingComponent: file.Component,
			StyleClasses:     []string{plan.StyleProfileID},
		},
		React: &genmeta.ReactGuidance{
			PackageName: plan.PackageName,
		},
		Guidance: &genmeta.HumanGuidance{
			Summary: "Generated concrete PBUI/CLIM React app artifact. This file is part of the promotable Street Deli CLIM app scaffold and should retain profile metadata when edited.",
			ImplementationNotes: []string{
				"Use dmetaGeneratedMetadata to trace this app code back to Semantic IR, Interaction IR, PBUI MetaDesignSystem, and the concrete presentation profile.",
				"Presentation bindings, surfaces, view models, and style-profile choices live under the concrete profile root.",
				"When promoting this file, append behavioral and visual edits to the promotion changelog before changing runtime behavior.",
			},
		},
	}
	return genmeta.WithDefaults(meta)
}

func reactAppFileIsPromotable(kind string) bool {
	switch kind {
	case "main_tsx", "app_shell", "storybook_preview", "storybook_story_shell", "storybook_fixtures", "clim_types", "clim_store", "clim_actions", "clim_commands", "clim_selectors", "clim_runtime", "generated_registry_copy", "shell_component", "command_line_component", "command_bar_component", "context_menu_component", "confirm_prompt_component", "presentation_component", "action_presentation_component", "view_component", "shell_story", "command_line_story", "command_bar_story", "context_menu_story", "confirm_prompt_story", "presentation_story", "action_presentation_story", "view_story":
		return true
	default:
		return false
	}
}

func reactAppLanguageForPath(path string) string {
	switch filepath.Ext(path) {
	case ".tsx":
		return "tsx"
	case ".ts":
		return "ts"
	case ".json":
		return "json"
	case ".css":
		return "css"
	case ".html":
		return "html"
	default:
		return "text"
	}
}
