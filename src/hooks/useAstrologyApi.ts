import { useState } from "react";

interface AstrologyAPIConfig {
  baseURL: string;
  wsURL: string;
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

export const useAstrologyAPI = (config: AstrologyAPIConfig) => {
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

  const connectToChat = (
    chatId: number,
    callbacks: {
      onMessage: (message: string) => void;
      onComplete: () => void;
      onError: (error: string) => void;
    }
  ) => {
    const ws = new WebSocket(`${config.wsURL}/ws/chat/${chatId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "chunk":
          callbacks.onMessage(data.content);
          break;
        case "complete":
          callbacks.onComplete();
          break;
        case "error":
          callbacks.onError(data.content);
          break;
      }
    };

    return ws;
  };

  return {
    createNewChat,
    getUserChats,
    getChat,
    connectToChat,
    loading,
    error,
  };
};
