import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "./EmptyState";
import { SkeletonTableRow } from "./SkeletonLoader";

function DataTable({
  data,
  columns,
  filters = [],
  searchable = true,
  searchPlaceholder = "Search...",
  loading = false,
  pageSize = 8,
  className,
  onFilterChange,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [activeFilters, setActiveFilters] = useState({});

  const filtered = data.filter((item) => {
    const matchesSearch =
      !search ||
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      );

    const matchesFilters = filters.every((filter) => {
      const activeValue = activeFilters[filter.key];

      if (!activeValue || activeValue === "all") {
        return true;
      }

      return String(item[filter.key] ?? "").toLowerCase() === activeValue.toLowerCase();
    });

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const handleFilter = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    if (onFilterChange) onFilterChange(key, value);
    setPage(0);
  };

  return (
    <div className={cn("card-modern p-0 overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 border-b border-border/50">
        {searchable && (
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder={searchPlaceholder}
              className="pl-10 h-11 bg-muted/50 border-0 rounded-xl text-[15px]"
            />
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={activeFilters[filter.key] || "all"}
              onValueChange={(v) => handleFilter(filter.key, v)}
            >
              <SelectTrigger className="h-11 w-auto min-w-[138px] bg-muted/50 border-0 rounded-xl text-[15px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>

              <SelectContent>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length}>
                    <SkeletonTableRow />
                  </td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    title="No results"
                    description="Try adjusting your search or filters."
                  />
                </td>
              </tr>
            ) : (
              paginated.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-5 py-4 text-[15px]",
                        col.className
                      )}
                    >
                      {col.render
                        ? col.render(item)
                        : String(item[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-border/50">
          <span className="text-[13px] text-muted-foreground">
            Showing {page * pageSize + 1}-
            {Math.min((page + 1) * pageSize, filtered.length)} of{" "}
            {filtered.length}
          </span>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
