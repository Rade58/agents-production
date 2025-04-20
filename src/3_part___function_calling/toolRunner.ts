import { get } from 'http';
import type OpenAI from 'openai';

const getWeather = (input: any) => `hot, 90deg`;

// we will use this function inside agent file
export const runTool = async (
  toolCall: OpenAI.ChatCompletionMessageToolCall,
  userMessage: string,
  // for better security, we can pass in the user id
  // and we can pass it as one of the argument to getWeather
  // but we are not doing that in this example
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
