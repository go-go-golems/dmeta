import { PbuiAction } from '../PbuiAction';
import type { PbuiActionBarProps } from './types';

export function PbuiActionBar({ actions, selectedCommandLabel, className, onInvoke }: PbuiActionBarProps) {
  return (
    <div className={['py-2 my-3 text-sm', className].filter(Boolean).join(' ')}>
      {actions.map((action) => (
        <PbuiAction
          key={action.commandLabel ?? action.action.id}
          action={action}
          selected={(action.commandLabel ?? action.action.id) === selectedCommandLabel}
          className="mr-3"
          onInvoke={() => onInvoke?.(action)}
        />
      ))}
    </div>
  );
}
