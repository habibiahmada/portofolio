"use client";

import React, { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { Button } from "./button";

type AlertProps = {
  open: boolean;
  type?: "success" | "error" | "info";
  message: string;
  onClose: () => void;
  duration?: number;
};

const Alert: React.FC<AlertProps> = ({ open, type = "info", message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => onClose(), duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open) return null;

  const base = "max-w-sm w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black/5";
  const variants: Record<string, string> = {
    success: "bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-green-100 dark:border-green-900",
    error: "bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-red-100 dark:border-red-900",
    info: "bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800",
  };

  const icon = type === "success" ? (
    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
  ) : type === "error" ? (
    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
  ) : (
    <XCircle className="w-6 h-6 text-slate-600 dark:text-slate-400" />
  );

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div
        className={`${base} ${variants[type]} p-3 pr-2 transition-transform transform duration-200 translate-y-0`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
