import type { ActionRequest, CommandBinding } from './types';

export interface PbuiCommandHandlerContext<
  TCommand extends string = string,
  TAction extends string = string,
  TEnvironment = unknown,
> {
  binding: CommandBinding<TCommand, TAction>;
  request: ActionRequest<TAction>;
  environment: TEnvironment;
}

export interface PbuiCommandHandlerResult {
  handled: boolean;
  resultLine?: string;
}

export type PbuiCommandHandler<
  TCommand extends string = string,
  TAction extends string = string,
  TEnvironment = unknown,
> = (context: PbuiCommandHandlerContext<TCommand, TAction, TEnvironment>) => PbuiCommandHandlerResult | void;

export type PbuiCommandHandlerRegistry<
  TCommand extends string = string,
  TAction extends string = string,
  TEnvironment = unknown,
> = Record<string, PbuiCommandHandler<TCommand, TAction, TEnvironment>>;

export function runCommandHandler<
  TCommand extends string = string,
  TAction extends string = string,
  TEnvironment = unknown,
>({
  registry,
  binding,
  request,
  environment,
}: {
  registry: PbuiCommandHandlerRegistry<TCommand, TAction, TEnvironment>;
  binding: CommandBinding<TCommand, TAction>;
  request: ActionRequest<TAction>;
  environment: TEnvironment;
}): PbuiCommandHandlerResult {
  const handler = registry[binding.handler];
  if (!handler) {
    return {
      handled: false,
      resultLine: `No PBUI command handler registered for ${binding.handler}.`,
    };
  }

  const result = handler({ binding, request, environment });
  return result ?? { handled: true };
}
