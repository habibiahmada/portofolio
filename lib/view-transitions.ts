/**
 * Shared names for React <ViewTransition> morphs. The card and the detail
 * page must use the same name for the browser to animate one into the other,
 * so both sides import these helpers instead of building strings inline.
 */
export function projectMediaTransitionName(projectId: string | number): string {
  return `project-media-${projectId}`;
}

export function blogCoverTransitionName(slug: string): string {
  // view-transition-name must be a valid CSS ident; slugs are [a-z0-9-].
  return `blog-cover-${slug}`;
}
