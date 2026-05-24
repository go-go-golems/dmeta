/**
 * StreetDeliRoleTag
 *
 * Reflection-first scaffold promoted from `deli.role_tag`.
 * Selected because: Ingredient roles are central to explaining substitutions and composition structure.
 *
 * Semantic context:
 * - No direct archetype/capability binding (pure visual rendering of a role label)
 *
 * This is the simplest widget -- an ultra-compact role tag pill
 * like PROTEIN, RICHNESS, CRUNCH.
 *
 * @see www/mobile/styles.css → .role-tag
 */

import type { IngredientRole } from '../../view-models/types';
import { roleColors, typography } from '../../design-tokens/tokens';
import styles from './StreetDeliRoleTag.module.css';

type StreetDeliRoleTagProps = {
  role: IngredientRole;
  className?: string;
};

export function StreetDeliRoleTag({ role, className }: StreetDeliRoleTagProps) {
  const colorSet = roleColors[role] || { bg: '#F5F0EB', text: '#A69E94' };
  return (
    <span
      className={`${styles.roleTag} ${className || ''}`}
      style={{
        background: colorSet.bg,
        color: colorSet.text,
        ...typography.roleTag,
      }}
    >
      {role}
    </span>
  );
}

export default StreetDeliRoleTag;
