/** Public repositories shown on the home page and in /projects. */
export type OpenSourceProject = {
  id: string
  name: string
  /** What kind of thing it is, shown above the name. */
  kind: string
  description: string
  /** Short, checkable facts. Three at most so the card stays scannable. */
  facts: string[]
  language: string
  license: string
  install?: string
  repoUrl: string
  siteUrl?: string
  siteLabel?: string
  /** Credit for forks, shown under the description. */
  forkOf?: { name: string; url: string }
}

export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    id: "autumnnote-plus",
    name: "autumnnote-plus",
    kind: "npm package",
    description:
      "A WYSIWYG rich-text editor in plain JavaScript. No jQuery, no runtime dependencies, no execCommand, so Chrome, Firefox, and Safari produce the same markup.",
    facts: ["0 runtime deps", "React + Vue wrappers", "9 UI languages"],
    language: "JavaScript",
    license: "MIT",
    install: "npm install autumnnote-plus",
    repoUrl: "https://github.com/habibiahmada/autumnnote-plus",
    siteUrl: "https://autumnnote.habibiahmada.dev",
    siteLabel: "Docs",
    forkOf: { name: "Autumn Note 3.1.0", url: "https://github.com/cmm-cmm/Autumn-Note" },
  },
  {
    id: "portofolio-terminal",
    name: "habibiahmada",
    kind: "CLI portfolio",
    description:
      "This portfolio as a terminal app. A Go TUI built with Bubble Tea, shipped as one binary per platform through npx and served over SSH.",
    facts: ["Go + Bubble Tea", "5 platform builds", "Live portfolio sync"],
    language: "Go",
    license: "MIT",
    install: "npx habibiahmada",
    repoUrl: "https://github.com/habibiahmada/portofolio-terminal",
    siteUrl: "https://www.npmjs.com/package/habibiahmada",
    siteLabel: "npm",
  },
  {
    id: "emoji-picker",
    name: "emoji-picker",
    kind: "Linux desktop app",
    description:
      "An emoji popup for low-RAM Linux X11 desktops. Press Win+. and the emoji lands in the window you were typing in. No Electron, no Flatpak.",
    facts: ["~225 KB binary", "~30 MB idle", "1,914 emoji"],
    language: "C + GTK3",
    license: "MIT",
    repoUrl: "https://github.com/habibiahmada/emoji-picker",
  },
]

export const GITHUB_PROFILE_URL = "https://github.com/habibiahmada"
