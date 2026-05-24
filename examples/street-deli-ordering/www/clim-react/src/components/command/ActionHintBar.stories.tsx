import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '../storybook/ClimStoryShell';
import { ActionHintBar } from './ActionHintBar';

const meta = {
  title: 'CLIM/Command/ActionHintBar',
  component: ActionHintBar,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof ActionHintBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const SelectMode: Story = { decorators: [(Story) => <ClimStoryShell mode="select" modeLabel="DETAIL ▸ SELECT"><Story /></ClimStoryShell>], args: { selectable: true } };
