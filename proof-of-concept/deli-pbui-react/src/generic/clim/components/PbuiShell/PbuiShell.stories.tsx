import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiShell } from './PbuiShell';

const meta = {
  title: 'Generic/CLIM/PbuiShell',
  component: PbuiShell,
} satisfies Meta<typeof PbuiShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyShell: Story = {
  args: { state: { mode: 'normal', modeLabel: 'MENU', commandBuffer: 'LIST MENU', resultLine: 'Shell with editable command line.' }, children: 'Shell body' },
  render: () => (
    <PbuiShell
      state={{ mode: 'normal', modeLabel: 'MENU', commandBuffer: 'LIST MENU', resultLine: 'Shell with editable command line.' }}
    >
      <div className="text-clim-bright">Shell body</div>
    </PbuiShell>
  ),
};
