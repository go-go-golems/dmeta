import type { DeliHelpViewProps } from './types';

export function DeliHelpView({ actions }: DeliHelpViewProps) {
  return (
    <div className="grid gap-2 text-sm" data-testid="help-view">
      {actions.map((action) => (
        <div key={action.id} className="py-1">
          <span className="text-clim-bright">{action.id}</span>{' '}
          <span className="text-clim-muted">-&gt; {action.args.map((arg) => `${arg.name}:${arg.kind === 'ref' ? arg.objectType : arg.valueType}`).join(', ') || 'no args'}</span>
          <div>{action.description}</div>
        </div>
      ))}
    </div>
  );
}
