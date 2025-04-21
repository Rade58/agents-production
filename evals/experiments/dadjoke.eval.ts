import { runLLM } from '../../src/base_app/llm';
import { runEval } from '../evalTools';
import { ToolCallMatch } from '../scorers';
import { dadJokeToolDeffinition } from '../../src/base_app/tools/dadJoke';

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

runEval('dadjoke', {
  task: async (input) => {
    const response = await runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [dadJokeToolDeffinition],
    });
    return response;
  },
  data: [
    {
      input: 'What is the best joke in the world?',
      expected: createToolCallMessage(dadJokeToolDeffinition.name),
    },
    {
      input: 'What is the best dad joke in the world?',
      expected: createToolCallMessage(dadJokeToolDeffinition.name),
    },
    {
      input: 'Tell me dad joke',
      expected: createToolCallMessage(dadJokeToolDeffinition.name),
    },
  ],
  scorers: [ToolCallMatch],
});
