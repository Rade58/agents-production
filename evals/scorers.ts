import type { Scorer } from 'autoevals';

export const ToolCallNatch: Scorer<any, { input: string }> = async ({
  input,
  output,
  expected,
}) => {
  const score =
    output.role === 'assistant' &&
    Array.isArray(output.tool_calls) &&
    output.tool_calls.length === 1 &&
    output.tool_calls[0].function?.name === expected.tool_calls[0]?.name
      ? 1
      : 0;

  return {
    name: 'ToolCallNatch',
    score,
  };
};
