import type { ActionPresentation } from '../../types';
import type { PrefixCommandHelp } from '../../commandParser';
import { PbuiSectionLabel } from '../PbuiSectionLabel';

export interface PbuiHelpViewProps {
  actions: ActionPresentation[];
  prefixCommands?: PrefixCommandHelp[];
  className?: string;
}

export function PbuiHelpView({
  actions,
  prefixCommands = [],
  className,
}: PbuiHelpViewProps) {
  const noArgActions = actions.filter((a) => a.action.args.length === 0);
  const argActions = actions.filter((a) => a.action.args.length > 0);

  return (
    <div className={[className].filter(Boolean).join(' ')}>
      <PbuiSectionLabel>Available Commands</PbuiSectionLabel>

      {noArgActions.length > 0 ? (
        <>
          <PbuiSectionLabel className="mt-2">Navigation</PbuiSectionLabel>
          {noArgActions.map((ap) => (
            <div key={ap.action.id} className="py-0.5">
              <span className={ap.requiresConfirmation ? 'text-clim-danger' : 'text-clim-bright'}>
                {ap.action.id}{ap.requiresConfirmation ? ' ⚠' : ''}
              </span>
              <span className="text-clim-muted ml-2">(no args)</span>
              <span className="text-clim-muted ml-2">— {ap.action.description}</span>
            </div>
          ))}
        </>
      ) : null}

      {argActions.length > 0 ? (
        <>
          <PbuiSectionLabel className="mt-2">Targeted Actions</PbuiSectionLabel>
          {argActions.map((ap) => {
            const argTypes = ap.action.args
              .map((a) => (a.kind === 'ref' ? `<${a.objectType}>` : a.valueType))
              .join(' | ');
            return (
              <div key={ap.action.id} className="py-0.5">
                <span className={ap.requiresConfirmation ? 'text-clim-danger' : 'text-clim-bright'}>
                  {ap.action.id}{ap.requiresConfirmation ? ' ⚠' : ''}
                </span>
                <span className="text-clim-muted ml-2">{argTypes}</span>
                <span className="text-clim-muted ml-2">— {ap.action.description}</span>
              </div>
            );
          })}
        </>
      ) : null}

      {prefixCommands.length > 0 ? (
        <>
          <PbuiSectionLabel className="mt-2">Prefix Commands</PbuiSectionLabel>
          {prefixCommands.map((pc) => (
            <div key={pc.id} className="py-0.5">
              <span className="text-clim-bright">{pc.id}</span>
              <span className="text-clim-muted ml-2">{pc.args}</span>
              <span className="text-clim-muted ml-2">— {pc.description}</span>
              <span className="text-clim-muted ml-2">Example: {pc.example}</span>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}
