import type { CompatibilityRuleRegistry } from '../../generic/clim/compatibilityRules';
import type { DeliCommandId } from './types';

export const deliCompatibilityRules: CompatibilityRuleRegistry<DeliCommandId> = {
  CUSTOMIZE: {
    input: 'item_ref',
    acceptedTypes: ['MenuItem'],
    requiredCapabilities: ['composable'],
  },
  'REMOVE-INGREDIENT': {
    input: 'part_ref',
    acceptedTypes: ['Ingredient'],
    requiredCapabilities: ['removable'],
    metadata: {
      removed: { notEquals: 'yes' },
    },
  },
  APPLY: {
    input: 'replacement_candidate_ref',
    acceptedTypes: ['Ingredient'],
    requiredCapabilities: ['substitution-candidate'],
  },
  DESCRIBE: {
    input: 'subject_ref',
  },
};
