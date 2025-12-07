import React from "react";
import ArticleCard from "./articlecard";
import ArticleCardSkeleton from "./articlecardskeleton";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  href: string;
}

interface ArticleGridProps {
  articles: Article[];
  loading?: boolean;
  error?: string | null;
  columns?: number; // jumlah kolom
}

const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  loading = false,
  error = null,
  columns = 3,
}) => {
  if (loading) {
    return (
      <div className={`grid gap-8 lg:grid-cols-${columns}`}>
        {Array.from({ length: columns }).map((_, i) => (
        <ArticleCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className={`grid gap-8 lg:grid-cols-${columns}`}>
        {articles.map((article, idx) => (
            <ArticleCard key={`${article.id}-${idx}`} article={article} />
        ))}
    </div>
  );
};

export default ArticleGrid;
