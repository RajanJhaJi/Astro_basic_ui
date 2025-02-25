import { useState, useEffect } from "react";
import { useAstrologyAPI } from "@/hooks/useAstrologyApi";
import { astrologyApiConfig } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface ChatInterfaceProps {
  chatId: number;
}

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { getChat, connectToChat } = useAstrologyAPI(astrologyApiConfig);
  const { toast } = useToast();

  useEffect(() => {
    loadChatHistory();
  }, [chatId]);

  const loadChatHistory = async () => {
    try {
      const chat = await getChat(chatId);
      setMessages(chat.messages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: newMessage }]);

    const ws = connectToChat(chatId, {
      onMessage: (message) => {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { role: "assistant", content: lastMessage.content + message },
            ];
          }
          return [...prev, { role: "assistant", content: message }];
        });
      },
      onComplete: () => {
        setLoading(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        setLoading(false);
      },
    });

    setNewMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-primary/10 ml-auto"
                  : "bg-secondary"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your question..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}
