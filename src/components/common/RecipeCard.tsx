import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";

interface RecipeCardProps {
  id: string;
  name: string;
  image: string;
  category?: string;
  area?: string;
}

export default function RecipeCard({
  id,
  name,
  image,
  category,
  area,
}: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(id);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/recipe/${id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={`${image}/medium`}
            alt={name}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Category / Area badges */}
          <div className="absolute bottom-2 left-2 flex gap-1.5">
            {category && (
              <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {category}
              </span>
            )}
            {area && (
              <span className="rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {area}
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-base font-semibold text-gray-800">
            {name}
          </h3>
        </div>
      </Link>

      {/* Favorite toggle */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(id);
        }}
        className="absolute right-2 top-2 rounded-full bg-white/80 p-2 shadow backdrop-blur-sm transition-colors hover:bg-white"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          className={`h-5 w-5 transition-colors ${fav ? "fill-red-500 text-red-500" : "fill-none text-gray-500"}`}
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
  );
}
