import { useState, useEffect } from "react";
import { BirthDetailsForm } from "./BirthDetailsForm";
import { SimpleChatInterface } from "./SimpleChatInterface";
import { getBirthDetails } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";

export function VedicAIChat() {
  const [hasBirthDetails, setHasBirthDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = getBirthDetails();
    if (stored) {
      setHasBirthDetails(true);
    }
  }, []);

  const handleBirthDetailsSubmit = () => {
    setHasBirthDetails(true);
  };

  if (!hasBirthDetails) {
    return <BirthDetailsForm onSubmit={handleBirthDetailsSubmit} />;
  }

  return <SimpleChatInterface />;
}
