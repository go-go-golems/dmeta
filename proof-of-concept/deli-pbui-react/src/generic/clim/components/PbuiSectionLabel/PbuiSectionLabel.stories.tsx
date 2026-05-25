import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiSectionLabel } from './PbuiSectionLabel';

const meta = {
  title: 'Generic/CLIM/PbuiSectionLabel',
  component: PbuiSectionLabel,
} satisfies Meta<typeof PbuiSectionLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlainTitle: Story = {
  args: { children: 'Composition Draft' },
  render: () => (
    <div className="bg-clim-bg p-4 font-mono">
      <PbuiSectionLabel>Composition Draft</PbuiSectionLabel>
      <div className="text-clim-bright">Hudson Classic</div>
    </div>
  ),
};
