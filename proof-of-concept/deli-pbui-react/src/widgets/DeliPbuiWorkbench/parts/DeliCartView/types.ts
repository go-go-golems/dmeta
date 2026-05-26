import type { PresentationRef } from '@go-go-golems/pbui';
import type { DeliCartItem } from '../../../../domain/deli/types';

export interface DeliCartViewProps {
  cart: PresentationRef<'Order'>;
  cartItems: DeliCartItem[];
}
