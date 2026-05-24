import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '../components/storybook/ClimStoryShell';
import { CartView } from './CartView';

const meta = {
  title: 'CLIM/Views/CartView',
  component: CartView,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof CartView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
