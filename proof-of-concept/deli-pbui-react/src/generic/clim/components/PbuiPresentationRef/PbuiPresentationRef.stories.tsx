import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiPresentationRef } from './PbuiPresentationRef';
import type { PresentationRef } from '../../types';

const menuItem: PresentationRef<'MenuItem'> = {
  type: 'MenuItem',
  id: 'classic-blta',
  label: 'Classic BLTA $11.95',
  capabilities: ['labelable', 'composable'],
  copyValue: 'classic-blta',
};

const ingredient: PresentationRef<'Ingredient'> = {
  type: 'Ingredient',
  id: 'bacon',
  label: 'Bacon [protein]',
  capabilities: ['labelable', 'removable'],
  copyValue: 'bacon',
};

const document: PresentationRef<'ReaderDocument'> = {
  type: 'ReaderDocument',
  id: '01ks6213',
  label: 'Datasette Agent',
  capabilities: ['contentful', 'taggable'],
  copyValue: 'https://read.readwise.io/read/01ks6213',
};

export default {
  title: 'Generic/CLIM/PbuiPresentationRef',
  component: PbuiPresentationRef,
} as Meta<typeof PbuiPresentationRef>;

type Story = StoryObj<typeof PbuiPresentationRef>;

export const Normal: Story = {
  args: {
    presentation: menuItem,
    onSelect: () => {},
  },
  render: () => (
    <div className="bg-clim-bg p-4 font-mono text-sm space-y-2">
      <PbuiPresentationRef presentation={menuItem} onSelect={() => {}} />
      <PbuiPresentationRef presentation={ingredient} onSelect={() => {}} />
      <PbuiPresentationRef presentation={document} onSelect={() => {}} />
    </div>
  ),
};

export const Selected: Story = {
  args: {
    presentation: menuItem,
    state: { selected: true },
    onSelect: () => {},
  },
};

export const Selectable: Story = {
  args: {
    presentation: menuItem,
    state: { selectable: true },
    onSelect: () => {},
  },
  render: (args) => (
    <div className="bg-clim-bg p-4 font-mono text-sm space-y-2">
      <PbuiPresentationRef {...args} presentation={menuItem} />
      <PbuiPresentationRef {...args} presentation={ingredient} />
    </div>
  ),
};

export const DangerousTarget: Story = {
  args: {
    presentation: menuItem,
    state: { selectable: true, dangerousTarget: true },
    onSelect: () => {},
  },
  render: (args) => (
    <div className="bg-clim-bg p-4 font-mono text-sm space-y-2">
      <PbuiPresentationRef {...args} presentation={menuItem} />
      <PbuiPresentationRef {...args} presentation={ingredient} />
      <PbuiPresentationRef {...args} presentation={document} />
    </div>
  ),
};

export const Removed: Story = {
  args: {
    presentation: ingredient,
    state: { muted: true },
    onSelect: () => {},
  },
};

export const Disabled: Story = {
  args: {
    presentation: menuItem,
    state: { disabled: true },
  },
};

export const SelectModeComparison: Story = {
  render: () => (
    <div className="bg-clim-bg p-4 font-mono text-sm space-y-2">
      <div className="text-clim-muted text-xs uppercase mb-2">Select mode — safe action (REMOVE-INGREDIENT)</div>
      <PbuiPresentationRef presentation={ingredient} state={{ selectable: true }} onSelect={() => {}} />
      <PbuiPresentationRef presentation={menuItem} state={{ disabled: true }} />
      <div className="text-clim-muted text-xs uppercase mb-2 mt-4">Select mode — dangerous action (ARCHIVE-DOCUMENT)</div>
      <PbuiPresentationRef presentation={document} state={{ selectable: true, dangerousTarget: true }} onSelect={() => {}} />
      <PbuiPresentationRef presentation={menuItem} state={{ disabled: true }} />
    </div>
  ),
};
