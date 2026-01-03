import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  t: (key: string) => string;
  greeting: string;
  description: string;
  developerTag: string;
  consoleTag: string;
  onGreetingChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDeveloperTagChange: (value: string) => void;
  onConsoleTagChange: (value: string) => void;
}

export function HeroContentCard({
  t,
  greeting,
  description,
  developerTag,
  consoleTag,
  onGreetingChange,
  onDescriptionChange,
  onDeveloperTagChange,
  onConsoleTagChange,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("contentCard.title")}</CardTitle>
        <CardDescription>{t("contentCard.description")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="col-span-2 space-y-2">
            <Label>{t("contentCard.greeting.label")}</Label>
            <Input
              value={greeting}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onGreetingChange(e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>{t("contentCard.developerTag.label")}</Label>
            <Input
              value={developerTag}
              className="font-mono"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onDeveloperTagChange(e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>{t("contentCard.consoleTag.label")}</Label>
            <Input
              value={consoleTag}
              className="font-mono"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onConsoleTagChange(e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("contentCard.bio.label")}</Label>
          <Textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onDescriptionChange(e.target.value)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
