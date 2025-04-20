import { get } from 'http';
import type OpenAI from 'openai';

const getWeather = (input: any) => `hot, 90deg`;

export const runTool = async (
  toolCall: OpenAI.ChatCompletionMessageToolCall,
  userMessage: string,

  userId?: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
  };

  switch (toolCall.function.name) {
    case 'get_weather_stuff':
      return getWeather(input);
    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`);
  }
};
