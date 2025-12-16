import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../card";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "../../button";
import { Badge } from "../../badge";

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

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <Card className="group bg-white dark:bg-slate-950/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800/50 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden transition-color duration-300">
    <CardHeader className="p-0">
      <div className="relative overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          width={800}
          height={400}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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
          <span>
            {new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(article.date))}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{article.readTime} read</span>
        </div>
      </div>

      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 line-clamp-2">
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
              className="text-xs border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-300"
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

export default ArticleCard;