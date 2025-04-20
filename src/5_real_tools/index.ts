import { runAgent } from './agent';
// import { z } from 'zod';

import { toolsDEffinitionsList } from './tools/tools';

export async function realTools() {
  const userMessage = process.argv[2];

  if (!userMessage) {
    console.error('Please provide a message');
    process.exit(1);
  }

  // not a real tool (from previous lessons)
  /* const weatherTool = {
    name: 'get_weather_stuff',
    description: 'Use this tool to get weather information.',
    parameters: z.object({
      reasoning: z.string().describe('Why did you pick this tool?'),
    }),
  }; */

  const response = await runAgent({
    userMessage,
    // tools: [  weatherTool],
    tools: toolsDEffinitionsList,
  });
}
