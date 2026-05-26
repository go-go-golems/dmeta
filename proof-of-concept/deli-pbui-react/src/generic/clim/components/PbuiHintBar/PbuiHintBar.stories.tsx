import type { Meta, StoryObj } from '@storybook/react-vite';
import { actionIntents } from '../../actionEngine';
import { PbuiHintBar } from './PbuiHintBar';
import type { ActionPresentation, ActionSpec, PresentationRef } from '../../types';

const sampleRef: PresentationRef = {
  type: 'MenuItem',
  id: 'classic-blta',
  label: 'Classic BLTA',
  capabilities: ['labelable', 'composable'],
};

function makeAp(action: ActionSpec, overrides?: Partial<ActionPresentation>): ActionPresentation {
  return {
    action,
    commandLabel: action.label,
    intents: actionIntents(action),
    requiresConfirmation: Boolean(action.requiresConfirmation),
    ...overrides,
  };
}

const customizeAction: ActionSpec = {
  id: 'CUSTOMIZE', label: 'CUSTOMIZE', description: 'Customize item.', views: ['menu'],
  args: [{ name: 'item', kind: 'ref', objectType: 'MenuItem' }], run: () => undefined,
};

const copyAction: ActionSpec = {
  id: 'COPY', label: 'COPY', description: 'Copy reference.', views: ['menu'],
  args: [{ name: 'subject', kind: 'ref', objectType: 'Any' }], run: () => undefined,
};

const cartAction: ActionSpec = {
  id: 'CART', label: 'CART', description: 'View cart.', views: ['menu'],
  args: [], run: () => undefined,
};

const archiveAction: ActionSpec = {
  id: 'ARCHIVE-DOCUMENT', label: 'ARCHIVE-DOCUMENT', description: 'Archive.', views: ['menu'],
  args: [{ name: 'item', kind: 'ref', objectType: 'MenuItem' }],
  requiresConfirmation: true, run: () => undefined,
};

export default {
  title: 'Generic/CLIM/PbuiHintBar',
  component: PbuiHintBar,
} as Meta<typeof PbuiHintBar>;

type Story = StoryObj<typeof PbuiHintBar>;

export const WithActions: Story = {
  args: {
    selectedRef: sampleRef,
    actions: [makeAp(customizeAction), makeAp(copyAction), makeAp(cartAction)],
    onAction: () => {},
  },
};

export const WithDangerous: Story = {
  args: {
    selectedRef: sampleRef,
    actions: [makeAp(customizeAction), makeAp(archiveAction), makeAp(cartAction)],
    onAction: () => {},
  },
};

export const NoSelection: Story = {
  args: {
    actions: [makeAp(customizeAction)],
    onAction: () => {},
  },
};

export const NoActions: Story = {
  args: {
    selectedRef: sampleRef,
    actions: [],
    onAction: () => {},
  },
};
