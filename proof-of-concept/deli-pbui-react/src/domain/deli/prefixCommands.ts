import type { PrefixCommandHelp } from '@go-go-golems/pbui';

export const DELI_PREFIX_COMMANDS: PrefixCommandHelp[] = [
  { id: 'SEARCH', args: '<query>', description: 'Search menu items by name or tag', example: 'SEARCH blta' },
  { id: 'CATEGORY', args: '<name>', description: 'Filter menu by category', example: 'CATEGORY sandwiches' },
  { id: 'DIET', args: '<tag>', description: 'Filter menu by dietary/allergen tag', example: 'DIET vegetarian' },
];
