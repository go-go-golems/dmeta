import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeliPbuiWorkbenchWithProvider } from './widget';

const meta = {
  title: 'POC/Deli PBUI Workbench',
  component: DeliPbuiWorkbenchWithProvider,
  parameters: {
    docs: {
      description: {
        component: 'Standalone PBUI/CLIM proof-of-concept: generic CLIM shell components, Street Deli domain registries, RTK Query fixture data, and Tailwind styling in one widget entrypoint.',
      },
    },
  },
} satisfies Meta<typeof DeliPbuiWorkbenchWithProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MenuMode: Story = {};
