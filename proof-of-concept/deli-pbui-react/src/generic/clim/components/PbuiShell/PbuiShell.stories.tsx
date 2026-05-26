import type { Meta, StoryObj } from '@storybook/react-vite';
import { actionIntents } from '../../actionEngine';
import { PbuiShell } from './PbuiShell';
import type { ActionPresentation, ActionSpec, ClimSessionState, ContextMenuState, PresentationRef } from '../../types';

function makeAp(action: ActionSpec, overrides?: Partial<ActionPresentation>): ActionPresentation {
  return {
    action,
    commandLabel: action.label,
    intents: actionIntents(action),
    requiresConfirmation: Boolean(action.requiresConfirmation),
    ...overrides,
  };
}

const sampleRef: PresentationRef = {
  type: 'MenuItem',
  id: 'classic-blta',
  label: 'Classic BLTA $11.95',
  capabilities: ['labelable', 'composable'],
  copyValue: 'classic-blta',
};

const placeOrderAction: ActionSpec = {
  id: 'PLACE-ORDER',
  label: 'PLACE-ORDER',
  description: 'Submit order.',
  views: ['cart'],
  args: [],
  requiresConfirmation: true,
  confirmation: { prompt: 'Submit the current cart?', confirmLabel: 'CONFIRM', cancelLabel: 'CANCEL' },
  run: () => undefined,
};

const backAction: ActionSpec = {
  id: 'BACK', label: 'BACK', description: 'Go back.', views: ['detail'], args: [], run: () => undefined,
};

const customizeAction: ActionSpec = {
  id: 'CUSTOMIZE', label: 'CUSTOMIZE', description: 'Customize item.', views: ['menu'],
  args: [{ name: 'item', kind: 'ref', objectType: 'MenuItem' }], run: () => undefined,
};

const normalState: ClimSessionState = {
  mode: 'normal',
  modeLabel: 'MENU',
  commandBuffer: 'LIST MENU',
  resultLine: 'Select a presentation or type a command.',
  commandHint: 'Click a presentation or type HELP.',
};

const selectState: ClimSessionState = {
  mode: 'select',
  modeLabel: 'SELECT ▸ CUSTOMIZE',
  commandBuffer: 'CUSTOMIZE',
  resultLine: 'Select MenuItem for CUSTOMIZE.',
  commandHint: 'CUSTOMIZE: click a compatible presentation. ESC cancels.',
  selected: sampleRef,
  pendingAction: customizeAction,
};

const confirmState: ClimSessionState = {
  mode: 'confirm',
  modeLabel: 'CONFIRM',
  commandBuffer: 'PLACE-ORDER',
  resultLine: 'Pending confirmation: PLACE-ORDER',
  commandHint: 'Confirm PLACE-ORDER? Type YES or ESC.',
  selected: sampleRef,
  pendingAction: placeOrderAction,
};

const contextMenuState: ContextMenuState = {
  visible: true,
  x: 100,
  y: 150,
  ref: sampleRef,
  actions: [makeAp(customizeAction), makeAp(backAction)],
};

export default {
  title: 'Generic/CLIM/PbuiShell',
  component: PbuiShell,
} as Meta<typeof PbuiShell>;

type Story = StoryObj<typeof PbuiShell>;

export const NormalMode: Story = {
  args: { state: normalState, title: 'MY APPLICATION', children: 'Shell body' },
  render: (args) => (
    <PbuiShell {...args}>
      <div className="p-4 font-mono text-sm text-clim-bright">Menu view content would go here.</div>
    </PbuiShell>
  ),
};

export const SelectMode: Story = {
  args: { state: selectState, children: 'Shell body' },
  render: (args) => (
    <PbuiShell {...args}>
      <div className="p-4 font-mono text-sm text-clim-bright">Select mode: click a compatible presentation.</div>
    </PbuiShell>
  ),
};

export const ConfirmMode: Story = {
  args: {
    state: confirmState,
    confirmAction: { action: placeOrderAction, ref: sampleRef },
    children: 'Shell body',
  },
  render: (args) => (
    <PbuiShell {...args}>
      <div className="p-4 font-mono text-sm text-clim-bright">Confirm modal overlays this content.</div>
    </PbuiShell>
  ),
};

export const WithContextMenu: Story = {
  args: {
    state: normalState,
    contextMenu: contextMenuState,
    children: 'Shell body',
  },
  render: (args) => (
    <PbuiShell {...args}>
      <div className="p-4 font-mono text-sm text-clim-bright">Right-click a presentation to open context menu.</div>
    </PbuiShell>
  ),
};

export const WithHint: Story = {
  args: { state: normalState, children: 'Shell body' },
  render: (args) => (
    <PbuiShell {...args}>
      <div className="p-4 font-mono text-sm text-clim-bright">Hint bar would appear below.</div>
    </PbuiShell>
  ),
};
