import { runLLM } from '../../src/base_app/llm';
import { runEval } from '../evalTools';
import { ToolCallMatch } from '../scorers';
import { generateImageToolDeffinition } from '../../src/base_app/tools/generateImage';
import { dadJokeToolDeffinition } from '../../src/base_app/tools/dadJoke';
import { redditToolDeffinition } from '../../src/base_app/tools/reddit';

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

const allTools = [
  dadJokeToolDeffinition,
  generateImageToolDeffinition,
  redditToolDeffinition,
];

runEval('allTools', {
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: allTools,
    }),
  data: [
    {
      input: 'Tell me a funny dad joke',
      expected: createToolCallMessage(dadJokeToolDeffinition.name),
    },
    {
      input: 'take a photo of mars',
      expected: createToolCallMessage(generateImageToolDeffinition.name),
    },
    {
      input: 'what is the most upvoted post on reddit',
      expected: createToolCallMessage(generateImageToolDeffinition.name),
    },
  ],
  scorers: [ToolCallMatch],
});
