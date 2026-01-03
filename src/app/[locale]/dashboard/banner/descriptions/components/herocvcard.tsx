import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useRef } from "react";

interface Props {
  t: (key: string) => string;
  cvUrl: string;
  selectedFile: File | null;
  onSelect: (file: File) => void;
}

export function HeroCVCard({
  t,
  cvUrl,
  selectedFile,
  onSelect,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileName =
    selectedFile?.name ??
    (cvUrl
      ? decodeURIComponent(cvUrl.split("/").pop() || "")
      : t("cv.none"));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("cv.title")}</CardTitle>
        <CardDescription>{t("cv.description")}</CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">
              {t("cv.currentLabel")}
            </div>
            <div className="text-sm text-muted-foreground">
              {fileName}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!cvUrl}
            onClick={() => {
              window.open(cvUrl, "_blank");
            }}
          >
            {t("cv.view")}
          </Button>

          <Button
            size="sm"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            {t("cv.change")}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          hidden
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) onSelect(file);
          }}
        />
      </CardContent>
    </Card>
  );
}
