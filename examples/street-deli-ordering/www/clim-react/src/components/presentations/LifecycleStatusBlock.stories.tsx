import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClimStoryShell } from '../storybook/ClimStoryShell';
import { LifecycleStatusBlock } from './LifecycleStatusBlock';

const meta = {
  title: 'CLIM/Presentations/LifecycleStatusBlock',
  component: LifecycleStatusBlock,
  decorators: [(Story) => <ClimStoryShell modeLabel="MENU"><Story /></ClimStoryShell>],
} satisfies Meta<typeof LifecycleStatusBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const SelectMode: Story = { decorators: [(Story) => <ClimStoryShell mode="select" modeLabel="DETAIL ▸ SELECT"><Story /></ClimStoryShell>], args: { selectable: true } };
