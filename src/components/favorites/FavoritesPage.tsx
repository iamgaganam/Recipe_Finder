import { useState, useEffect } from "react";
import { useFavorites } from "../../context/FavoritesContext";
import { getMealById } from "../../api/mealdb";
import type { MealDetail } from "../../types";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import PaginatedGrid from "../common/PaginatedGrid";

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const [meals, setMeals] = useState<MealDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setMeals([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          favoriteIds.map((id) => getMealById(id)),
        );
        setMeals(results.filter((m): m is MealDetail => m !== null));
      } catch {
        setError("Failed to load favorite recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds]);

  const gridItems = meals.map((m) => ({
    id: m.idMeal,
    name: m.strMeal,
    image: m.strMealThumb,
    category: m.strCategory,
    area: m.strArea,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          ❤️ Favorite Recipes
        </h1>
        <p className="mt-2 text-gray-500">
          {favoriteIds.length === 0
            ? "You haven't saved any favorites yet. Start exploring!"
            : `${favoriteIds.length} saved recipe${favoriteIds.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && favoriteIds.length === 0 && (
        <div className="py-16 text-center text-gray-400">
          <p className="mb-2 text-6xl">💔</p>
          <p className="text-lg">
            No favorites yet. Click the heart on any recipe to save it!
          </p>
        </div>
      )}
      {!loading && !error && favoriteIds.length > 0 && (
        <PaginatedGrid items={gridItems} />
      )}
    </div>
  );
}
