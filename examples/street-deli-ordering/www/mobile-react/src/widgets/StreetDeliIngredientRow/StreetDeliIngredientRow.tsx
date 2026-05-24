/**
 * StreetDeliIngredientRow
 *
 * Reflection-first scaffold promoted from `deli.ingredient_row`.
 * Selected because: Customizer needs explicit ingredient rows with remove/substitute actions.
 *
 * @see www/mobile/styles.css → .ingredient-row
 */

import type { IngredientState } from '../../view-models/types';
import { StreetDeliRoleTag } from '../StreetDeliRoleTag';
import { dietaryBadgeColors } from '../../design-tokens/tokens';
import { dmetaAttrs } from '../../design-tokens/dataAttributes';
import styles from './StreetDeliIngredientRow.module.css';

const DIETARY_DISPLAY: Record<string, { tag: string; cls: string }> = {
  vegan: { tag: 'V', cls: 'v' },
  vegetarian: { tag: 'VG', cls: 'vg' },
  gluten_free: { tag: 'GF', cls: 'gf' },
  dairy_free: { tag: 'DF', cls: 'df' },
  nut_free: { tag: 'NF', cls: 'nf' },
};

type StreetDeliIngredientRowProps = {
  ingredient: IngredientState;
  onRemove: (ingredientId: string) => void;
  onUndo: (ingredientId: string) => void;
};

export function StreetDeliIngredientRow({ ingredient, onRemove, onUndo }: StreetDeliIngredientRowProps) {
  const { id, name, roles, dietary, removed, substitution } = ingredient;

  if (substitution) {
    return (
      <div
        className={`${styles.ingredientRow} ${styles.substituted}`}
        {...dmetaAttrs({ domainType: 'SubstitutionSuggestion', capabilities: ['role_preserving_substitutable'] })}
      >
        <button className={styles.ingUndo} onClick={() => onUndo(id)} title="Undo substitution">↶</button>
        <span className={styles.ingName}>
          {substitution.name} <span className={styles.ingWas}>(was {name})</span>
        </span>
        <span className={styles.ingRoles}>
          {substitution.roles.map(r => <StreetDeliRoleTag key={r} role={r} />)}
        </span>
        {substitution.dietary.map(d => {
          const disp = DIETARY_DISPLAY[d];
          if (!disp) return null;
          const c = dietaryBadgeColors[disp.cls];
          return (
            <span key={d} className={styles.dietaryBadgeSmall} style={c ? { background: c.bg, color: c.text, borderColor: c.border } : undefined}>
              {disp.tag}
            </span>
          );
        })}
      </div>
    );
  }

  if (removed) {
    return (
      <div className={`${styles.ingredientRow} ${styles.removed}`}>
        <button className={styles.ingRestore} onClick={() => onUndo(id)} title="Undo remove">+</button>
        <span className={styles.ingName}>{name}</span>
      </div>
    );
  }

  return (
    <div
      className={styles.ingredientRow}
      {...dmetaAttrs({ domainType: 'Ingredient', capabilities: ['identifiable', 'labelable', 'dietary'] })}
    >
      <button className={styles.ingRemove} onClick={() => onRemove(id)} title={`Remove ${name}`}>−</button>
      <span className={styles.ingName}>{name}</span>
      <span className={styles.ingRoles}>
        {roles.map(r => <StreetDeliRoleTag key={r} role={r} />)}
      </span>
      {dietary.map(d => {
        const disp = DIETARY_DISPLAY[d];
        if (!disp) return null;
        const c = dietaryBadgeColors[disp.cls];
        return (
          <span key={d} className={styles.dietaryBadgeSmall} style={c ? { background: c.bg, color: c.text, borderColor: c.border } : undefined}>
            {disp.tag}
          </span>
        );
      })}
    </div>
  );
}

export default StreetDeliIngredientRow;
