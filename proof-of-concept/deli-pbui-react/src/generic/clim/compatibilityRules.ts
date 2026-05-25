import type { CommandBinding, PresentationRef } from './types';

export type PresentationMetadataValue = string | number | string[] | undefined;

export interface MetadataCompatibilityConstraint {
  equals?: string | number;
  notEquals?: string | number;
  includes?: string;
}

export interface PresentationCompatibilityRule {
  /** The selected-presentation-backed action input this rule constrains. */
  input: string;
  /** Accepted semantic/presentation ref types, e.g. MenuItem or Ingredient. */
  acceptedTypes?: string[];
  /** Capabilities that must be present on the target PresentationRef. */
  requiredCapabilities?: string[];
  /** Metadata predicates evaluated against PresentationRef.metadata. */
  metadata?: Record<string, MetadataCompatibilityConstraint>;
}

export type CompatibilityRuleRegistry<TCommand extends string = string> = Partial<Record<TCommand, PresentationCompatibilityRule>>;

function metadataConstraintMatches(value: PresentationMetadataValue, constraint: MetadataCompatibilityConstraint): boolean {
  if (constraint.equals !== undefined && value !== constraint.equals) {
    return false;
  }
  if (constraint.notEquals !== undefined && value === constraint.notEquals) {
    return false;
  }
  if (constraint.includes !== undefined) {
    return Array.isArray(value) && value.includes(constraint.includes);
  }
  return true;
}

export function selectedPresentationInputForBinding(binding: CommandBinding): string | undefined {
  return Object.entries(binding.inputMapping).find(([, source]) => source === 'selected_presentation')?.[0];
}

export function compatibilityRuleForBinding<TCommand extends string, TAction extends string>(
  binding: CommandBinding<TCommand, TAction>,
  registry: CompatibilityRuleRegistry<TCommand>,
): PresentationCompatibilityRule | undefined {
  const rule = registry[binding.id];
  if (!rule) {
    return undefined;
  }
  const selectedInput = selectedPresentationInputForBinding(binding);
  if (selectedInput && rule.input !== selectedInput) {
    return undefined;
  }
  return rule;
}

export function canUsePresentationFromRules<TCommand extends string, TAction extends string>(
  binding: CommandBinding<TCommand, TAction>,
  presentation: PresentationRef,
  registry: CompatibilityRuleRegistry<TCommand>,
): boolean {
  const rule = compatibilityRuleForBinding(binding, registry);
  if (!rule) {
    return true;
  }

  if (rule.acceptedTypes && !rule.acceptedTypes.includes(presentation.type)) {
    return false;
  }

  for (const capability of rule.requiredCapabilities ?? []) {
    if (!presentation.capabilities.includes(capability)) {
      return false;
    }
  }

  for (const [key, constraint] of Object.entries(rule.metadata ?? {})) {
    if (!metadataConstraintMatches(presentation.metadata?.[key], constraint)) {
      return false;
    }
  }

  return true;
}

export function assertCompatibilityRuleCoverage<TCommand extends string, TAction extends string>(
  bindings: CommandBinding<TCommand, TAction>[],
  registry: CompatibilityRuleRegistry<TCommand>,
) {
  const missing = bindings
    .filter((binding) => selectedPresentationInputForBinding(binding))
    .filter((binding) => !registry[binding.id])
    .map((binding) => binding.id);

  if (missing.length > 0) {
    throw new Error(`Missing PBUI compatibility rules for selected-presentation commands: ${missing.join(', ')}`);
  }
}
