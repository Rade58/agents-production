import OpenAI from 'openai';

// roles
//  "function" // deprecated
//  "developer" // won't use

//  "assistant"  "user"  "tool" "system"   // will use

export type AIMessage =
  // | OpenAI.Chat.ChatCompletionFunctionMessageParam // deprecated
  // don't need these now
  // | OpenAI.Chat.ChatCompletionDeveloperMessageParam
  | OpenAI.Chat.ChatCompletionAssistantMessageParam
  | OpenAI.Chat.ChatCompletionUserMessageParam
  | OpenAI.Chat.ChatCompletionToolMessageParam
  | OpenAI.Chat.ChatCompletionSystemMessageParam;

/** using   ChatCompletionToolMessageParam ChatCompletionUserMessageParam
   * instead of this
   * 
  | { role: 'user'; content: string }
  | { role: 'tool'; content: string };
*/

export interface ToolFn<A = any, T = any> {
  (input: { userMessage: string; toolArgs: A }): Promise<T>;
}
