import { useState } from "react";
import RecipeCard from "./RecipeCard";

interface PaginatedGridProps {
  items: {
    id: string;
    name: string;
    image: string;
    category?: string;
    area?: string;
  }[];
  pageSize?: number;
}

// Paginated grid with "Load More" infinite-scroll style button
export default function PaginatedGrid({
  items,
  pageSize = 12,
}: PaginatedGridProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg">No recipes found. Try a different search!</p>
      </div>
    );
  }

  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((item) => (
          <RecipeCard key={item.id} {...item} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + pageSize)}
            className="rounded-lg bg-gray-800 px-8 py-3 font-medium text-white transition-colors hover:bg-gray-700"
          >
            Load More ({items.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </>
  );
}
