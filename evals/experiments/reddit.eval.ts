import { runLLM } from '../../src/base_app/llm';
import { redditToolDeffinition } from '../../src/base_app/tools/reddit';
import { runEval } from '../evalTools';
import { ToolCallMatch } from '../scorers';

const createToolCallMessage = (toolName: string) => ({
  role: 'assistant',
  tool_calls: [
    {
      type: 'function',
      function: {
        name: toolName,
      },
    },
  ],
});

runEval('reddit', {
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [redditToolDeffinition],
    }),
  data: [
    {
      input: 'find me something interesting on reddit',
      expected: createToolCallMessage(redditToolDeffinition.name),
    },
    {
      input: 'hi',
      expected: createToolCallMessage(redditToolDeffinition.name),
    },
  ],
  scorers: [ToolCallMatch],
});
