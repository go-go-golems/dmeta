export interface ParsedCommand {
  verb: string;
  args: string[];
}

export function parseClimCommand(input: string): ParsedCommand {
  const [verb = '', ...args] = input.trim().split(/\s+/).filter(Boolean);
  return { verb: verb.toUpperCase(), args };
}
