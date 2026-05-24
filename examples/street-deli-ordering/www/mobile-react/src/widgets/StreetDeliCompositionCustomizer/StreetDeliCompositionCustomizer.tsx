/**
 * StreetDeliCompositionCustomizer
 *
 * Reflection-first scaffold promoted from `deli.composition_customizer`.
 * The full customization bottom-sheet surface.
 *
 * @see www/mobile/app.js → openCustomizer, renderCustomizer
 */

import type { CustomizingState } from '../../state/types';
import type { DietaryTag } from '../../view-models/types';
import { formatPrice, getSubstitutionCandidates, getAutoSuggestCandidates } from '../../engine/substitutionEngine';
import { CONFIG_OPTIONS } from '../../data/menuData';
import { StreetDeliIngredientRow } from '../StreetDeliIngredientRow';
import { StreetDeliSubstitutionChip } from '../StreetDeliSubstitutionChip';
import { dietaryBadgeColors } from '../../design-tokens/tokens';
import styles from './StreetDeliCompositionCustomizer.module.css';

const DIETARY_DISPLAY: Record<string, { tag: string; cls: string }> = {
  vegan: { tag: 'V', cls: 'v' },
  vegetarian: { tag: 'VG', cls: 'vg' },
  gluten_free: { tag: 'GF', cls: 'gf' },
  dairy_free: { tag: 'DF', cls: 'df' },
  nut_free: { tag: 'NF', cls: 'nf' },
};

type StreetDeliCompositionCustomizerProps = {
  draft: CustomizingState;
  onRemoveIngredient: (ingredientId: string) => void;
  onUndoIngredient: (ingredientId: string) => void;
  onApplySubstitution: (ingredientId: string, candidateIndex: number) => void;
  onChangeConfig: (key: string, value: string) => void;
  onAddToOrder: () => void;
};

export function StreetDeliCompositionCustomizer({
  draft,
  onRemoveIngredient,
  onUndoIngredient,
  onApplySubstitution,
  onChangeConfig,
  onAddToOrder,
}: StreetDeliCompositionCustomizerProps) {
  const { menuItem, composition, config, currentPriceCents } = draft;
  const removed = composition.filter(i => i.removed);
  const pending = removed.find(i => !i.substitution);

  // Collect all dietary tags
  const allDietaryTags = new Set<DietaryTag>();
  for (const ing of composition) {
    if (ing.removed && !ing.substitution) continue;
    const src = ing.substitution || ing;
    for (const t of src.dietary) allDietaryTags.add(t);
  }
  for (const t of menuItem.dietary) allDietaryTags.add(t);

  // Allergen warnings
  const baseAllergens = new Set(menuItem.allergens.map(a => a.toLowerCase()));
  const newAllergens: string[] = [];
  for (const ing of composition) {
    if (ing.substitution) {
      for (const a of ing.substitution.allergens) {
        if (!baseAllergens.has(a.toLowerCase())) {
          newAllergens.push(`${ing.substitution.name}: ${a}`);
        }
      }
    }
  }

  // Config options
  const opts = CONFIG_OPTIONS[menuItem.category] || [];

  return (
    <div className={styles.customizer}>
      <div className={styles.sheetHeader}>
        <h2 className={styles.custItemName}>{menuItem.name}</h2>
        <span className={styles.custPrice}>{formatPrice(currentPriceCents)}</span>
      </div>

      <div className={styles.custSection}>
        <h3 className={styles.custSectionTitle}>Ingredients</h3>
        <div className={styles.ingredientList}>
          {composition.map(ing => (
            <StreetDeliIngredientRow
              key={ing.id}
              ingredient={ing}
              onRemove={onRemoveIngredient}
              onUndo={onUndoIngredient}
            />
          ))}
        </div>
      </div>

      {pending && (
        <div className={styles.substitutionZone}>
          <h3 className={styles.custSectionTitle}>Smart Substitutions</h3>
          <p className={styles.substitutionHint}>
            You removed {pending.name}. Here are smart replacements that preserve its role in the sandwich:
          </p>
          <div className={styles.substitutionCards}>
            {(() => {
              const autoCandidates = getAutoSuggestCandidates(pending.id, 2);
              const allCandidates = getSubstitutionCandidates(pending.id);
              return (
                <>
                  {autoCandidates.map((candidate, idx) => (
                    <StreetDeliSubstitutionChip
                      key={candidate.name}
                      originalName={pending.name}
                      candidate={candidate}
                      onApply={() => onApplySubstitution(pending.id, idx)}
                    />
                  ))}
                  {allCandidates && allCandidates.length > 2 && (
                    <p className={styles.subTotalCount}>
                      {allCandidates.length} total options available
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {!pending && removed.length > 0 && (
        <div className={styles.substitutionZone}>
          <p className={styles.substitutionHint}>
            All removed ingredients have replacements applied. Tap a substituted ingredient to change.
          </p>
        </div>
      )}

      {opts.length > 0 && (
        <div className={styles.custSection}>
          <h3 className={styles.custSectionTitle}>Options</h3>
          <div className={styles.configControls}>
            {opts.map(opt => (
              <div key={opt.key} className={styles.configRow}>
                <span className={styles.configLabel}>{opt.label}</span>
                <div className={styles.configOptions}>
                  {opt.values.map(v => (
                    <button
                      key={v}
                      className={`${styles.configOpt} ${config[opt.key] === v ? styles.configOptActive : ''}`}
                      onClick={() => onChangeConfig(opt.key, v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allDietaryTags.size > 0 && (
        <div className={styles.custSection}>
          <h3 className={styles.custSectionTitle}>Dietary Info</h3>
          <div className={styles.dietarySummary}>
            {[...allDietaryTags].map(tag => {
              const disp = DIETARY_DISPLAY[tag];
              if (!disp) return null;
              const c = dietaryBadgeColors[disp.cls];
              return (
                <span
                  key={tag}
                  className={styles.dietaryBadge}
                  style={c ? { background: c.bg, color: c.text, borderColor: c.border } : undefined}
                >
                  {disp.tag}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {newAllergens.length > 0 && (
        <div className={styles.allergenWarning}>
          <span className={styles.allergenIcon}>⚠</span>
          <span>Substitution introduces: {newAllergens.join(', ')}</span>
        </div>
      )}

      <button className={styles.addToOrderBtn} onClick={onAddToOrder}>
        Add to Order -- {formatPrice(currentPriceCents)}
      </button>
    </div>
  );
}

export default StreetDeliCompositionCustomizer;
