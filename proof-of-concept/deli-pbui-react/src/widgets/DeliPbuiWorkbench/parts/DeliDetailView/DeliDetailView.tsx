import { presentationVisualState } from '../../../../generic/clim/actionEngine';
import { PbuiPresentationRef } from '../../../../generic/clim/components/PbuiPresentationRef';
import { ingredientPresentation } from '../../../../domain/deli/pbuiPresentations';
import type { DeliDetailViewProps } from './types';

export function DeliDetailView({
  selectedItem,
  draft,
  removedIngredientIds,
  activeSelected,
  pendingAction,
  filledArgs,
  actionContext,
  onPresentationClick,
  selectMode,
}: DeliDetailViewProps) {
  return (
    <div className="grid gap-2" data-testid="detail-view">
      <div className="py-2">
        <div className="text-clim-muted text-xs uppercase tracking-wide">Composition draft</div>
        <div className="text-clim-bright">{selectedItem?.name}</div>
        <div className="text-clim-muted text-sm">{draft?.id}</div>
      </div>
      {selectedItem?.ingredients.map((ingredient) => {
        const removed = removedIngredientIds.includes(ingredient.id);
        const presentation = ingredientPresentation(ingredient, removed);
        const visual = presentationVisualState({
          presentation,
          selected: activeSelected,
          selectedAction: selectMode ? pendingAction : undefined,
          filledArgs,
          context: actionContext,
          removed,
        });
        return (
          <PbuiPresentationRef
            key={ingredient.id}
            presentation={presentation}
            state={visual}
            onSelect={visual.selectable || !selectMode ? () => onPresentationClick(presentation) : undefined}
          />
        );
      })}
    </div>
  );
}
