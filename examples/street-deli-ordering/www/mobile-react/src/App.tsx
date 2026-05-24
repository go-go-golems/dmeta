/**
 * Street Deli Mobile Ordering App -- Main entry point.
 *
 * State-based screen routing:
 * - menu: DietaryFilterBar + StreetDeliMenuBrowser
 * - cart: StreetDeliOrderCart
 * - tracker: StreetDeliOrderTracker
 *
 * Customizer is a BottomSheet overlay on the menu screen.
 */

import { useEffect, useCallback } from 'react';
import { DeliProvider, useDeli } from './state/DeliContext';
import type { DietaryTag, MenuCategoryViewModel } from './view-models/types';
import { DietaryFilterBar } from './surfaces/DietaryFilterBar';
import { BottomSheet } from './surfaces/BottomSheet';
import { StreetDeliMenuBrowser } from './widgets/StreetDeliMenuBrowser';
import { StreetDeliCompositionCustomizer } from './widgets/StreetDeliCompositionCustomizer';
import { StreetDeliOrderCart } from './widgets/StreetDeliOrderCart';
import { StreetDeliOrderTracker } from './widgets/StreetDeliOrderTracker';
import { formatPrice } from './engine/substitutionEngine';
import styles from './App.module.css';

function AppContent() {
  const { state, dispatch } = useDeli();

  // Auto-advance tracker steps
  useEffect(() => {
    if (state.activeScreen !== 'tracker' || !state.placedOrder) return;
    if (state.placedOrder.currentStep === 'picked_up') return;
    const timer = setTimeout(() => {
      dispatch({ type: 'ADVANCE_TRACKER_STEP' });
    }, 2500);
    return () => clearTimeout(timer);
  }, [state.activeScreen, state.placedOrder?.currentStep, dispatch]);

  const handleSelectItem = useCallback((itemId: string) => {
    dispatch({ type: 'OPEN_CUSTOMIZER', itemId });
  }, [dispatch]);

  const handleRemoveIngredient = useCallback((ingredientId: string) => {
    dispatch({ type: 'REMOVE_INGREDIENT', ingredientId });
  }, [dispatch]);

  const handleUndoIngredient = useCallback((ingredientId: string) => {
    dispatch({ type: 'UNDO_INGREDIENT', ingredientId });
  }, [dispatch]);

  const handleApplySubstitution = useCallback((ingredientId: string, candidateIndex: number) => {
    dispatch({ type: 'APPLY_SUBSTITUTION', ingredientId, candidateIndex });
  }, [dispatch]);

  const handleChangeConfig = useCallback((key: string, value: string) => {
    dispatch({ type: 'CHANGE_CONFIG', key, value });
  }, [dispatch]);

  const handleAddToOrder = useCallback(() => {
    dispatch({ type: 'ADD_TO_ORDER' });
  }, [dispatch]);

  const handleToggleDietary = useCallback((tag: DietaryTag) => {
    dispatch({ type: 'TOGGLE_DIETARY', tag });
  }, [dispatch]);

  const handleSelectCategory = useCallback((category: MenuCategoryViewModel['id']) => {
    dispatch({ type: 'SET_ACTIVE_CATEGORY', category });
  }, [dispatch]);

  const cartTotalCents = state.cart.reduce((sum, item) => sum + item.totalPriceCents, 0);

  return (
    <div className={styles.app}>
      {state.activeScreen === 'menu' && (
        <>
          <DietaryFilterBar
            activeDietary={state.activeDietary}
            onToggle={handleToggleDietary}
          />
          <StreetDeliMenuBrowser
            activeCategory={state.activeCategory}
            activeDietary={state.activeDietary}
            onSelectCategory={handleSelectCategory}
            onSelectItem={handleSelectItem}
          />
          {state.cart.length > 0 && (
            <button
              className={styles.cartFab}
              onClick={() => dispatch({ type: 'SHOW_CART' })}
            >
              <span className={styles.cartFabCount}>{state.cart.length}</span>
              <span className={styles.cartFabLabel}>View Order</span>
              <span className={styles.cartFabTotal}>{formatPrice(cartTotalCents)}</span>
            </button>
          )}
          <BottomSheet
            open={!!state.customizing}
            onClose={() => dispatch({ type: 'CLOSE_CUSTOMIZER' })}
          >
            {state.customizing && (
              <StreetDeliCompositionCustomizer
                draft={state.customizing}
                onRemoveIngredient={handleRemoveIngredient}
                onUndoIngredient={handleUndoIngredient}
                onApplySubstitution={handleApplySubstitution}
                onChangeConfig={handleChangeConfig}
                onAddToOrder={handleAddToOrder}
              />
            )}
          </BottomSheet>
        </>
      )}

      {state.activeScreen === 'cart' && (
        <StreetDeliOrderCart
          items={state.cart}
          onRemoveItem={(id) => dispatch({ type: 'REMOVE_CART_ITEM', cartItemId: id })}
          onSubmitOrder={() => dispatch({ type: 'PLACE_ORDER' })}
          onBack={() => dispatch({ type: 'BACK_TO_MENU' })}
        />
      )}

      {state.activeScreen === 'tracker' && state.placedOrder && (
        <StreetDeliOrderTracker
          orderNumber={state.placedOrder.orderNumber}
          currentStep={state.placedOrder.currentStep}
          onBack={() => dispatch({ type: 'BACK_TO_MENU' })}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <DeliProvider>
      <AppContent />
    </DeliProvider>
  );
}

export default App;
