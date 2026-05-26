import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiCommandLine } from './PbuiCommandLine';

export default {
  title: 'Generic/CLIM/PbuiCommandLine',
  component: PbuiCommandLine,
} as Meta<typeof PbuiCommandLine>;

type Story = StoryObj<typeof PbuiCommandLine>;

export const Default: Story = {
  args: {
    value: '',
    result: 'Select a presentation or type a command.',
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const WithCommand: Story = {
  args: {
    value: 'CUSTOMIZE',
    result: 'Select MenuItem for CUSTOMIZE.',
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const WithHint: Story = {
  args: {
    value: '',
    result: 'Selected Classic BLTA $11.95.',
    hint: 'Selected <MenuItem> Classic BLTA. CUSTOMIZE CART HELP. Right-click for menu.',
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const SelectMode: Story = {
  args: {
    value: 'REMOVE-INGREDIENT',
    result: 'Select Ingredient for REMOVE-INGREDIENT.',
    hint: 'REMOVE-INGREDIENT: click a compatible presentation. ESC cancels.',
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const ConfirmMode: Story = {
  args: {
    value: 'PLACE-ORDER',
    result: 'Pending confirmation: PLACE-ORDER',
    hint: 'Confirm PLACE-ORDER? Type YES or ESC.',
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const PrefixCommandMissingArg: Story = {
  args: {
    value: '',
    result: 'SEARCH requires an argument. Example: SEARCH sqlite datasette',
    hint: 'Type SEARCH sqlite datasette.',
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const ActionStatus: Story = {
  args: {
    value: 'REMOVE-INGREDIENT',
    result: 'Select Ingredient for REMOVE-INGREDIENT.',
    actionStatus: 'ACTION SLICE mode=select action=REMOVE-INGREDIENT filled_slots=none',
    hint: 'REMOVE-INGREDIENT: click a compatible presentation. ESC cancels.',
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const AutoFocusSelect: Story = {
  args: {
    value: 'REMOVE-INGREDIENT',
    result: 'Select Ingredient for REMOVE-INGREDIENT.',
    hint: 'REMOVE-INGREDIENT: click a compatible presentation. ESC cancels.',
    autoFocus: true,
    onChange: () => {},
    onSubmit: () => {},
  },
};
