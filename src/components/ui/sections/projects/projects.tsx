import { useEffect, useState } from "react";
import {
  Eye,
  ExternalLink,
  Github,
  Search,
  Filter,
  Calendar,
  BarChart3,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Projects() {
  const { resolvedTheme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("projects");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  const projects = [
    {
      id: "dashboard-analytics",
      title: "Dashboard Analytics",
      description:
        "Platform analytics real-time dengan visualisasi data interaktif dan reporting otomatis.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      category: "web-app",
      tags: ["React", "Next.js", "TypeScript"],
      year: "2024",
      icon: BarChart3,
    },
    {
      id: "ecommerce-platform",
      title: "E-commerce Platform",
      description:
        "Platform e-commerce lengkap dengan payment gateway, inventory management, dan admin panel.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      category: "ecommerce",
      tags: ["React", "Redux", "Tailwind"],
      year: "2024",
      icon: ShoppingBag,
    },
    {
      id: "mobile-banking",
      title: "Mobile Banking App",
      description:
        "Aplikasi mobile banking dengan fitur transfer, pembayaran, dan financial tracking.",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      category: "mobile",
      tags: ["React Native", "Expo", "Firebase"],
      year: "2023",
      icon: Smartphone,
    },
    {
      id: "crm-dashboard",
      title: "CRM Dashboard",
      description:
        "Customer Relationship Management dashboard dengan fitur lead tracking dan sales analytics.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      category: "dashboard",
      tags: ["Vue.js", "Nuxt.js", "Vuetify"],
      year: "2023",
      icon: BarChart3,
    },
    {
      id: "collaboration-platform",
      title: "Collaboration Platform",
      description:
        "Platform kolaborasi tim dengan real-time messaging, file sharing, dan project management.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      category: "web-app",
      tags: ["React", "GraphQL", "Apollo"],
      year: "2023",
      icon: Filter,
    },
    {
      id: "fashion-ecommerce",
      title: "Fashion E-commerce",
      description:
        "Custom Shopify theme untuk brand fashion dengan fitur AR try-on dan personalization.",
      image:
        "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&h=400&fit=crop",
      category: "ecommerce",
      tags: ["Shopify", "Liquid", "JavaScript"],
      year: "2022",
      icon: ShoppingBag,
    },
  ];

  const filters = [
    { id: "all", label: "Semua", icon: Filter },
    { id: "web-app", label: "Web App", icon: Filter },
    { id: "ecommerce", label: "E-commerce", icon: ShoppingBag },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "mobile", label: "Mobile", icon: Smartphone },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      activeFilter === "all" || project.category === activeFilter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const getTagColor = (tag: string): string => {
    const colors: Record<string, string> = {
      React:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      "Next.js":
        "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300",
      TypeScript:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      Redux:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      Tailwind:
        "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300",
      "React Native":
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      "Vue.js":
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
      GraphQL:
        "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
      Shopify:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    };

    return (
      colors[tag] ||
      "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300"
    );
  };

  return (
    <section
      id="projects"
      className={`relative overflow-hidden transition-all duration-700 py-28 sm:py-36 lg:py-40 pb-5 
        ${isDark ? "bg-slate-950" : "bg-gradient-to-b from-white to-slate-50"}`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight block bg-gradient-to-r ${
              isDark
                ? "from-cyan-400 via-blue-400 to-cyan-400"
                : "from-blue-600 via-cyan-600 to-blue-600"
            } bg-clip-text text-transparent mb-5`}
          >
            {t("titleLine1")}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t("description1")}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-200 dark:hover:border-blue-800"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;
            return (
              <div
                key={project.id}
                className="group bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-500 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-600/10 dark:hover:shadow-blue-400/10 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {project.year}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(
                          tag
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors">
                      <Eye className="w-4 h-4" />
                      Lihat Detail
                    </button>
                    <div className="flex items-center gap-3">
                      <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 flex items-center justify-center transition-all duration-200">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 flex items-center justify-center transition-all duration-200">
                        <Github className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
