/**
 * Structured Data Generator for JSON-LD
 * Generates schema.org compliant structured data for SEO
 */

/**
 * Parameters for generating BlogPosting schema
 */
export interface BlogPostingSchemaParams {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  modifiedAt: string;
  image: string;
  url?: string;
  tags?: string[];
}

/**
 * Generate BlogPosting JSON-LD structured data
 * Follows schema.org BlogPosting specification
 * 
 * @param params - Blog posting parameters
 * @returns JSON-LD structured data object
 */
export function generateBlogPostingSchema(params: BlogPostingSchemaParams) {
  const {
    title,
    description,
    author,
    publishedAt,
    modifiedAt,
    image,
    url,
    tags,
  } = params;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const articleUrl = url || baseUrl;

  // Ensure image URL is absolute
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: publishedAt,
    dateModified: modifiedAt,
    image: imageUrl,
    url: articleUrl,
    ...(tags && tags.length > 0 && { keywords: tags.join(', ') }),
  };

  return schema;
}

/**
 * Convert structured data object to JSON-LD script tag string
 * 
 * @param schema - Structured data object
 * @returns JSON-LD script tag as string
 */
export function toJsonLdScript(schema: Record<string, unknown>): string {
  return JSON.stringify(schema);
}

/**
 * Generate Person schema for author information
 * 
 * @param name - Author name
 * @param url - Author profile URL (optional)
 * @returns Person schema object
 */
export function generatePersonSchema(name: string, url?: string) {
  return {
    '@type': 'Person',
    name,
    ...(url && { url }),
  };
}

/**
 * Generate Organization schema for website owner
 * 
 * @param name - Organization name
 * @param url - Organization URL
 * @param logo - Organization logo URL (optional)
 * @returns Organization schema object
 */
export function generateOrganizationSchema(
  name: string,
  url: string,
  logo?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const logoUrl = logo ? (logo.startsWith('http') ? logo : `${baseUrl}${logo}`) : undefined;

  return {
    '@type': 'Organization',
    name,
    url,
    ...(logoUrl && { logo: logoUrl }),
  };
}
