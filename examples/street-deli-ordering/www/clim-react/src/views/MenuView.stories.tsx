import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '../components/storybook/ClimStoryShell';
import { MenuView } from './MenuView';

const meta = {
  title: 'CLIM/Views/MenuView',
  component: MenuView,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof MenuView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
