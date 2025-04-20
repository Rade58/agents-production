// import type { AIMessage } from '../../types';
import { addMessages, getMessages } from '../memory';

import { runLLM } from './llm';

const DB_NAME = 'db-part2';

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

  if (aiMessageResponse.tool_calls) {
    console.log('Tool was called 🧰');

    console.log(aiMessageResponse.tool_calls);
  }

  await addMessages([aiMessageResponse], DB_NAME);

  // console.log(aiMessageResponse);

  return getMessages(DB_NAME);
};
