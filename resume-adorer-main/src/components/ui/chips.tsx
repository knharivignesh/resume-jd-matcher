import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface StringManagerProps {
  initialStrings?: string[];
  title?: string;
  editModeOn?: boolean;
  description?: string;
  onChange?: (strings: string[]) => void;
}

const Chip = ({
  initialStrings = [],
  title = "",
  editModeOn = false,
  description = '',
  onChange,
}: StringManagerProps) => {
  const [strings, setStrings] = useState<string[]>(initialStrings);
  const [newString, setNewString] = useState("");
  const [heading, setHeading] = useState(title);
  const [edit, setEdit] = useState(editModeOn);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Notify parent component about changes
  useEffect(() => {
    setEdit(editModeOn);
  }, [editModeOn]);

  const addString = () => {
    if (!newString.trim()) {
      toast({
        title: "Cannot add empty string",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    if (strings.includes(newString.trim())) {
      toast({
        title: "Duplicate entry",
        description: "Skill set already exists",
        variant: "destructive",
      });
      return;
    }

    const updatedString =  [...strings, newString.trim()]
    setStrings(updatedString);
    setNewString("");
    toast({
      title: "Skill added",
      description: `"${newString.trim()}" has been added to the collection`,
    });
    onChange(updatedString);
  };

  const removeString = (index: number) => {
    const removedString = strings[index];
    const updatedString = strings.filter((_, i) => i !== index)
    setStrings(updatedString);
    toast({
      title: "Skill removed",
      description: `"${removedString}" has been removed from the collection`,
    });
    onChange(updatedString);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addString();
    }
  };

  // Array of chip colors for visual variety
  const chipColors = [
    "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "bg-green-100 text-green-800 hover:bg-green-200",
    "bg-purple-100 text-purple-800 hover:bg-purple-200",
    "bg-amber-100 text-amber-800 hover:bg-amber-200",
    "bg-pink-100 text-pink-800 hover:bg-pink-200",
    "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    "bg-rose-100 text-rose-800 hover:bg-rose-200",
  ];

  return (
    <>
      <h3 className="font-semibold text-lg text-blue-700">{heading}</h3>
      { edit &&
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            placeholder={description}
            value={newString}
            onChange={(e) => setNewString(e.target.value)}
            onKeyDown={handleKeyDown}
            className="transition-all border border-input/60 bg-background/50 focus-visible:ring-1 focus-visible:ring-ring/50"
          />
          <Button
            onClick={addString}
            size="icon"
            className="transition-all hover:shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      }
      <div className="relative min-h-[100px] max-h-[320px] overflow-y-auto pr-2">
        {strings.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground italic animate-pulse">
            Your collection is empty
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 py-2">
            {strings.map((string, index) => {
              const colorIndex = index % chipColors.length;
              return (
                <div
                  key={`${string}-${index}`}
                  className={cn(
                    "group inline-flex items-center gap-1 px-3 py-1.5 rounded-full transition-all",
                    chipColors[colorIndex],
                    "border border-transparent hover:shadow-sm",
                    "animate-slide-in"
                  )}
                >
                  <Tag className="h-3.5 w-3.5 opacity-70" />
                  <span className="text-sm font-medium">{string}</span>
                  {edit && <button
                    type="button"
                    onClick={() => removeString(index)}
                    className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors"
                    aria-label={`Remove ${string}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Chip;
