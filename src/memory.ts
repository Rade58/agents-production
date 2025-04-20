import { JSONFilePreset } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';

import { type AIMessage } from '../types';

export type MessageWithMetadata = AIMessage & {
  id: string;
  createdAt: string;
};

type Data = {
  messages: MessageWithMetadata[];
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

  await db.write();
};

export const getMessages = async (db_filename: string) => {
  const db = await getDb(db_filename);

  const messagesWithoutMetadata = db.data.messages.map(removeMetadata);

  return messagesWithoutMetadata;
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
