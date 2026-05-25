import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiText } from './PbuiText';

const meta = {
  title: 'Generic/CLIM/PbuiText',
  component: PbuiText,
} satisfies Meta<typeof PbuiText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  args: { children: 'normal foreground' },
  render: () => (
    <div className="grid gap-2 bg-clim-bg p-4 font-mono">
      <PbuiText tone="normal">normal foreground</PbuiText>
      <PbuiText tone="bright">bright foreground</PbuiText>
      <PbuiText tone="muted">muted techno babble</PbuiText>
      <PbuiText tone="danger">danger / selectable</PbuiText>
      <PbuiText tone="removed">removed row text</PbuiText>
    </div>
  ),
};
