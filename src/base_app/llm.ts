import { zodFunction, zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import type { AIMessage } from '../../types';
import { openai } from '../ai';
import { systemPrompt as defaultSystemPropmt } from './systemPrompt';

import { getSummary } from '../memory';

export const runLLM = async ({
  messages,
  tools,
  model = 'gpt-4o-mini',
  temperature = 0.1,
  systemPrompt,
}: {
  messages: AIMessage[];
  tools: any[];
  temperature?: number;
  model?: string;
  systemPrompt?: string;
}) => {
  const formattedTools = tools?.map((t) => zodFunction(t));

  const summary = await getSummary('db-base.json');

  const response = await openai.chat.completions.create({
    model,
    temperature,
    // instead of this
    // messages,
    // we will use this
    messages: [
      {
        role: 'system',
        content: `${
          systemPrompt || defaultSystemPropmt
        }. Conversation sumary so far: ${summary}`,
      },
      ...messages,
    ],
    //
    ...(formattedTools.length > 0 && {
      tools: formattedTools,
      tool_choice: 'auto',
      parallel_tool_calls: false,
    }),
  });

  return response.choices[0].message;
};

export const runApprovalCheck = async (userMessage: string) => {
  const result = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    response_format: zodResponseFormat(
      z.object({
        approved: z.boolean().describe('did the user approve action or not'),
      }),
      'approval'
    ),
    messages: [
      {
        role: 'system',
        content:
          'Determine if the user approved the image generation. If you are not sure, then it is not approved',
      },
      { role: 'user', content: userMessage },
    ],
  });

  return result.choices[0].message.parsed?.approved;
};

export const sumarizeMessages = async (messages: AIMessage[]) => {
  const response = await runLLM({
    messages,
    systemPrompt:
      'Sumarize the key points of the conversation in a concise way that would be helpful as context for future interactions. Make it like a play by play of the conversation',
    temperature: 0.3,
    tools: [],
  });

  return response.content || '';
};
