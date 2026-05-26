import type { DeliViewModelDefinition } from '../../../../domain/deli/viewModels';

export interface DeliViewHeaderProps {
  view: DeliViewModelDefinition;
  /** Active filter labels to display, e.g. ["SEARCH: hudson", "CATEGORY: sandwich"] */
  activeFilters?: string[];
}
