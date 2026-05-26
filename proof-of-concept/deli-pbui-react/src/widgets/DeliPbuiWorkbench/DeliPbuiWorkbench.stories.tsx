import { Provider } from 'react-redux';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { setupStore } from '../../app/store';
import { DeliPbuiWorkbench } from './DeliPbuiWorkbench';

const meta = {
  title: 'POC/Deli PBUI Workbench',
  component: DeliPbuiWorkbench,
  decorators: [
    (Story) => (
      <Provider store={setupStore()}>
        <Story />
      </Provider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Standalone PBUI/CLIM proof-of-concept: generic CLIM shell components, Street Deli domain registries, RTK Query fixture data, command/action bindings, Redux-backed PBUI session slice, and Tailwind styling in one widget entrypoint.',
      },
    },
  },
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function labelSpan(row: HTMLElement, text: string) {
  const span = Array.from(row.querySelectorAll('span')).find((candidate) => candidate.textContent?.includes(text));
  if (!span) {
    throw new Error(`Could not find label span containing ${text}`);
  }
  return span;
}

export const MenuMode: Story = {};

export const DetailMode: Story = {
  args: {
    initialView: 'detail',
    initialSelectedItemId: 'sandwich.hudson-classic',
  },
};

export const DetailSelectionHighlightsAction: Story = {
  args: {
    initialView: 'detail',
    initialSelectedItemId: 'sandwich.hudson-classic',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByTestId('detail-view');

    const tomato = await canvas.findByRole('button', { name: /tomato/ });
    const tomatoLabel = labelSpan(tomato, 'tomato');
    expect(getComputedStyle(tomatoLabel).color).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(tomatoLabel).animationName).toBe('none');

    await userEvent.click(tomato);

    expect(getComputedStyle(tomatoLabel).animationName).toBe('pulse');
    const removeIngredient = await canvas.findByRole('button', { name: 'REMOVE-INGREDIENT' });
    expect(removeIngredient.className).toContain('text-clim-danger');
    expect(await canvas.findByText('ACTION SLICE selected_action=none filled_slots=none')).toBeInTheDocument();
  },
};

export const DetailSelectModeFillsIngredientSlot: Story = {
  args: {
    initialView: 'detail',
    initialSelectedItemId: 'sandwich.hudson-classic',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByTestId('detail-view');

    const input = await canvas.findByLabelText('Action command');
    await userEvent.clear(input);
    await userEvent.type(input, 'remove ingredient{Enter}');

    expect(await canvas.findByText('ACTION SLICE selected_action=REMOVE-INGREDIENT filled_slots=none')).toBeInTheDocument();
    expect(getComputedStyle(await canvas.findByRole('button', { name: /sourdough/ })).cursor).toBe('default');
    expect(getComputedStyle(await canvas.findByRole('button', { name: /tomato/ })).cursor).toBe('pointer');

    await userEvent.click(await canvas.findByRole('button', { name: /tomato/ }));
    expect(await canvas.findByText('ACTION SLICE selected_action=none filled_slots=ingredient=<Ingredient>#ingredient.tomato')).toBeInTheDocument();
  },
};

export const CartMode: Story = {
  args: {
    initialView: 'cart',
    initialSelectedItemId: 'sandwich.hudson-classic',
    initialCart: true,
  },
};

export const HelpMode: Story = {
  args: {
    initialView: 'help',
  },
};

export const PlaceOrderConfirmFlow: Story = {
  args: {
    initialView: 'detail',
    initialSelectedItemId: 'sandwich.hudson-classic',
    initialCart: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for cart to be seeded
    await canvas.findByText(/Hudson Classic/);

    // Navigate to cart via command line
    const input = await canvas.findByLabelText('Action command');
    await userEvent.clear(input);
    await userEvent.type(input, 'CART{Enter}');

    // Place order triggers confirm
    await userEvent.clear(input);
    await userEvent.type(input, 'PLACE-ORDER{Enter}');

    // Confirm modal should appear
    const confirmBtn = await canvas.findByRole('button', { name: /CONFIRM PLACE-ORDER/ });
    expect(confirmBtn).toBeInTheDocument();
  },
};
