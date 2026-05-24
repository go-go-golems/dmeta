import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '../components/storybook/ClimStoryShell';
import { HelpView } from './HelpView';

const meta = {
  title: 'CLIM/Views/HelpView',
  component: HelpView,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof HelpView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
