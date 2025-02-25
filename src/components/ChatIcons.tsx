import { User, Bot } from "lucide-react";

export const UserIcon = () => (
  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
    <User className="h-5 w-5 text-primary-foreground" />
  </div>
);

export const AssistantIcon = () => (
  <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center">
    <Bot className="h-5 w-5 text-white" />
  </div>
);
