import { PbuiAction } from '../PbuiAction';
import type { PbuiActionBarProps } from './types';

export function PbuiActionBar({ actions, className, onInvoke }: PbuiActionBarProps) {
  return (
    <div className={['py-2 my-3 text-sm', className].filter(Boolean).join(' ')}>
      {actions.map((action) => (
        <PbuiAction
          key={`${action.commandLabel ?? action.descriptor.id}:${action.subject?.id ?? 'global'}`}
          action={action}
          className="mr-3"
          onInvoke={() => onInvoke?.(action)}
        />
      ))}
    </div>
  );
}
