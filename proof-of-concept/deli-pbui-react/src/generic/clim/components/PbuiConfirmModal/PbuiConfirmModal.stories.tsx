import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiConfirmModal } from './PbuiConfirmModal';
import type { ActionSpec, PresentationRef } from '../../types';

const placeOrderAction: ActionSpec = {
  id: 'PLACE-ORDER',
  label: 'PLACE-ORDER',
  description: 'Submit the cart as an order after confirmation.',
  views: ['cart'],
  args: [],
  requiresConfirmation: true,
  confirmation: {
    prompt: 'Submit the current cart as an order?',
    confirmLabel: 'CONFIRM PLACE-ORDER',
    cancelLabel: 'CANCEL',
  },
  run: () => undefined,
};

const archiveAction: ActionSpec = {
  id: 'ARCHIVE-DOCUMENT',
  label: 'ARCHIVE-DOCUMENT',
  description: 'Archive the selected document.',
  views: ['documents'],
  args: [{ name: 'doc', kind: 'ref', objectType: 'ReaderDocument' }],
  requiresConfirmation: true,
  confirmation: {
    prompt: 'Archive this document? This can be undone from the archive.',
    confirmLabel: 'CONFIRM ARCHIVE',
    cancelLabel: 'CANCEL',
  },
  run: () => undefined,
};

const sampleRef: PresentationRef = {
  type: 'ReaderDocument',
  id: '01ks6213',
  label: 'Datasette Agent',
  capabilities: ['contentful', 'taggable'],
};

export default {
  title: 'Generic/CLIM/PbuiConfirmModal',
  component: PbuiConfirmModal,
} as Meta<typeof PbuiConfirmModal>;

type Story = StoryObj<typeof PbuiConfirmModal>;

export const PlaceOrder: Story = {
  args: {
    action: placeOrderAction,
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const ArchiveDocument: Story = {
  args: {
    action: archiveAction,
    ref: sampleRef,
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const NoRef: Story = {
  args: {
    action: placeOrderAction,
    onConfirm: () => {},
    onCancel: () => {},
  },
  render: (args) => (
    <div className="bg-clim-bg font-mono text-sm min-h-[400px]">
      <PbuiConfirmModal {...args} />
    </div>
  ),
};
