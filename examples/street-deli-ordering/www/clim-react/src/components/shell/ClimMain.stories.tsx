import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '../storybook/ClimStoryShell';
import { ClimMain } from './ClimMain';

const meta = {
  title: 'CLIM/Shell/ClimMain',
  component: ClimMain,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof ClimMain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
