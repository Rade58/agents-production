import { z } from 'zod';
import type { ToolFn } from '../../../types';

import got from 'got';

export const dadJokeToolDeffinition = {
  name: 'dad_joke',
  parameters: z.object({
    reasoning: z.string().describe('Why did you pick this tool?'),
  }),
  description: 'Use this tool to get a dad joke',
};

type Args = z.infer<typeof dadJokeToolDeffinition.parameters>;

export const dadJokeTool: ToolFn<Args, string> = async (
  {
    // toolArgs,
    // userMessage,
  }
) => {
  const data = await got
    .get('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json',
      },
    })
    .json();

  console.log({ data });

  return (data as { joke: string }).joke;
};
