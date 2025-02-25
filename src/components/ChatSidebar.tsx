import { useState, useEffect } from "react";
import { UserAvatar } from "./UserAvatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat } from "@/types/chat";

interface ChatSidebarProps {
  chats: Chat[];
  onChatSelect: (chatId: number) => void;
  selectedChatId?: number;
  onCollapse: (collapsed: boolean) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  chats,
  onChatSelect,
  selectedChatId,
  onCollapse,
  onNewChat,
}: ChatSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onCollapse(isCollapsed);
  }, [isCollapsed, onCollapse]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  return (
    <div
      className={cn(
        "border-r relative transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-[50px]" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-5 z-10 h-8 w-8 rounded-full border shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <UserAvatar />
          <div className={cn("transition-opacity", isCollapsed && "opacity-0")}>
            <h3 className="font-medium">Vedic Seeker</h3>
            <p className="text-sm text-muted-foreground">Free Plan</p>
          </div>
        </div>
        {!isCollapsed && (
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={onNewChat}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 transition-colors",
                selectedChatId === chat.id &&
                  "bg-amber-50 hover:bg-amber-100 text-amber-900",
                isCollapsed && "px-2"
              )}
              onClick={() => onChatSelect(chat.id)}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <div
                className={cn(
                  "truncate text-left transition-opacity",
                  isCollapsed && "opacity-0 w-0"
                )}
              >
                <div className="font-medium">{chat.title}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(chat.updated_at)}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
