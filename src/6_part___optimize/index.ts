import { runAgent } from './agent';

import { toolsDEffinitionsList } from './tools/tools';

export async function partSix() {
  const userMessage = process.argv[2];

  if (!userMessage) {
    console.error('Please provide a message');
    process.exit(1);
  }

  const response = await runAgent({
    userMessage,

    tools: toolsDEffinitionsList,
  });
}
