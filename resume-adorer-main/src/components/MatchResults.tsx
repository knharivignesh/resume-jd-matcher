import { AlertCircle, Check, ChevronRight, Save } from "lucide-react";
import { PaginationNext, PaginationPrevious } from "./ui/pagination";

import { Button } from "./ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MatchResultsProps {
  initialScore: number;
  finalScore: number;
  onButtonClick: (tab: string) => void;
  highlights: string[];
}

export const MatchResults: React.FC<MatchResultsProps> = ({
  initialScore,
  finalScore,
  onButtonClick,
  highlights,
}) => {
  const handleNext = () => {
    onButtonClick("template");
  };

  const handlePrevious = () => {
    onButtonClick("resume");
  };
  return (
    <>
      <Card className="p-6 animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Match Analysis</h2>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Initial Match Score</span>
            <span className="text-sm font-semibold">{initialScore}%</span>
          </div>

          <Progress
            value={initialScore}
            className="h-3"
            style={{
              background:
                "linear-gradient(90deg, rgba(37,99,235,1) 0%, rgba(59,130,246,1) 100%)",
            }}
          />

          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">Low Match</span>
            <span className="text-xs text-muted-foreground">High Match</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Final Match Score</span>
            <span className="text-sm font-semibold">{finalScore}%</span>
          </div>

          <Progress
            value={finalScore}
            className="h-3"
            style={{
              background:
                "linear-gradient(90deg, rgba(37,99,235,1) 0%, rgba(59,130,246,1) 100%)",
            }}
          />

          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">Low Match</span>
            <span className="text-xs text-muted-foreground">High Match</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Key Insights</h3>

          <ul className="space-y-3">
            {highlights.map((highlight, index) => {
              const isPositive =
                !highlight.includes("not present") &&
                !highlight.includes("missing");

              return (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-md bg-secondary/50"
                >
                  {isPositive ? (
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{highlight}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
      <div className="flex justify-end mt-4">
        <Button onClick={handlePrevious} className={cn("px-8")}>
          <PaginationPrevious className="h-4 w-4 mr-2" />
        </Button>
        <Button onClick={handleNext} className={cn("px-8", "ml-4")}>
          <PaginationNext className="h-4 w-4 mr-2" />
        </Button>
      </div>
    </>
  );
};
