import { Button } from "../../button";
import { Filter, ShoppingBag, BarChart3, Smartphone } from "lucide-react";

const filters = [
  { id: "all", label: "Semua", icon: Filter },
  { id: "web-app", label: "Web App", icon: Filter },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingBag },
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "mobile", label: "Mobile", icon: Smartphone },
];

interface ProjectFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function ProjectFilters({ activeFilter, setActiveFilter }: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {filters.map((filter) => {
        const IconComponent = filter.icon;
        return (
          <Button
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
          </Button>
        );
      })}
    </div>
  );
}
