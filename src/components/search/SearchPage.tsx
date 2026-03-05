import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  searchByName,
  filterByIngredient,
  filterByCategory,
  filterByArea,
  getCategories,
  getAreas,
} from "../../api/mealdb";
import type { MealDetail, MealSummary, SearchMode } from "../../types";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import PaginatedGrid from "../common/PaginatedGrid";

// Normalize both MealDetail and MealSummary into a uniform shape for the grid
function toGridItem(meal: MealDetail | MealSummary) {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    category: "strCategory" in meal ? meal.strCategory : undefined,
    area: "strArea" in meal ? meal.strArea : undefined,
  };
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [mode, setMode] = useState<SearchMode>(
    (searchParams.get("mode") as SearchMode) ?? "name",
  );
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [area, setArea] = useState(searchParams.get("area") ?? "");

  const [results, setResults] = useState<ReturnType<typeof toGridItem>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(true);

  // Load filter options on mount
  useEffect(() => {
    let isMounted = true;

    const loadFilterOptions = async () => {
      setFiltersLoading(true);
      try {
        const [fetchedCategories, fetchedAreas] = await Promise.all([
          getCategories(),
          getAreas(),
        ]);
        if (!isMounted) return;
        setCategories(fetchedCategories);
        setAreas(fetchedAreas);
      } catch {
        if (!isMounted) return;
        setCategories([]);
        setAreas([]);
      } finally {
        if (isMounted) {
          setFiltersLoading(false);
        }
      }
    };

    loadFilterOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const performSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      let meals: (MealDetail | MealSummary)[] = [];

      if (category) {
        meals = await filterByCategory(category);
      } else if (area) {
        meals = await filterByArea(area);
      } else if (query.trim()) {
        if (mode === "name") {
          meals = await searchByName(query.trim());
        } else {
          meals = await filterByIngredient(query.trim());
        }
      }

      setResults(meals.map(toGridItem));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [query, mode, category, area]);

  // Trigger search on URL param changes
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const m = (searchParams.get("mode") as SearchMode) ?? "name";
    const c = searchParams.get("category") ?? "";
    const a = searchParams.get("area") ?? "";
    setQuery(q);
    setMode(m);
    setCategory(c);
    setArea(a);
    if (q || c || a) {
      // Delay to allow state to update
      setTimeout(() => {}, 0);
    }
  }, [searchParams]);

  // Auto-search when filters change from URL
  useEffect(() => {
    if (query || category || area) {
      performSearch();
    }
  }, [performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !category && !area) return;
    const params: Record<string, string> = {};
    if (query.trim()) {
      params.q = query.trim();
      params.mode = mode;
    }
    if (category) params.category = category;
    if (area) params.area = area;
    setSearchParams(params);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setArea("");
    setQuery("");
    if (val) {
      setSearchParams({ category: val });
    } else {
      setSearchParams({});
      setHasSearched(false);
    }
  };

  const handleAreaChange = (val: string) => {
    setArea(val);
    setCategory("");
    setQuery("");
    if (val) {
      setSearchParams({ area: val });
    } else {
      setSearchParams({});
      setHasSearched(false);
    }
  };

  const filterSelectClass =
    "min-w-[220px] appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-700 shadow-sm outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero / Search Section */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900 sm:text-5xl">
          Discover Delicious Recipes
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-500">
          Search thousands of recipes by name or ingredient, or explore by
          category and cuisine.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mx-auto mb-6 max-w-3xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Mode toggle */}
          <div className="flex rounded-lg border border-gray-300 bg-gray-50">
            <button
              type="button"
              onClick={() => setMode("name")}
              className={`rounded-l-lg px-4 py-3 text-sm font-medium transition-colors ${
                mode === "name"
                  ? "bg-amber-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              By Name
            </button>
            <button
              type="button"
              onClick={() => setMode("ingredient")}
              className={`rounded-r-lg px-4 py-3 text-sm font-medium transition-colors ${
                mode === "ingredient"
                  ? "bg-amber-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              By Ingredient
            </button>
          </div>

          {/* Search input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCategory("");
                setArea("");
              }}
              placeholder={
                mode === "name"
                  ? "Search by recipe name…"
                  : "Search by ingredient…"
              }
              className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 text-gray-800 shadow-sm outline-none transition-shadow focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-amber-500 p-2 text-white transition-colors hover:bg-amber-600"
              aria-label="Search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Filters */}
      <div className="mx-auto mb-10 flex max-w-3xl flex-wrap items-center justify-center gap-4">
        <div className="relative">
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={filterSelectClass}
            disabled={filtersLoading}
            aria-label="Filter by category"
          >
            <option value="">
              {filtersLoading ? "Loading categories..." : "All Categories"}
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div className="relative">
          <select
            value={area}
            onChange={(e) => handleAreaChange(e.target.value)}
            className={filterSelectClass}
            disabled={filtersLoading}
            aria-label="Filter by cuisine"
          >
            <option value="">
              {filtersLoading ? "Loading cuisines..." : "All Cuisines"}
            </option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Results */}
      {loading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={performSearch} />}
      {!loading && !error && hasSearched && <PaginatedGrid items={results} />}

      {/* Initial state - show prompt */}
      {!loading && !error && !hasSearched && (
        <div className="py-16 text-center text-gray-400">
          <p className="text-6xl mb-4">🍽️</p>
          <p className="text-lg">Start typing to find your next meal!</p>
        </div>
      )}
    </div>
  );
}
