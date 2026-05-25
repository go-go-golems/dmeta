import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiConfirmPrompt } from './PbuiConfirmPrompt';
import type { CommandBinding } from '../../types';

const binding: CommandBinding = {
  id: 'PLACE-ORDER',
  actionId: 'submit_order',
  label: 'PLACE-ORDER',
  summary: 'Submit cart as an order.',
  views: ['cart'],
  presentationType: 'pbui.action_presentation',
  surface: 'confirm_prompt',
  handler: 'deli.submitOrder',
  inputMapping: { cart_ref: 'current_cart' },
  requiresConfirmation: true,
  confirmation: {
    surface: 'confirm_prompt',
    prompt: 'Submit the current cart as an order?',
    confirmLabel: 'CONFIRM PLACE-ORDER',
    cancelLabel: 'CANCEL',
  },
};

const meta = {
  title: 'Generic/CLIM/PbuiConfirmPrompt',
  component: PbuiConfirmPrompt,
} satisfies Meta<typeof PbuiConfirmPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Prompt: Story = {
  args: { binding, onConfirm: () => undefined, onCancel: () => undefined },
  render: () => (
    <div className="bg-clim-bg p-4 font-mono">
      <PbuiConfirmPrompt binding={binding} onConfirm={() => undefined} onCancel={() => undefined} />
    </div>
  ),
};
