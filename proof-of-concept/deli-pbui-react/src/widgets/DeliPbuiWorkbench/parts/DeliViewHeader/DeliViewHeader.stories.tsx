import type { Meta, StoryObj } from '@storybook/react-vite';
import { deliViewModels } from '../../../../domain/deli/viewModels';
import { DeliViewHeader } from './DeliViewHeader';

const meta = {
  title: 'POC/Deli PBUI Workbench/Parts/DeliViewHeader',
  component: DeliViewHeader,
  args: { view: deliViewModels.detail },
} satisfies Meta<typeof DeliViewHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Detail: Story = {};
