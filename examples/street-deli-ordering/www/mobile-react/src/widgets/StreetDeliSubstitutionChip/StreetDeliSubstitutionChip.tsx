/**
 * StreetDeliSubstitutionChip
 *
 * Reflection-first scaffold promoted from `deli.substitution_chip`.
 * Selected because: Replacement suggestions need a compact reusable action presentation.
 *
 * Semantic context:
 * - Archetype: SubstitutionSuggestion
 * - Capability: role_preserving_substitutable, dietary_substitutable, price_aware_substitutable
 */

import type { SubstitutionCandidateViewModel } from '../../view-models/types';
import { formatPrice } from '../../engine/substitutionEngine';
import { StreetDeliRoleTag } from '../StreetDeliRoleTag';
import styles from './StreetDeliSubstitutionChip.module.css';

type StreetDeliSubstitutionChipProps = {
  originalName: string;
  candidate: SubstitutionCandidateViewModel;
  onApply: () => void;
};

export function StreetDeliSubstitutionChip({ originalName, candidate, onApply }: StreetDeliSubstitutionChipProps) {
  const priceClass = candidate.priceDeltaCents > 0 ? styles.pricePositive : styles.priceZero;
  const priceText = candidate.priceDeltaCents > 0
    ? `+${formatPrice(candidate.priceDeltaCents)}`
    : 'no extra';

  return (
    <div
      className={`${styles.subCard} ${candidate.auto ? styles.autoSuggest : ''}`}
      onClick={onApply}
    >
      <span className={styles.subOriginal}>{originalName}</span>
      <span className={styles.subArrow}>→</span>
      <span className={styles.subReplacement}>{candidate.name}</span>
      <div className={styles.subMeta}>
        <span className={priceClass}>{priceText}</span>
        <div className={styles.subRolesMini}>
          {candidate.roles.slice(0, 3).map(r => <StreetDeliRoleTag key={r} role={r} />)}
        </div>
      </div>
    </div>
  );
}

export default StreetDeliSubstitutionChip;
