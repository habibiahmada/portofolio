import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps a page's content so route changes animate:
 * - `nav-forward` (opening a card) slides the new page in from the right,
 * - `nav-back` (back links) slides it in from the left,
 * - any other navigation (header, footer) does a short fade and rise.
 * Header stays anchored (see `site-header` in globals.css). Browsers without
 * the View Transitions API just swap pages, same as before.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
