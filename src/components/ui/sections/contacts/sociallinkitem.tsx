import Link from "next/link";

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
  bgClass: string;
  textClass: string;
}

export default function SocialLinkItem({ social }: { social: SocialLink }) {
  const IconComponent = social.icon;

  return (
    <Link
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group flex items-center gap-3 px-5 py-3
        bg-white dark:bg-slate-950 
        border border-slate-200 dark:border-slate-700
        rounded-xl shadow-sm hover:shadow-md
        transition-all duration-300
        ${social.bgClass} hover:border-transparent
      `}
    >
      <IconComponent className={`w-5 h-5 text-slate-600 dark:text-slate-400 ${social.textClass} transition-colors`} />
      <span className={`font-medium text-slate-700 dark:text-slate-300 ${social.textClass} transition-colors`}>
        {social.label}
      </span>
    </Link>
  );
}