import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatLoader() {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center">
        <Bot className="h-5 w-5 text-white" />
      </div>
      <div className="flex space-x-2 p-4 bg-muted rounded-lg items-center">
        <div className="w-2 h-2 rounded-full bg-amber-500/40 animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-amber-500/40 animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-amber-500/40 animate-bounce" />
      </div>
    </div>
  );
}
