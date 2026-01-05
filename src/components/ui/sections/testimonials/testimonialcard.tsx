import Image from "next/image";
import { Star, Quote, Briefcase } from "lucide-react";
import { Card } from "../../card";
import { Testimonial } from "@/lib/types/database";

interface Props {
  testimonial: Testimonial;
  isAnimating: boolean;
}

const TestimonialCard: React.FC<Props> = ({
  testimonial,
  isAnimating,
}) => {
  const rating = testimonial.rating ?? 0;
  const content =
    testimonial.testimonial_translations?.[0]?.content;

  return (
    <div className="max-w-6xl mx-auto">
      <Card
        className={`
          relative p-8 lg:p-12 backdrop-blur-xl
          bg-white/80 dark:bg-slate-950/80
          border border-slate-200/50 dark:border-slate-700/50
          transition-transform duration-300
          ${isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"}
        `}
      >
        {/* Quote Icon */}
        <div className="absolute -top-4 left-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full flex items-center justify-center">
            <Quote className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Content */}
          <div className="lg:col-span-2">
            <div className="flex gap-1 mb-6">
              {Array.from({ length: rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed">
              &quot;{content}&quot;
            </blockquote>
          </div>

          {/* Client Info */}
          <div>
            <div className="
              p-6 rounded-xl
              bg-gradient-to-br from-slate-50 to-blue-50
              dark:from-slate-800 dark:to-slate-800/50
              border border-slate-200/50 dark:border-slate-700/50
            ">
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.avatar || ""}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
                />

                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {testimonial.name}
                  </p>

                  <p className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <Briefcase className="w-4 h-4" />
                    {testimonial.role}
                  </p>

                  <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestimonialCard;
