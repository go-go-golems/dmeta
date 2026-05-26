import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiConfirmPrompt } from './PbuiConfirmPrompt';
import type { ActionSpec } from '../../types';

const action: ActionSpec = {
  id: 'PLACE-ORDER',
  label: 'PLACE-ORDER',
  description: 'Submit order.',
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

const meta = {
  title: 'Generic/CLIM/PbuiConfirmPrompt',
  component: PbuiConfirmPrompt,
  args: {
    action,
    onConfirm: () => undefined,
    onCancel: () => undefined,
  },
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
  render: () => (
    <div className="bg-clim-bg p-4 font-mono text-sm">
      <PbuiConfirmPrompt action={action} onConfirm={() => undefined} onCancel={() => undefined} />
    </div>
  ),
};
