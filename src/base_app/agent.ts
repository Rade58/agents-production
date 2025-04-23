import type { AIMessage } from '../../types';
import { addMessages, getMessages, saveToolResponse } from '../memory';

import { runLLM, runApprovalCheck } from './llm';
import { runTool } from './toolRunner';
import { generateImageToolDeffinition } from './tools/generateImage';

const DB_NAME = 'db-base';

const handleImageApprovalFlow = async (
  history: AIMessage[],
  userMessage: string
) => {
  const lastMessage = history.at(-1);
  // @ts-expect-error tool_calls is not typed
  const toolCall = lastMessage?.tool_calls?.[0];

  if (
    !toolCall ||
    toolCall.function.name !== generateImageToolDeffinition.name
  ) {
    return;
  }

  console.log('Loader visible, processing approval...');

  const approved = await runApprovalCheck(userMessage);

  if (approved) {
    console.log(`loader updated , executing tool: ${toolCall.function.name}`);
    const toolResponse = await runTool(toolCall, userMessage);

    console.log(`done: ${toolCall.function.name}`);

    await saveToolResponse(toolCall.id, toolResponse, DB_NAME);
  } else {
    await saveToolResponse(
      toolCall.id,
      'User did not approve generation at this time',
      DB_NAME
    );
  }

  console.log('loader stopped');

  return true;
};

export const runAgent = async ({
  tools,
  userMessage,
}: {
  userMessage: string;
  tools: any[];
}) => {
  const history = await getMessages(DB_NAME);

  const isApproval = await handleImageApprovalFlow(history, userMessage);

  if (!isApproval) {
    await addMessages([{ role: 'user', content: userMessage }], DB_NAME);
  }

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

      if (toolCall.function.name === generateImageToolDeffinition.name) {
        console.log('NEED USER APPROVAL!');

        console.log('loader stopped');

        return getMessages(DB_NAME);
      }

      console.log(`executing: ${toolCall.function.name}`);

      const toolResponse = await runTool(toolCall, userMessage);

      await saveToolResponse(toolCall.id, toolResponse, DB_NAME);

      console.log(`done: ${toolCall.function.name}`);
    }
  }
};
