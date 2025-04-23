import { JSONFilePreset } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';

import { type AIMessage } from '../types';

import { sumarizeMessages } from './base_app/llm';

export type MessageWithMetadata = AIMessage & {
  id: string;
  createdAt: string;
};

type Data = {
  messages: MessageWithMetadata[];
  //
  sumary: string;
};

export const addMetadata = (messageWithoutMetadata: AIMessage) => {
  return {
    ...messageWithoutMetadata,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
};

export const removeMetadata = (messageWithMetadata: MessageWithMetadata) => {
  const { id, createdAt, ...messageWithoutMetadata } = messageWithMetadata;

  return messageWithoutMetadata;
};

const defaultData: Data = {
  messages: [],
  //
  sumary: '',
};

export const getDb = async (filename: string) => {
  const db = await JSONFilePreset<Data>(`${filename}.json`, defaultData);

  return db;
};

export const addMessages = async (
  messages: AIMessage[],
  db_filename: string
) => {
  const db = await getDb(db_filename);

  const messagesWithMetadata = messages.map(addMetadata);

  db.data.messages.push(...messagesWithMetadata);

  if (db.data.messages.length >= 10) {
    const oldestMessage = db.data.messages.slice(0, 5).map(removeMetadata);

    db.data.sumary = await sumarizeMessages(oldestMessage);
  }

  await db.write();
};

export const getMessages = async (db_filename: string) => {
  const db = await getDb(db_filename);

  const messagesWithoutMetadata = db.data.messages.map(removeMetadata);

  const lastFiveMessages = messagesWithoutMetadata.slice(-5);

  if (lastFiveMessages[0]?.role === 'tool') {
    const sixMessage =
      messagesWithoutMetadata[messagesWithoutMetadata.length - 6];

    if (sixMessage) {
      return [...[sixMessage], ...lastFiveMessages];
    }
  }

  // return messagesWithoutMetadata;
  return lastFiveMessages;
};

export const getSummary = async (db_filename: string) => {
  const db = await getDb(db_filename);

  return db.data.sumary;
};

// Defined for the purpose of part 3 of the workshop
export const saveToolResponse = async (
  toolCallId: string,
  toolResponse: string,
  db_name: string
) => {
  return addMessages(
    [{ role: 'tool', content: toolResponse, tool_call_id: toolCallId }],
    db_name
  );
};
