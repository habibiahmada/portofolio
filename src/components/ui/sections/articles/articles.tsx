import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";

// Types
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

// Dummy Data
const articles: Article[] = [
  {
    id: 1,
    title: "Optimasi Performance Next.js untuk Production",
    excerpt:
      "Tips dan trik untuk meningkatkan performa aplikasi Next.js, termasuk code splitting, image optimization, dan caching strategies untuk aplikasi skala enterprise.",
    date: "15 November 2024",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop&q=80",
    tags: ["Next.js", "Performance", "Optimization"],
    href: "/articles/nextjs-performance-optimization",
  },
  {
    id: 2,
    title: "Advanced React Hooks Patterns",
    excerpt:
      "Pelajari pattern-pattern advanced untuk React Hooks seperti custom hooks, useReducer untuk complex state, dan optimization techniques yang jarang diketahui developer.",
    date: "10 November 2024",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&q=80",
    tags: ["React", "Hooks", "Advanced"],
    href: "/articles/advanced-react-hooks",
  },
  {
    id: 3,
    title: "Design System Best Practices",
    excerpt:
      "Cara membangun design system yang scalable dan maintainable untuk tim developer dan designer dengan component library modern dan design tokens.",
    date: "5 November 2024",
    readTime: "4 min",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop&q=80",
    tags: ["Design System", "UI/UX", "Scalability"],
    href: "/articles/design-system-best-practices",
  },
];

// Sub-component
const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <Card className="group bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800/50 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
    <CardHeader className="p-0">
      <div className="relative overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          width={800}
          height={400}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent dark:from-slate-900/60" />
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className="bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30 backdrop-blur-sm"
          >
            Featured
          </Badge>
        </div>
      </div>
    </CardHeader>

    <CardContent className="p-6">
      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{article.date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{article.readTime} read</span>
        </div>
      </div>

      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300 line-clamp-2">
        <Link href={article.href} className="hover:underline">
          {article.title}
        </Link>
      </CardTitle>

      <CardDescription className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
        {article.excerpt}
      </CardDescription>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag, i) => (
            <Badge
              key={i}
              variant="outline"
              className="text-xs border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={article.href}>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-blue-500/10 p-2"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

const ArticlesSection: React.FC = () => {
  return (
    <section
      className="
        relative min-h-screen overflow-hidden
        py-28 sm:py-36 lg:py-40
        bg-gray-50 dark:bg-slate-950
      "
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23334155%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <div className="mb-20 text-center">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight block bg-gradient-to-r
              from-cyan-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-5
            "
          >
            Artikel & Media
          </h2>

          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-700 dark:text-slate-400">
            Artikel terbaru, tutorial mendalam, dan insight tentang pengembangan
            web modern dari perspektif praktisi industri
          </p>
        </div>

        {/* Articles */}
        <div className="mb-16 grid gap-8 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="#">
            <Button
              size="lg"
              className="px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Jelajahi Semua Artikel
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;