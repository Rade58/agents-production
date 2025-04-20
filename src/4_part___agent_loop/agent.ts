// import type { AIMessage } from '../../types';
import { addMessages, getMessages, saveToolResponse } from '../memory';

import { runLLM } from './llm';
import { runTool } from './toolRunner';

const DB_NAME = 'db-part4';

export const runAgent = async ({
  tools,
  userMessage,
}: {
  userMessage: string;
  tools: any[];
}) => {
  await addMessages([{ role: 'user', content: userMessage }], DB_NAME);

  console.log('Thinking..., loader starts');

  // adding while loop

  while (true) {
    const history = await getMessages(DB_NAME);

    const aiMessageResponse = await runLLM({
      messages: history,
      tools,
    });

    await addMessages([aiMessageResponse], DB_NAME);

    // checking if this message isn't a tool call

    if (aiMessageResponse.content) {
      console.log('loader stops, thinking stops');
      console.log(aiMessageResponse);
      // breaking the loop by returning from function with all messages
      return getMessages(DB_NAME);
    }

    // here we will not break anything with a return
    // because we want loop to continue
    // untill message becomes a content, like above

    if (aiMessageResponse.tool_calls) {
      const toolCall = aiMessageResponse.tool_calls[0];

      console.log(aiMessageResponse);

      console.log(`executing: ${toolCall.function.name}`);

      const toolResponse = await runTool(toolCall, userMessage);

      await saveToolResponse(toolCall.id, toolResponse, DB_NAME);

      console.log(`done: ${toolCall.function.name}`);
    }
  }
  // console.log(aiMessageResponse);

  // return getMessages(DB_NAME);
};
