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
import { ChatLoader } from "./ChatLoader";

export function SimpleChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { createNewChat, connectToChat, getUserChats, getChat, continueChat } =
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

  const sanitizeMarkdown = (content: string) => {
    // Remove thinking section and any XML-like tags
    return content
      .replace(/<think>[\s\S]*?<\/think>\n*/g, "") // Remove think blocks and following newlines
      .replace(/<[^>]*>/g, "") // Remove any remaining XML tags
      .trim()
      .replace(/^\n+/, ""); // Remove leading newlines
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const currentInput = input;
    setInput("");

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setLoading(true);
    setIsTyping(true);

    try {
      if (!currentChat) {
        const birthDetails = getBirthDetails();
        if (!birthDetails) {
          toast({
            title: "Error",
            description: "Birth details not found",
            variant: "destructive",
          });
          return;
        }

        const response = await createNewChat({
          user_id: "user-123",
          birth_date: birthDetails.date,
          birth_time: birthDetails.time,
          latitude: birthDetails.latitude,
          longitude: birthDetails.longitude,
          message: currentInput,
        });
        const chatId = response.chat_id;
        setCurrentChat({
          id: chatId,
          messages: [],
          title: "New Chat",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        // For existing chat, initialize WebSocket first
        let isResponseStarted = false;
        const ws = connectToChat(currentChat.id, {
          onMessage: (message) => {
            setMessages((prev) => {
              const newMessages = [...prev];
              if (!isResponseStarted) {
                // Add new assistant message with sanitized content
                newMessages.push({
                  role: "assistant",
                  content: sanitizeMarkdown(message),
                });
                isResponseStarted = true;
              } else {
                // Append sanitized content to existing message
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage?.role === "assistant") {
                  lastMessage.content += sanitizeMarkdown(message);
                }
              }
              return newMessages;
            });
          },
          onComplete: () => {
            setLoading(false);
            setIsTyping(false);
            loadUserChats();
          },
          onError: (error) => {
            setMessages((prev) => {
              // Remove incomplete assistant message if any
              return prev.filter(
                (msg) => !(msg.role === "assistant" && msg.content === "")
              );
            });
            toast({
              title: "Error",
              description: error,
              variant: "destructive",
            });
            setLoading(false);
            setIsTyping(false);
          },
        });

        try {
          // Start the continue chat request
          await continueChat(currentChat.id, {
            message: currentInput,
            type: "western_birth_chart",
            context_window: 5,
          });
        } catch (error) {
          ws.close();
          throw error;
        }

        return () => ws.close();
      }
    } catch (error) {
      setMessages((prev) => {
        // Remove any incomplete assistant message on error
        return prev.filter(
          (msg) => !(msg.role === "assistant" && msg.content === "")
        );
      });
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      setLoading(false);
      setIsTyping(false);
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
                {message.role === "user" ? (
                  <UserIcon />
                ) : message.content || isTyping ? (
                  <AssistantIcon />
                ) : null}
                <div
                  className={cn(
                    "p-4 rounded-lg max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="leading-relaxed">{children}</p>
                          ),
                          pre: ({ children }) => (
                            <pre className="p-0">{children}</pre>
                          ),
                        }}
                      >
                        {message.content || " "}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isTyping &&
              !messages.some((m) => m.role === "assistant" && !m.content) && (
                <ChatLoader />
              )}
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
