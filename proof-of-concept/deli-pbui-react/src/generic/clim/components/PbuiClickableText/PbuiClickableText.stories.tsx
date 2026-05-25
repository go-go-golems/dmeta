import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiClickableText } from './PbuiClickableText';

const meta = {
  title: 'Generic/CLIM/PbuiClickableText',
  component: PbuiClickableText,
  parameters: {
    docs: {
      description: {
        component: 'Shared dotted-underline clickable text primitive. Actions and selectable presentation labels use this so underline skip-ink, offset, thickness, cursor, and hover colors stay consistent.',
      },
    },
  },
} satisfies Meta<typeof PbuiClickableText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  args: { children: 'CUSTOMIZE' },
  render: () => (
    <div className="flex gap-4 bg-clim-bg p-4 font-mono text-sm">
      <PbuiClickableText tone="normal">CUSTOMIZE</PbuiClickableText>
      <PbuiClickableText tone="selectable">turkey [protein]</PbuiClickableText>
      <PbuiClickableText tone="danger">PLACE-ORDER</PbuiClickableText>
      <PbuiClickableText disabled>DISABLED</PbuiClickableText>
    </div>
  ),
};
