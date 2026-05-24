/**
 * StreetDeliCompositionCard
 *
 * Reflection-first scaffold promoted from `deli.composition_card`.
 * Selected because: Sandwiches and bowls need compact composition summaries with dietary and price data.
 *
 * Semantic context:
 * - Archetype: ProductComposition
 * - Capability: ingredient_composable, dietary, measurable, available
 * - Presentation: composition_card (role: summary_card)
 *
 * Projection hints (guidance, not rigid):
 * Recommended: labelable.label, measurable.value, ingredient_composable.parts, dietary.dietary_tags
 * Optional: available.availability_state, ingredient_composable.required_roles
 *
 * @see www/mobile/styles.css → .menu-card
 * @see generated/widgets/StreetDeliCompositionCard/StreetDeliCompositionCard.metadata.ts
 */

import type { MenuItemViewModel } from '../../view-models/types';
import { formatPrice } from '../../engine/substitutionEngine';
import { dietaryBadgeColors } from '../../design-tokens/tokens';
import { dmetaAttrs } from '../../design-tokens/dataAttributes';
import styles from './StreetDeliCompositionCard.module.css';

type StreetDeliCompositionCardProps = {
  item: MenuItemViewModel;
  onCustomize: (itemId: string) => void;
};

const DIETARY_TAG_DISPLAY: Record<string, { tag: string; cls: string }> = {
  vegan: { tag: 'V', cls: 'v' },
  vegetarian: { tag: 'VG', cls: 'vg' },
  gluten_free: { tag: 'GF', cls: 'gf' },
  dairy_free: { tag: 'DF', cls: 'df' },
  nut_free: { tag: 'NF', cls: 'nf' },
};

export function StreetDeliCompositionCard({ item, onCustomize }: StreetDeliCompositionCardProps) {
  const ingNames = item.ingredients.map(i => i.name).join(', ');
  const badges = item.dietary
    .map(tag => DIETARY_TAG_DISPLAY[tag])
    .filter(Boolean);

  return (
    <div
      className={styles.menuCard}
      onClick={() => onCustomize(item.id)}
      {...dmetaAttrs({
        widget: 'deli.composition_card',
        domainType: 'MenuItem',
        archetypes: ['ProductComposition'],
        capabilities: ['ingredient_composable', 'dietary', 'measurable', 'available'],
        presentation: 'composition_card',
      })}
    >
      <div className={styles.menuCardTop}>
        <div className={styles.menuCardName}>{item.name}</div>
        <div className={styles.menuCardPrice}>{formatPrice(item.basePriceCents)}</div>
      </div>
      <div className={styles.menuCardDesc}>{item.description}</div>
      <div className={styles.menuCardIngredients}>{ingNames}</div>
      {badges.length > 0 && (
        <div className={styles.menuCardDietary}>
          {badges.map(b => {
            const colors_ = dietaryBadgeColors[b.cls] || { bg: '#EAF2E3', text: '#5B8C3E', border: 'rgba(91,140,62,0.2)' };
            return (
              <span
                key={b.cls}
                className={styles.dietaryBadge}
                style={{ background: colors_.bg, color: colors_.text, borderColor: colors_.border }}
              >
                {b.tag}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StreetDeliCompositionCard;
