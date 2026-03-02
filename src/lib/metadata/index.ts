import { Metadata } from 'next';

/**
 * Parameters for generating page metadata
 */
export interface PageMetadataParams {
  title: string;
  description: string;
  image?: string;
  locale: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

/**
 * Generate type-safe metadata for Next.js pages
 * Supports OpenGraph and Twitter card metadata
 * 
 * @param params - Metadata parameters
 * @returns Next.js Metadata object
 */
export function generatePageMetadata(params: PageMetadataParams): Metadata {
  const {
    title,
    description,
    image,
    locale,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    tags,
  } = params;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const defaultImage = '/open-graph/og-image.png';
  const ogImage = image || defaultImage;

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      locale,
      url: baseUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      tags,
    };
  }

  // Add keywords if tags are provided
  if (tags && tags.length > 0) {
    metadata.keywords = tags;
  }

  return metadata;
}

/**
 * Generate metadata for blog article pages
 * 
 * @param article - Article data
 * @returns Next.js Metadata object
 */
export function generateArticleMetadata(article: {
  title: string;
  description: string;
  image?: string;
  locale: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
}): Metadata {
  return generatePageMetadata({
    title: article.title,
    description: article.description,
    image: article.image,
    locale: article.locale,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    author: article.author,
    tags: article.tags,
  });
}

/**
 * Generate metadata for project pages
 * 
 * @param project - Project data
 * @returns Next.js Metadata object
 */
export function generateProjectMetadata(project: {
  title: string;
  description: string;
  image?: string;
  locale: string;
}): Metadata {
  return generatePageMetadata({
    title: project.title,
    description: project.description,
    image: project.image,
    locale: project.locale,
    type: 'website',
  });
}
