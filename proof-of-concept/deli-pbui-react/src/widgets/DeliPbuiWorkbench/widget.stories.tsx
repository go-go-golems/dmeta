import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeliPbuiWorkbenchWithProvider } from './widget';

const meta = {
  title: 'POC/Deli PBUI Workbench',
  component: DeliPbuiWorkbenchWithProvider,
  parameters: {
    docs: {
      description: {
        component: 'Standalone PBUI/CLIM proof-of-concept: generic CLIM shell components, Street Deli domain registries, RTK Query fixture data, command/action bindings, and Tailwind styling in one widget entrypoint.',
      },
    },
  },
} satisfies Meta<typeof DeliPbuiWorkbenchWithProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MenuMode: Story = {};

export const DetailMode: Story = {
  args: {
    initialView: 'detail',
    initialSelectedItemId: 'sandwich.hudson-classic',
  },
};

export const CartMode: Story = {
  args: {
    initialView: 'cart',
    initialSelectedItemId: 'sandwich.hudson-classic',
    initialCart: true,
  },
};

export const HelpMode: Story = {
  args: {
    initialView: 'help',
  },
};
