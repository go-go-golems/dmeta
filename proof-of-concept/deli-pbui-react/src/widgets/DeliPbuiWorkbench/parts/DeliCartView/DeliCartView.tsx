import { PbuiPresentationRef } from '../../../../generic/clim/components/PbuiPresentationRef';
import type { DeliCartViewProps } from './types';

export function DeliCartView({ cart, cartItems }: DeliCartViewProps) {
  return (
    <div className="grid gap-2" data-testid="cart-view">
      <PbuiPresentationRef presentation={cart} selected selectable={false} />
      {cartItems.length === 0 ? (
        <div className="text-clim-muted">Cart is empty. Use CUSTOMIZE then ADD-TO-ORDER to create an item.</div>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="py-1">
            <span className="text-clim-bright">&lt;OrderItem&gt;</span> {item.item.name}{' '}
            <span className="text-clim-muted">${item.item.price.toFixed(2)}</span>
            {item.removedIngredientIds.length > 0 ? (
              <span className="text-clim-danger"> removed: {item.removedIngredientIds.join(', ')}</span>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
}
