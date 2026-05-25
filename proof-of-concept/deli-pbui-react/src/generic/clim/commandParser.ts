export type CommandParseResult<TCommand extends string = string> =
  | { kind: 'empty'; original: string }
  | { kind: 'confirm'; original: string }
  | { kind: 'cancel'; original: string }
  | { kind: 'action'; commandId: TCommand; args: string[]; original: string }
  | { kind: 'unknown'; command: string; original: string };

const CONFIRM_WORDS = new Set(['YES', 'Y', 'CONFIRM', 'OK']);
const CANCEL_WORDS = new Set(['NO', 'N', 'CANCEL', 'ESC', 'ESCAPE', 'ABORT']);

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
  const normalizedWhole = normalizeCommandKey(trimmed);

  if (CONFIRM_WORDS.has(normalizedWhole)) {
    return { kind: 'confirm', original };
  }
  if (CANCEL_WORDS.has(normalizedWhole)) {
    return { kind: 'cancel', original };
  }

  const exactWhole = commandIds.find((command) => command === normalizedWhole);
  if (exactWhole) {
    return { kind: 'action', commandId: exactWhole, args: [], original };
  }

  const exactHead = commandIds.find((command) => command === normalizedHead);
  if (exactHead) {
    return { kind: 'action', commandId: exactHead, args, original };
  }

  return { kind: 'unknown', command: trimmed, original };
}
