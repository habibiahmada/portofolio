export interface ArticleData {
    id: string;
    image_url?: string;
    image?: string;
    published: boolean;
    published_at?: string;
    created_at: string;
    updated_at?: string;
    translation?: {
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        tags: string[];
        read_time: string;
    } | null;
}

/**
 * Fetches a single article by its slug.
 * This is designed for use in Server Components.
 */
export async function getArticleBySlug(slug: string, locale: string): Promise<ArticleData | null> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

    try {
        const res = await fetch(
            `${baseUrl}/api/public/articles/by-slug/${slug}?lang=${locale}`,
            { cache: 'no-store' }
        );

        console.table(res);
        

        if (!res.ok) return null;

        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error(`Error fetching article by slug [${slug}]:`, error);
        return null;
    }
}
