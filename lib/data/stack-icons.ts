/** Map case-study stack labels → icon URLs (images only in UI). */
const STACK_ICONS: Record<string, string> = {
  React:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "Next.js": "https://cdn.simpleicons.org/nextdotjs/ffffff",
  "Node.js":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  Express:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  Prisma: "https://cdn.simpleicons.org/prisma/ffffff",
  TypeScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  JavaScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  Laravel:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
  MySQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  "Tailwind CSS":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  Bootstrap:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg",
  Python:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  "Machine Learning":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg",
};

/**
 * Monochrome logos ship in one color, so they vanish on one theme.
 * White marks (simpleicons ".../ffffff") are inverted to black in light mode;
 * black marks (devicon Express) are inverted to white in dark mode.
 */
export function monoIconClass(src: string): string {
  if (src.endsWith("/ffffff")) return "invert dark:invert-0";
  if (src.includes("/express/express-original")) return "dark:invert";
  return "";
}

export function resolveStackIcons(stack: string[]) {
  return stack
    .map((name) => {
      const src = STACK_ICONS[name];
      return src ? { name, src } : null;
    })
    .filter((x): x is { name: string; src: string } => x != null);
}
