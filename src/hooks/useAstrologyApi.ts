import { useState } from "react";
import {
  ChatResponse,
  CreateChatRequest,
  ContinueChatRequest,
} from "@/types/api";
import { Chat } from "@/types/chat";

interface ApiConfig {
  baseURL: string;
  wsURL: string;
}

interface WebSocketHandlers {
  onMessage: (message: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: number;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export const useAstrologyAPI = (config: ApiConfig) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewChat = async (params: {
    user_id: string;
    birth_date: string;
    birth_time: string;
    latitude: number;
    longitude: number;
    message: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.baseURL}/api/chat/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error("Failed to create chat");

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserChats = async (userId: string): Promise<Chat[]> => {
    try {
      const response = await fetch(`${config.baseURL}/api/chats/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch chats");

      const data = await response.json();
      return data.chats;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getChat = async (chatId: number): Promise<Chat> => {
    try {
      const response = await fetch(`${config.baseURL}/api/chat/${chatId}`);
      if (!response.ok) throw new Error("Failed to fetch chat");

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const continueChat = async (chatId: number, request: ContinueChatRequest) => {
    const response = await fetch(
      `${config.baseURL}/api/chat/${chatId}/continue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );
    console.log("🚀 ~ continueChat ~ response:", response);

    if (!response.ok) {
      throw new Error("Failed to continue chat");
    }

    return (await response.json()) as ChatResponse;
  };

  const connectToChat = (chatId: number, handlers: WebSocketHandlers) => {
    const ws = new WebSocket(`${config.wsURL}/ws/chat/${chatId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        handlers.onMessage(data.content);
      } else if (data.type === "complete") {
        handlers.onComplete();
      }
    };

    ws.onerror = () => {
      handlers.onError("WebSocket connection failed");
    };

    return ws;
  };

  return {
    createNewChat,
    continueChat,
    connectToChat,
    getUserChats,
    getChat,
    loading,
    error,
  };
};
