import type { ActionPresentation, LifecycleStep, PresentationRef } from '../../clim/types';
import { menuItemPresentation, removeIngredientAction, trackerSteps } from '../../fixtures/presentationFixtures';

export interface LifecycleStatusBlockProps {
  presentation?: PresentationRef;
  action?: ActionPresentation;
  steps?: LifecycleStep[];
  selected?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  title?: string;
}

export function LifecycleStatusBlock({ presentation = menuItemPresentation, action = removeIngredientAction, steps = trackerSteps, selected = false, selectable = false, disabled = false, title = 'LifecycleStatusBlock' }: LifecycleStatusBlockProps) {
  const className = ['pres', 'pres-block', selected ? 'selected' : '', selectable ? 'selectable' : '', disabled ? 'select-disabled' : '', action.dangerous ? 'pres-danger' : ''].filter(Boolean).join(' ');
  if (title.includes('Lifecycle')) {
    return <div className="pres-block">{steps.map((step) => <div className={'tracker-step ' + step.state} key={step.id}>{step.label}</div>)}</div>;
  }
  if (title.includes('Action')) {
    return <span className={className}><span className="action">{action.label}</span> <span className="role">{action.description}</span></span>;
  }
  return <div className={className}><span className="pres-type">&lt;{presentation.type}&gt;</span> {presentation.label} <span className="pres-id">#{presentation.id}</span> <span className="role">{presentation.capabilities?.join(' ')}</span></div>;
}
