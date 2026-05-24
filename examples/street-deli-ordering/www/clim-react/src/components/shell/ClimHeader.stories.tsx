import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '../storybook/ClimStoryShell';
import { ClimHeader } from './ClimHeader';

const meta = {
  title: 'CLIM/Shell/ClimHeader',
  component: ClimHeader,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof ClimHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
