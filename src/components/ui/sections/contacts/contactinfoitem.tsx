import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  subContent?: string;
  color: string;
  action?: () => void;
}

export default function ContactInfoItem({ info }: { info: ContactInfo }) {
  const IconComponent = info.icon;

  return (
    <Card
      className="
        group transition-all duration-300
        hover:shadow-md hover:border-slate-200
        dark:hover:border-slate-700
        bg-slate-50 dark:bg-slate-950
        border-slate-100 dark:border-slate-800
        rounded-2xl
      "
    >
      <CardContent className="flex items-start p-4">
        {/* Icon */}
        <div
          className={`
            shrink-0 w-12 h-12 rounded-2xl
            flex items-center justify-center
            ${info.color}
            bg-opacity-10 dark:bg-opacity-10
            group-hover:scale-110
            transition-transform duration-500 ease-out
          `}
        >
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="ml-5 flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {info.title}
          </h4>

          {info.action ? (
            <button
              onClick={info.action}
              aria-label={info.title}
              className="
                w-full flex items-center gap-2 text-left truncate
                text-lg font-medium
                text-slate-900 dark:text-slate-100
                hover:text-blue-600 dark:hover:text-blue-400
                transition-colors
                group/btn
              "
            >
              {info.content}
              <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          ) : (
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100 leading-snug">
              {info.content}
            </p>
          )}

          {info.subContent && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {info.subContent}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}