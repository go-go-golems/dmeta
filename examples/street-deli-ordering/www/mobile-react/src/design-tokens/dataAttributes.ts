/**
 * DMETA data attribute helpers for Street Deli widgets.
 *
 * Every selectable presentation should carry enough runtime attributes
 * for testing, inspection, copy, context-menu routing, and typed
 * action argument collection.
 *
 * @see 02-design-language.yaml → data_attributes
 */

export type DmetaAttrOptions = {
  widget?: string;
  template?: string;
  variant?: string;
  domainType?: string;
  archetypes?: string[];
  capabilities?: string[];
  presentation?: string;
  semanticId?: string;
  label?: string;
  copyValue?: string;
  actionId?: string;
  actionCategory?: string;
};

/**
 * Build a Record<string, string> of data-dmeta-* attributes
 * suitable for spreading onto a React element.
 *
 * Usage:
 *   <div {...dmetaAttrs({ widget: 'deli.composition_card', domainType: 'MenuItem' })}>
 */
export function dmetaAttrs(opts: DmetaAttrOptions): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (opts.widget) attrs['data-dmeta-widget'] = opts.widget;
  if (opts.template) attrs['data-dmeta-template'] = opts.template;
  if (opts.variant) attrs['data-dmeta-variant'] = opts.variant;
  if (opts.domainType) attrs['data-dmeta-domain-type'] = opts.domainType;
  if (opts.archetypes?.length) attrs['data-dmeta-archetypes'] = opts.archetypes.join(' ');
  if (opts.capabilities?.length) attrs['data-dmeta-capabilities'] = opts.capabilities.join(' ');
  if (opts.presentation) attrs['data-dmeta-presentation'] = opts.presentation;
  if (opts.semanticId) attrs['data-dmeta-semantic-id'] = opts.semanticId;
  if (opts.label) attrs['data-dmeta-label'] = opts.label;
  if (opts.copyValue) attrs['data-dmeta-copy-value'] = opts.copyValue;
  if (opts.actionId) attrs['data-dmeta-action-id'] = opts.actionId;
  if (opts.actionCategory) attrs['data-dmeta-action-category'] = opts.actionCategory;
  return attrs;
}
