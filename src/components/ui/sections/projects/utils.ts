export const getTagColor = (tag: string): string => {
  const colors: Record<string, string> = {
    react: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    "next.js": "bg-slate-100 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300",
    typescript: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    redux: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    tailwind: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300",
    "react native": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    "vue.js": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    graphql: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
    shopify: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    laravel: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  };

  return (
    colors[tag.toLowerCase()] ||
    "bg-slate-100 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300"
  );
};
