export function withLocale(path: string, locale: string) {
  if (!path.startsWith("/")) return path

  // already localized
  if (path.startsWith(`/${locale}/`)) return path

  return `/${locale}${path}`
}
