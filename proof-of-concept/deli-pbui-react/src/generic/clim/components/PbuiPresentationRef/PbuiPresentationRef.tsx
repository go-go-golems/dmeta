import { PbuiClickableText } from '../PbuiClickableText';
import { PbuiText } from '../PbuiText';
import type { PbuiPresentationRefProps } from './types';

export function PbuiPresentationRef({
  presentation,
  state = {},
  selected,
  selectable,
  muted,
  disabled,
  className,
  onSelect,
}: PbuiPresentationRefProps) {
  const effectiveState = {
    ...state,
    selected: selected ?? state.selected,
    selectable: selectable ?? state.selectable,
    muted: muted ?? state.muted,
    disabled: disabled ?? state.disabled,
  };
  const interactive = Boolean((effectiveState.selectable || onSelect) && !effectiveState.disabled);
  const rowClasses = [
    'block w-full text-left px-0 py-1 transition-colors focus:outline-none',
    effectiveState.selected ? 'text-clim-bright' : 'text-clim-fg',
    effectiveState.muted ? 'opacity-35 line-through' : '',
    interactive ? 'cursor-pointer' : 'cursor-default',
    className,
  ].filter(Boolean).join(' ');
  const labelClasses = ['font-normal', effectiveState.selected ? 'animate-pulse' : ''].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      onClick={interactive ? onSelect : undefined}
      disabled={effectiveState.disabled}
      className={rowClasses}
      data-presentation-type={presentation.type}
      data-presentation-id={presentation.id}
    >
      <PbuiText tone="muted">&lt;{presentation.type}&gt;</PbuiText>{' '}
      {interactive ? (
        <PbuiClickableText as="span" tone="normal" className={labelClasses}>
          {presentation.label}
        </PbuiClickableText>
      ) : (
        <PbuiText tone={effectiveState.muted ? 'removed' : 'bright'} className={effectiveState.selected ? 'animate-pulse' : undefined}>{presentation.label}</PbuiText>
      )}{' '}
      <PbuiText tone="muted">#{presentation.id}</PbuiText>{' '}
      <PbuiText tone="muted">{presentation.capabilities.join(' ')}</PbuiText>
    </button>
  );
}
