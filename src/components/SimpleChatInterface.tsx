import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAstrologyAPI } from "@/hooks/useAstrologyApi";
import { astrologyApiConfig } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getBirthDetails } from "@/utils/storage";
import { ChatSidebar } from "./ChatSidebar";
import { Chat, ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import { UserIcon, AssistantIcon } from "./ChatIcons";
import { suggestedQuestions } from "@/config/suggestions";
import { SuggestedQuestions } from "./SuggestedQuestions";

export function SimpleChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { createNewChat, connectToChat, getUserChats, getChat } =
    useAstrologyAPI(astrologyApiConfig);

  const { toast } = useToast();

  useEffect(() => {
    loadUserChats();
  }, []);

  const loadUserChats = async () => {
    try {
      const userChats = await getUserChats("user-123");
      setChats(userChats);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive",
      });
    }
  };

  const handleChatSelect = async (chatId: number) => {
    try {
      const chat = await getChat(chatId);
      setCurrentChat(chat);
      setMessages(chat.messages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const birthDetails = getBirthDetails();
    if (!birthDetails) {
      toast({
        title: "Error",
        description: "Birth details not found",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let chatId: number;

      if (!currentChat) {
        const response = await createNewChat({
          user_id: "user-123",
          birth_date: birthDetails.date,
          birth_time: birthDetails.time,
          latitude: birthDetails.latitude,
          longitude: birthDetails.longitude,
          message: input,
        });
        chatId = response.chat_id;
      } else {
        chatId = currentChat.id;
      }

      setMessages((prev) => [...prev, { role: "user", content: input }]);
      setInput("");

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
          loadUserChats(); // Refresh chat list
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

      return () => ws.close();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChat(null);
    setMessages([]);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="h-[100vh] flex">
      <ChatSidebar
        chats={chats}
        onChatSelect={handleChatSelect}
        selectedChatId={currentChat?.id}
        onCollapse={setIsSidebarCollapsed}
        onNewChat={handleNewChat}
      />

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "pl-[50px]" : "pl-64"
        )}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {currentChat?.title || "New Consultation"}
          </h1>
          <Button variant="outline" onClick={handleNewChat} className="ml-2">
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 && (
              <SuggestedQuestions
                questions={suggestedQuestions}
                onSelectQuestion={handleSuggestedQuestion}
              />
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {message.role === "user" ? <UserIcon /> : <AssistantIcon />}
                <div
                  className={`p-4 rounded-lg max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Apply styles to specific elements
                        p: ({ node, ...props }) => (
                          <p className="prose-p:leading-relaxed" {...props} />
                        ),
                        pre: ({ node, ...props }) => (
                          <pre className="p-0" {...props} />
                        ),
                        // Add wrapper div with the main styles
                        div: ({ node, ...props }) => (
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t">
          <form
            onSubmit={handleSendMessage}
            className="max-w-3xl mx-auto flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
