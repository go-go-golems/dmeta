import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '../components/storybook/ClimStoryShell';
import { TrackerView } from './TrackerView';

const meta = {
  title: 'CLIM/Views/TrackerView',
  component: TrackerView,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof TrackerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
