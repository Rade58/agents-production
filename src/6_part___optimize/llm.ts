import { zodFunction } from 'openai/helpers/zod';
import type { AIMessage } from '../../types';
import { openai } from '../ai';
import { systemPrompt } from './systemPrompt';
export const runLLM = async ({
  messages,
  tools,
  model = 'gpt-4o-mini',
  temperature = 0.1,
}: {
  messages: AIMessage[];
  tools: any[];
  temperature?: number;
  model?: string;
}) => {
  const formattedTools = tools?.map((t) => zodFunction(t));

  const response = await openai.chat.completions.create({
    model,
    temperature,
    // instead of this
    // messages,
    // we will use this
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    //
    tools: formattedTools,
    tool_choice: 'auto',
    parallel_tool_calls: false,
  });

  return response.choices[0].message;
};
