export type CommandParseResult<TCommand extends string = string> =
  | { kind: 'empty'; original: string }
  | { kind: 'confirm'; original: string }
  | { kind: 'cancel'; original: string }
  | { kind: 'action'; commandId: TCommand; args: string[]; original: string }
  | { kind: 'unknown'; command: string; original: string }
  | { kind: 'prefix'; command: string; value: string; original: string }
  | { kind: 'missing-argument'; command: string; example: string; original: string };

export interface PrefixCommandHelp {
  id: string;
  args: string;
  description: string;
  example: string;
}

const CONFIRM_WORDS = new Set(['YES', 'Y', 'CONFIRM', 'OK']);
const CANCEL_WORDS = new Set(['NO', 'N', 'CANCEL', 'ESC', 'ESCAPE', 'ABORT']);

let prefixCommandRegistry: PrefixCommandHelp[] = [];

export function registerPrefixCommands(commands: PrefixCommandHelp[]) {
  prefixCommandRegistry = commands;
}

export function getPrefixCommandHelp(): PrefixCommandHelp[] {
  return prefixCommandRegistry;
}

export function normalizeCommandKey(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '-');
}

export function parseCommandLine<TCommand extends string>(
  input: string,
  commandIds: readonly TCommand[],
): CommandParseResult<TCommand> {
  const original = input;
  const trimmed = input.trim();
  if (!trimmed) {
    return { kind: 'empty', original };
  }

  const [head, ...args] = trimmed.split(/\s+/);
  const normalizedHead = normalizeCommandKey(head);
  const upper = trimmed.toUpperCase();

  if (CONFIRM_WORDS.has(upper)) {
    return { kind: 'confirm', original };
  }
  if (CANCEL_WORDS.has(upper)) {
    return { kind: 'cancel', original };
  }

  // Check prefix commands before action lookup
  for (const pc of prefixCommandRegistry) {
    const prefix = `${pc.id} `;
    if (upper === pc.id) {
      return { kind: 'missing-argument', command: pc.id, example: pc.example, original };
    }
    if (upper.startsWith(prefix)) {
      const value = trimmed.slice(prefix.length).trim();
      if (!value) {
        return { kind: 'missing-argument', command: pc.id, example: pc.example, original };
      }
      return { kind: 'prefix', command: pc.id, value, original };
    }
  }

  const exactWhole = commandIds.find((command) => command === normalizedHead);
  if (exactWhole) {
    return { kind: 'action', commandId: exactWhole as TCommand, args: [], original };
  }

  const normalizedWhole = normalizeCommandKey(trimmed);
  const exactWholeMulti = commandIds.find((command) => command === normalizedWhole);
  if (exactWholeMulti) {
    return { kind: 'action', commandId: exactWholeMulti as TCommand, args: [], original };
  }

  const exactHead = commandIds.find((command) => command === normalizedHead);
  if (exactHead) {
    return { kind: 'action', commandId: exactHead as TCommand, args, original };
  }

  return { kind: 'unknown', command: trimmed, original };
}
