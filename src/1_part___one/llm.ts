import type { AIMessage } from '../../types';
import { openai } from '../ai';

export const runLLM = async ({
  messages,
  temperature = 0.1,
  model = 'gpt-4o-mini',
}: {
  messages: AIMessage[];
  temperature?: number;
  model?: string;
}) => {
  const response = await openai.chat.completions.create({
    model,
    temperature,
    messages,
  });

  return response.choices[0].message.content;
};
