import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  isDark: boolean;
  icon?: LucideIcon;
  text: string;
  href?: string;
}

export default function Ctabutton({ isDark, icon: Icon, text, href }: Props) {
  return (
    <Link
      href={href ?? "#"}
      className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
        isDark
          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-xl hover:shadow-blue-500/30 focus:ring-blue-500/50"
          : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-400/30 focus:ring-blue-400/50"
      }`}
    >
      {/* render icon kalau ada */}
      {Icon && (
        <Icon
          size={20}
          className="group-hover:scale-110 transition-transform"
        />
      )}
      {text}
    </Link>
  );
}
