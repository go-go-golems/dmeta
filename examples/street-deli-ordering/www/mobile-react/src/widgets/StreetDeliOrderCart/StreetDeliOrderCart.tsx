/**
 * StreetDeliOrderCart
 *
 * Reflection-first scaffold promoted from `deli.order_cart`.
 * Cart review and submission surface.
 *
 * @see www/mobile/app.js → renderCart
 */

import type { CartItemViewModel } from '../../view-models/types';
import { formatPrice } from '../../engine/substitutionEngine';
import styles from './StreetDeliOrderCart.module.css';

type StreetDeliOrderCartProps = {
  items: CartItemViewModel[];
  onRemoveItem: (cartItemId: number) => void;
  onSubmitOrder: () => void;
  onBack: () => void;
};

export function StreetDeliOrderCart({ items, onRemoveItem, onSubmitOrder, onBack }: StreetDeliOrderCartProps) {
  const totalCents = items.reduce((sum, item) => sum + item.totalPriceCents, 0);

  return (
    <div>
      <header className={styles.screenHeader}>
        <button className={styles.backBtn} onClick={onBack}>← Menu</button>
        <h2 className={styles.screenTitle}>Your Order</h2>
      </header>

      <div className={styles.cartItems}>
        {items.map(item => {
          const subs = item.composition.filter(i => i.substitution);
          const removed = item.composition.filter(i => i.removed && !i.substitution);
          const configStr = Object.values(item.config).join(' · ');

          return (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.cartItemHeader}>
                <div>
                  <div className={styles.cartItemName}>{item.menuItem.name}</div>
                  {configStr && <div className={styles.cartItemConfig}>{configStr}</div>}
                </div>
                <div className={styles.cartItemPrice}>{formatPrice(item.totalPriceCents)}</div>
              </div>
              {(subs.length > 0 || removed.length > 0) && (
                <div className={styles.cartItemSubs}>
                  {subs.map(i => (
                    <div key={i.id} className={styles.cartSubLine}>
                      ↳ {i.name} → {i.substitution!.name}
                    </div>
                  ))}
                  {removed.map(i => (
                    <div key={i.id} className={styles.cartSubLineRemoved}>
                      {i.name} removed
                    </div>
                  ))}
                </div>
              )}
              <button className={styles.cartRemoveBtn} onClick={() => onRemoveItem(item.id)}>
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.cartFooter}>
        <div className={styles.cartTotalRow}>
          <span>Total</span>
          <span className={styles.cartTotalPrice}>{formatPrice(totalCents)}</span>
        </div>
        <button className={styles.placeOrderBtn} onClick={onSubmitOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}

export default StreetDeliOrderCart;
