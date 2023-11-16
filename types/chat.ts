import { OpenAIModel } from './openai';

export interface FunctionCall {
  name: string;
  arguments: string;
}

export interface Message {
  role: Role;
  content: string;
  function_call?: FunctionCall;
  name?: string;  //only applicable for function
}

export type Role = 'assistant' | 'user' | 'function' | 'system';

export interface ChatBody {
  model: OpenAIModel;
  messages: Message[];
  key: string;
  prompt: string;
  temperature: number;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  model: OpenAIModel;
  prompt: string;
  temperature: number;
  folderId: string | null;
}
