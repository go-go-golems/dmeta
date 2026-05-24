import type { Meta, StoryObj } from '@storybook/react-vite';
import { StreetDeliOrderTracker } from './StreetDeliOrderTracker';
import type { TrackerStep } from '../../view-models/types';

const meta: Meta<typeof StreetDeliOrderTracker> = {
  title: 'Street Deli/Organisms/StreetDeliOrderTracker',
  component: StreetDeliOrderTracker,
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: 'select',
      options: ['received', 'preparing', 'ready', 'picked_up'] as TrackerStep[],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Reflection-first scaffold promoted from `deli.order_tracker`. ' +
          'Semantic context: WorkItem + TimelineSpan; capabilities: stateful, temporal, relatable. ' +
          'Four-step status indicator with completed, active, and pending visual states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StreetDeliOrderTracker>;

export const OrderReceived: Story = {
  args: {
    orderNumber: 100,
    currentStep: 'received',
    onBack: () => {},
  },
};

export const Preparing: Story = {
  args: {
    orderNumber: 101,
    currentStep: 'preparing',
    onBack: () => {},
  },
};

export const Ready: Story = {
  args: {
    orderNumber: 102,
    currentStep: 'ready',
    onBack: () => {},
  },
};

export const PickedUp: Story = {
  args: {
    orderNumber: 103,
    currentStep: 'picked_up',
    onBack: () => {},
  },
};
