import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '../components/storybook/ClimStoryShell';
import { SubstitutionView } from './SubstitutionView';

const meta = {
  title: 'CLIM/Views/SubstitutionView',
  component: SubstitutionView,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof SubstitutionView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
