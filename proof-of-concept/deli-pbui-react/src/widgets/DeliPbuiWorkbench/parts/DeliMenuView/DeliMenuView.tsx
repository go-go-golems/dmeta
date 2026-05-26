import { presentationVisualState } from '../../../../generic/clim/actionEngine';
import { PbuiPresentationRef } from '../../../../generic/clim/components/PbuiPresentationRef';
import { menuItemPresentation } from '../../../../domain/deli/pbuiPresentations';
import type { DeliMenuViewProps } from './types';

export function DeliMenuView({
  menu,
  selectedItemId,
  activeSelected,
  pendingAction,
  filledArgs,
  actionContext,
  onPresentationClick,
  onPresentationContextMenu,
  selectMode,
}: DeliMenuViewProps) {
  return (
    <div className="grid gap-1" data-testid="menu-view">
      {menu.map((item) => {
        const presentation = menuItemPresentation(item);
        const visual = presentationVisualState({
          presentation,
          selected: activeSelected?.id === presentation.id ? activeSelected : selectedItemId === item.id ? presentation : activeSelected,
          selectedAction: selectMode ? pendingAction : undefined,
          filledArgs,
          context: actionContext,
        });
        return (
          <PbuiPresentationRef
            key={item.id}
            presentation={presentation}
            state={visual}
            onSelect={visual.selectable || !selectMode ? () => onPresentationClick(presentation) : undefined}
            onContextMenu={onPresentationContextMenu ? (e) => {
              e.preventDefault();
              onPresentationContextMenu(presentation, e.clientX, e.clientY);
            } : undefined}
          />
        );
      })}
    </div>
  );
}
