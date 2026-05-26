import type { Meta, StoryObj } from '@storybook/react-vite';
import { actionIntents } from '../../actionEngine';
import { PbuiHelpView } from './PbuiHelpView';
import type { ActionPresentation, ActionSpec } from '../../types';
import type { PrefixCommandHelp } from '../../commandParser';

function makeAp(action: ActionSpec): ActionPresentation {
  return {
    action,
    commandLabel: action.label,
    intents: actionIntents(action),
    requiresConfirmation: Boolean(action.requiresConfirmation),
  };
}

const actions: ActionPresentation[] = [
  makeAp({ id: 'DOCUMENTS', label: 'DOCUMENTS', description: 'Show document list', views: [], args: [], run: () => undefined }),
  makeAp({ id: 'INBOX', label: 'INBOX', description: 'Show inbox documents', views: [], args: [], run: () => undefined }),
  makeAp({ id: 'BACK', label: 'BACK', description: 'Return to previous view', views: [], args: [], run: () => undefined }),
  makeAp({ id: 'HELP', label: 'HELP', description: 'Show this help', views: [], args: [], run: () => undefined }),
  makeAp({ id: 'INSPECT', label: 'INSPECT', description: 'Inspect a document', views: [], args: [{ name: 'doc', kind: 'ref', objectType: 'ReaderDocument' }], run: () => undefined }),
  makeAp({ id: 'CLASSIFY', label: 'CLASSIFY', description: 'Create classification proposal', views: [], args: [{ name: 'doc', kind: 'ref', objectType: 'ReaderDocument' }], run: () => undefined }),
  makeAp({ id: 'ARCHIVE-DOCUMENT', label: 'ARCHIVE-DOCUMENT', description: 'Archive document', views: [], args: [{ name: 'doc', kind: 'ref', objectType: 'ReaderDocument' }], requiresConfirmation: true, run: () => undefined }),
];

const prefixCommands: PrefixCommandHelp[] = [
  { id: 'SEARCH', args: '<query>', description: 'Full-text search', example: 'SEARCH sqlite datasette' },
  { id: 'SOURCE', args: '<name>', description: 'Filter by source', example: 'SOURCE simonwillison.net' },
  { id: 'TAG', args: '<key>', description: 'Filter by tag', example: 'TAG ai' },
];

export default {
  title: 'Generic/CLIM/PbuiHelpView',
  component: PbuiHelpView,
} as Meta<typeof PbuiHelpView>;

type Story = StoryObj<typeof PbuiHelpView>;

export const Full: Story = {
  args: { actions, prefixCommands },
};

export const ActionsOnly: Story = {
  args: { actions },
};

export const Minimal: Story = {
  args: {
    actions: [
      makeAp({ id: 'HELP', label: 'HELP', description: 'Show help', views: [], args: [], run: () => undefined }),
    ],
  },
};
