import type { Meta, StoryObj } from '@storybook/react-vite';
import { deliActions } from '../../../../domain/deli/actions';
import { getPrefixCommandHelp, registerPrefixCommands } from '@go-go-golems/pbui';
import { DELI_PREFIX_COMMANDS } from '../../../../domain/deli/prefixCommands';
import { DeliHelpView } from './DeliHelpView';

// Register deli prefix commands for the story
registerPrefixCommands(DELI_PREFIX_COMMANDS);

export default {
  title: 'POC/Deli PBUI Workbench/Parts/DeliHelpView',
  component: DeliHelpView,
  args: { actions: Object.values(deliActions) },
} as Meta<typeof DeliHelpView>;

type Story = StoryObj<typeof DeliHelpView>;

export const AllActions: Story = {};

export const WithPrefixCommands: Story = {
  args: {
    actions: Object.values(deliActions),
  },
  render: (args) => (
    <div className="bg-clim-bg p-4 font-mono text-sm min-h-[600px]">
      <DeliHelpView {...args} />
    </div>
  ),
};
