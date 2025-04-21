import { runLLM } from '../../src/base_app/llm';
import { runEval } from '../evalTools';
import { ToolCallMatch } from '../scorers';
import { generateImageToolDeffinition } from '../../src/base_app/tools/generateImage';

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

runEval('generateImage', {
  task: async (input) => {
    const response = await runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [generateImageToolDeffinition],
    });
    return response;
  },
  data: [
    {
      input: 'Generate an image of a cat',
      expected: createToolCallMessage(generateImageToolDeffinition.name),
    },
    /* {
      input: 'Take a photo of the dog',
      expected: createToolCallMessage(generateImageToolDeffinition.name),
    }, */
  ],
  scorers: [ToolCallMatch],
});
