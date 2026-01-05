"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Props) {
  const t = useTranslations("Login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <Label htmlFor="email">{t("form.emailLabel")}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          autoComplete="email"
          onChange={e => onEmailChange(e.target.value)}
          placeholder={t("form.emailPlaceholder")}
          required
          disabled={loading}
        />
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password">{t("form.passwordLabel")}</Label>

        <div className="relative">
          <Input
            id="password"
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            placeholder={t("form.passwordPlaceholder")}
            required
            disabled={loading}
            className="pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t("form.signingIn") : t("form.signIn")}
      </Button>
    </form>
  );
}