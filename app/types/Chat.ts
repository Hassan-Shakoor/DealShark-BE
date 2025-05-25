export type Chat = {
  chat_id: number;
  companion_name: string;
  messages: Message[];
};

export enum MessageRole {
  User = "user",
  Assistant = "assistant",
}

export type Message = {
  role: MessageRole;
  content: string;
  timestamp: string;
};
