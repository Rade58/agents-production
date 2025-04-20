// import type { AIMessage } from '../../types';
import { addMessages, getMessages, saveToolResponse } from '../memory';

import { runLLM } from './llm';
import { runTool } from './toolRunner';

const DB_NAME = 'db-part5-real-tools';

export const runAgent = async ({
  tools,
  userMessage,
}: {
  userMessage: string;
  tools: any[];
}) => {
  await addMessages([{ role: 'user', content: userMessage }], DB_NAME);

  console.log('Thinking..., loader starts');

  while (true) {
    const history = await getMessages(DB_NAME);

    const aiMessageResponse = await runLLM({
      messages: history,
      tools,
    });

    await addMessages([aiMessageResponse], DB_NAME);

    if (aiMessageResponse.content) {
      console.log('loader stops, thinking stops');
      console.log(aiMessageResponse);
      return getMessages(DB_NAME);
    }

    if (aiMessageResponse.tool_calls) {
      const toolCall = aiMessageResponse.tool_calls[0];

      console.log(aiMessageResponse);

      console.log(`executing: ${toolCall.function.name}`);

      const toolResponse = await runTool(toolCall, userMessage);

      await saveToolResponse(toolCall.id, toolResponse, DB_NAME);

      console.log(`done: ${toolCall.function.name}`);
    }
  }
};
