export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  id: number;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatHistoryResponse {
  chats: Chat[];
  total: number;
  page: number;
  per_page: number;
}
