import type { PresentationRef } from '../../../../generic/clim/types';
import type { DeliCartItem } from '../../../../domain/deli/types';

export interface DeliCartViewProps {
  cart: PresentationRef<'Order'>;
  cartItems: DeliCartItem[];
}
