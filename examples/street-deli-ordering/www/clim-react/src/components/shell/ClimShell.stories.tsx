import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '../storybook/ClimStoryShell';
import { ClimShell } from './ClimShell';

const meta = {
  title: 'CLIM/Shell/ClimShell',
  component: ClimShell,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof ClimShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
