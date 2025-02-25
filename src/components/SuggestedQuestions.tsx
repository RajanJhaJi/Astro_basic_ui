import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
}

export function SuggestedQuestions({
  questions,
  onSelectQuestion,
}: SuggestedQuestionsProps) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-4">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Lightbulb className="h-5 w-5" />
        <span>Suggested Questions</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="text-left h-auto whitespace-normal p-4"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}
