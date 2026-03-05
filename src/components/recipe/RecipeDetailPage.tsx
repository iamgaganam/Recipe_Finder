import { useParams, Link } from "react-router-dom";
import { getMealById, extractIngredients } from "../../api/mealdb";
import { useFavorites } from "../../context/FavoritesContext";
import { useFetch } from "../../hooks/useFetch";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: meal,
    loading,
    error,
    refetch,
  } = useFetch(() => getMealById(id!), [id]);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!meal) return <ErrorMessage message="Recipe not found." />;

  const ingredients = extractIngredients(meal);
  const fav = isFavorite(meal.idMeal);

  // Extract YouTube embed URL
  const youtubeEmbedUrl = meal.strYoutube
    ? meal.strYoutube.replace("watch?v=", "embed/")
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-amber-600"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to search
      </Link>

      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="relative">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="h-64 w-full object-cover sm:h-80 lg:h-96"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {meal.strMeal}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {meal.strCategory && (
                <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-medium text-white">
                  {meal.strCategory}
                </span>
              )}
              {meal.strArea && (
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white">
                  {meal.strArea}
                </span>
              )}
              {meal.strTags &&
                meal.strTags.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-600 px-3 py-1 text-sm text-gray-200"
                  >
                    {tag.trim()}
                  </span>
                ))}
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(meal.idMeal)}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-3 shadow-md backdrop-blur-sm transition-transform hover:scale-110"
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              className={`h-6 w-6 transition-colors ${fav ? "fill-red-500 text-red-500" : "fill-none text-gray-500"}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Two-column layout: Ingredients + Instructions */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Ingredients */}
            <div className="lg:col-span-1">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Ingredients
              </h2>
              <ul className="space-y-2">
                {ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg bg-amber-50 p-3"
                  >
                    <img
                      src={`https://www.themealdb.com/images/ingredients/${encodeURIComponent(ing.name)}-Small.png`}
                      alt={ing.name}
                      className="h-8 w-8 rounded object-contain"
                      loading="lazy"
                    />
                    <div>
                      <span className="font-medium text-gray-800">
                        {ing.name}
                      </span>
                      {ing.measure && (
                        <span className="ml-1 text-sm text-gray-500">
                          — {ing.measure}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Instructions
              </h2>
              <div className="prose prose-gray max-w-none">
                {meal.strInstructions
                  .split("\n")
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="mb-3 leading-relaxed text-gray-600">
                      {para}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* External links */}
          <div className="mt-8 flex flex-wrap gap-4 border-t border-gray-100 pt-6">
            {meal.strSource && (
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Original Source
              </a>
            )}
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch Video
              </a>
            )}
          </div>

          {/* Embedded YouTube video */}
          {youtubeEmbedUrl && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Video Tutorial
              </h2>
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={youtubeEmbedUrl}
                  title={`${meal.strMeal} video tutorial`}
                  className="h-full w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
