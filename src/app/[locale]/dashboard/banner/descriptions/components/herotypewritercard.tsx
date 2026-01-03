import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  t: (key: string) => string;
  items: string[];
  onChange: (items: string[]) => void;
}

export function HeroTypewriterCard({
  t,
  items,
  onChange,
}: Props) {
  const [newText, setNewText] = useState("");

  const addItem = () => {
    const value = newText.trim();
    if (!value) return;

    onChange([...items, value]);
    setNewText("");
  };

  const updateItem = (index: number, value: string) => {
    const copy = [...items];
    copy[index] = value;
    onChange(copy);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("typewriter.title")}</CardTitle>
          <CardDescription>
            {t("typewriter.description")}
          </CardDescription>
        </div>

        <Badge variant="secondary">
          {items.length} {t("typewriter.items")}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.map((text, index) => (
          <div key={`${text}-${index}`} className="flex gap-3">
            <Input
              value={text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateItem(index, e.target.value)
              }
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="flex gap-3">
          <Input
            value={newText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewText(e.target.value)
            }
          />
          <Button onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            {t("typewriter.add")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}