// import type { AIMessage } from '../../types';
import { addMessages, getMessages, saveToolResponse } from '../memory';

import { runLLM } from './llm';
import { runTool } from './toolRunner';

const DB_NAME = 'db-part3';

export const runAgent = async ({
  tools,
  userMessage,
}: {
  userMessage: string;
  tools: any[];
}) => {
  await addMessages([{ role: 'user', content: userMessage }], DB_NAME);

  // showing loader
  console.log('Thinking...');
  //

  const history = await getMessages(DB_NAME);

  const aiMessageResponse = await runLLM({
    messages: history,
    tools,
  });

  await addMessages([aiMessageResponse], DB_NAME);

  // if it has content, it's a normal response
  // if it has tool_calls, it's a tool call

  if (aiMessageResponse.tool_calls) {
    // console.log('Tool was called 🧰');
    // console.log(aiMessageResponse.tool_calls);

    // we added this

    const toolCall = aiMessageResponse.tool_calls[0];

    console.log(`executing: ${toolCall.function.name}`);

    const toolResponse = await runTool(toolCall, userMessage);

    await saveToolResponse(toolCall.id, toolResponse, DB_NAME);

    console.log(`done: ${toolCall.function.name}`);
  }
  // instead of here we saved it above
  // because we would mess up the order of the messages
  // await addMessages([aiMessageResponse], DB_NAME);

  console.log(aiMessageResponse);

  return getMessages(DB_NAME);
};
