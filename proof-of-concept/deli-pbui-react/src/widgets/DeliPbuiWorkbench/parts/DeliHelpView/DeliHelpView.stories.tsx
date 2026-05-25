import type { Meta, StoryObj } from '@storybook/react-vite';
import { deliActions } from '../../../../domain/deli/actions';
import { DeliHelpView } from './DeliHelpView';

const meta = {
  title: 'POC/Deli PBUI Workbench/Parts/DeliHelpView',
  component: DeliHelpView,
  args: { actions: Object.values(deliActions) },
} satisfies Meta<typeof DeliHelpView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllActions: Story = {};
