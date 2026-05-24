/**
 * DietaryFilterBar -- sticky filter bar with dietary chip pills.
 *
 * @see www/mobile/styles.css → #dietary-bar
 */

import type { DietaryTag } from '../view-models/types';
import styles from './DietaryFilterBar.module.css';

const DIETARY_CHIPS: { tag: DietaryTag; label: string }[] = [
  { tag: 'vegan', label: 'V' },
  { tag: 'vegetarian', label: 'VG' },
  { tag: 'gluten_free', label: 'GF' },
  { tag: 'dairy_free', label: 'DF' },
  { tag: 'nut_free', label: 'NF' },
];

type DietaryFilterBarProps = {
  activeDietary: Set<string>;
  onToggle: (tag: DietaryTag) => void;
};

export function DietaryFilterBar({ activeDietary, onToggle }: DietaryFilterBarProps) {
  return (
    <div className={styles.dietaryBar}>
      <div className={styles.dietaryFilters}>
        {DIETARY_CHIPS.map(({ tag, label }) => (
          <button
            key={tag}
            className={`${styles.dietaryChip} ${activeDietary.has(tag) ? styles.active : ''}`}
            onClick={() => onToggle(tag)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
