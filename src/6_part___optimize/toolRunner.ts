import { get } from 'http';
import type OpenAI from 'openai';

// we are using outr tools here
import { tools, toolDefinitions } from './tools/tools';

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
    case toolDefinitions.dadJokeToolDeffinition.name:
      return tools.dadJokeTool(input);
    case toolDefinitions.generateImageToolDeffinition.name:
      return tools.generateImage(input);
    case toolDefinitions.redditToolDeffinition.name:
      return tools.redditTool(input);
    //
    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`);
  }
};
