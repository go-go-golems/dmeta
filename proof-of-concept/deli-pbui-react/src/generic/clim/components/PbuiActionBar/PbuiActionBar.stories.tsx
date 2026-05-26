import type { Meta, StoryObj } from '@storybook/react-vite';
import { actionIntents } from '../../actionEngine';
import { PbuiActionBar } from './PbuiActionBar';
import type { ActionPresentation, ActionSpec } from '../../types';

function makeAp(action: ActionSpec, overrides?: Partial<ActionPresentation>): ActionPresentation {
  return {
    action,
    commandLabel: action.label,
    intents: actionIntents(action),
    requiresConfirmation: Boolean(action.requiresConfirmation),
    ...overrides,
  };
}

const removeAction: ActionSpec = {
  id: 'REMOVE-INGREDIENT',
  label: 'REMOVE-INGREDIENT',
  description: 'Remove an ingredient.',
  views: ['detail'],
  args: [{ name: 'ingredient', kind: 'ref', objectType: 'Ingredient' }],
  run: () => undefined,
};

const placeOrderAction: ActionSpec = {
  id: 'PLACE-ORDER',
  label: 'PLACE-ORDER',
  description: 'Submit order.',
  views: ['cart'],
  args: [],
  requiresConfirmation: true,
  run: () => undefined,
};

const backAction: ActionSpec = {
  id: 'BACK',
  label: 'BACK',
  description: 'Go back.',
  views: ['detail', 'cart'],
  args: [],
  run: () => undefined,
};

const helpAction: ActionSpec = {
  id: 'HELP',
  label: 'HELP',
  description: 'Show help.',
  views: ['menu', 'detail'],
  args: [],
  run: () => undefined,
};

const menuActions: ActionPresentation[] = [
  makeAp({ id: 'CUSTOMIZE', label: 'CUSTOMIZE', description: 'Customize item.', views: ['menu'], args: [{ name: 'item', kind: 'ref', objectType: 'MenuItem' }], run: () => undefined }),
  makeAp({ id: 'CART', label: 'CART', description: 'View cart.', views: ['menu'], args: [], run: () => undefined }),
  makeAp(helpAction),
];

const detailActions: ActionPresentation[] = [
  makeAp(removeAction),
  makeAp({ id: 'ADD-TO-ORDER', label: 'ADD-TO-ORDER', description: 'Add to order.', views: ['detail'], args: [], run: () => undefined }),
  makeAp(backAction),
  makeAp({ id: 'CART', label: 'CART', description: 'View cart.', views: ['detail'], args: [], run: () => undefined }),
  makeAp(helpAction),
];

const cartActions: ActionPresentation[] = [
  makeAp(placeOrderAction),
  makeAp(backAction),
  makeAp({ id: 'MENU', label: 'MENU', description: 'Back to menu.', views: ['cart'], args: [], run: () => undefined }),
  makeAp(helpAction),
];

export default {
  title: 'Generic/CLIM/PbuiActionBar',
  component: PbuiActionBar,
} as Meta<typeof PbuiActionBar>;

type Story = StoryObj<typeof PbuiActionBar>;

export const MenuView: Story = {
  render: () => <div className="bg-clim-bg p-4 font-mono"><PbuiActionBar actions={menuActions} onInvoke={() => {}} /></div>,
};

export const DetailView: Story = {
  render: () => <div className="bg-clim-bg p-4 font-mono"><PbuiActionBar actions={detailActions} selectedCommandLabel="REMOVE-INGREDIENT" onInvoke={() => {}} /></div>,
};

export const CartView: Story = {
  render: () => <div className="bg-clim-bg p-4 font-mono"><PbuiActionBar actions={cartActions} onInvoke={() => {}} /></div>,
};

export const WithDisabled: Story = {
  render: () => (
    <div className="bg-clim-bg p-4 font-mono">
      <PbuiActionBar
        actions={[
          makeAp(placeOrderAction, { disabledReason: 'Cart is empty.' }),
          makeAp(backAction),
        ]}
        onInvoke={() => {}}
      />
    </div>
  ),
};
