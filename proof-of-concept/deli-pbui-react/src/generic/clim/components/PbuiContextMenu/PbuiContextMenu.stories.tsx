import type { Meta, StoryObj } from '@storybook/react-vite';
import { actionIntents } from '../../actionEngine';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PbuiContextMenu } from './PbuiContextMenu';
import type { ActionPresentation, ActionSpec, PresentationRef } from '../../types';

const sampleRef: PresentationRef = {
  type: 'MenuItem',
  id: 'classic-blta',
  label: 'Classic BLTA $11.95',
  capabilities: ['labelable', 'composable'],
  copyValue: 'classic-blta',
};

function makeAp(action: ActionSpec): ActionPresentation {
  return {
    action,
    commandLabel: action.label,
    intents: actionIntents(action),
    requiresConfirmation: Boolean(action.requiresConfirmation),
  };
}

const customizeAction: ActionSpec = {
  id: 'CUSTOMIZE', label: 'CUSTOMIZE', description: 'Customize this item.', views: ['menu'],
  args: [{ name: 'item', kind: 'ref', objectType: 'MenuItem' }], run: () => undefined,
};

const copyAction: ActionSpec = {
  id: 'COPY', label: 'COPY', description: 'Copy reference.', views: ['menu', 'detail'],
  args: [{ name: 'subject', kind: 'ref', objectType: 'Any' }], run: () => undefined,
};

const archiveAction: ActionSpec = {
  id: 'ARCHIVE', label: 'ARCHIVE', description: 'Archive this item.', views: ['menu'],
  args: [{ name: 'item', kind: 'ref', objectType: 'MenuItem' }],
  requiresConfirmation: true, run: () => undefined,
};

const menuActions: ActionPresentation[] = [makeAp(customizeAction), makeAp(copyAction), makeAp(archiveAction)];

export default {
  title: 'Generic/CLIM/PbuiContextMenu',
  component: PbuiContextMenu,
} as Meta<typeof PbuiContextMenu>;

type Story = StoryObj<typeof PbuiContextMenu>;

export const Open: Story = {
  args: {
    visible: true,
    x: 50,
    y: 50,
    ref: sampleRef,
    actions: menuActions,
    onAction: fn(),
    onDismiss: fn(),
  },
};

export const WithDangerous: Story = {
  args: {
    visible: true,
    x: 50,
    y: 50,
    ref: sampleRef,
    actions: [makeAp(archiveAction), makeAp(customizeAction), makeAp(copyAction)],
    onAction: fn(),
    onDismiss: fn(),
  },
};

export const NoActions: Story = {
  args: {
    visible: true,
    x: 50,
    y: 50,
    ref: sampleRef,
    actions: [],
    onAction: fn(),
    onDismiss: fn(),
  },
};

export const Hidden: Story = {
  args: {
    visible: false,
    x: 0,
    y: 0,
    ref: null,
    actions: [],
    onAction: fn(),
    onDismiss: fn(),
  },
};

export const ClickActionInteraction: Story = {
  args: {
    visible: true,
    x: 50,
    y: 50,
    ref: sampleRef,
    actions: menuActions,
    onAction: fn(),
    onDismiss: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const customizeBtn = await canvas.findByRole('button', { name: 'CUSTOMIZE' });
    await userEvent.click(customizeBtn);
    await expect(args.onAction).toHaveBeenCalled();
  },
};

export const ClickAwayDismissInteraction: Story = {
  args: {
    visible: true,
    x: 50,
    y: 50,
    ref: sampleRef,
    actions: menuActions,
    onAction: fn(),
    onDismiss: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    // The click-away backdrop is a fixed div
    const backdrop = canvasElement.querySelector('.fixed.inset-0');
    if (backdrop) {
      await userEvent.click(backdrop as HTMLElement);
      await expect(args.onDismiss).toHaveBeenCalled();
    }
  },
};
