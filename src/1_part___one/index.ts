import { runLLM } from './llm';

import { addMessages, getMessages } from '../memory';

// Without usage of datbase this would be One-Off
// Now it is Chat based

// One-off doesn't use memory which means there is no context
// Chat based uses memory which means there is context

// One-off is like a script
// Chat based is like a chat

const DB_NAME = 'db-part1';

export async function partOne() {
  console.log('Part One');

  const userMessage = process.argv[2];

  if (!userMessage) {
    console.error('Please provide a message!');
    process.exit(1);
  }

  await addMessages([{ role: 'user', content: userMessage }], DB_NAME);

  const messages = await getMessages(DB_NAME);

  const responseMessage = await runLLM({ messages });

  await addMessages([{ role: 'assistant', content: responseMessage }], DB_NAME);

  console.log(responseMessage);
}

// system message we manually added to the db
// db-part1.json

// {
//   "messages": [
//     {
//       "role": "system",
//       "content": "You are a helpful weatherman from Serbia. You live in Novi Sad. First time you talk, you can anounce your name. A Serbian name by your choice. And you can tell me which sport team you support in Serbia."
//     }
//   ]
// }
