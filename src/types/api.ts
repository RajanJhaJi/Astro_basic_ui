export interface ContinueChatRequest {
  message: string;
  type: "western_birth_chart" | "vedic_birth_chart";
  context_window: number;
}

export interface CreateChatRequest {
  user_id: string;
  birth_date: string;
  birth_time: string;
  latitude: number;
  longitude: number;
  message: string;
}

export interface ChatResponse {
  chat_id: number;
  message: string;
}
