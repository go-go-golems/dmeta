import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeliTrackerView } from './DeliTrackerView';

const meta = {
  title: 'POC/Deli PBUI Workbench/Parts/DeliTrackerView',
  component: DeliTrackerView,
} satisfies Meta<typeof DeliTrackerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentOrder: Story = {};
