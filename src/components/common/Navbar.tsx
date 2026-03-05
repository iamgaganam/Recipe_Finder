import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getRandomMeal } from "../../api/mealdb";

export default function Navbar() {
  const navigate = useNavigate();
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRandom = async () => {
    setLoadingRandom(true);
    try {
      const meal = await getRandomMeal();
      if (meal) navigate(`/recipe/${meal.idMeal}`);
    } finally {
      setLoadingRandom(false);
      setMenuOpen(false);
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors ${isActive ? "text-amber-400 font-semibold" : "text-gray-200 hover:text-amber-300"}`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold text-white"
        >
          <img
            src="/logo.png"
            alt="Recipe Finder logo"
            className="h-9 w-9 rounded-full object-contain ring-1 ring-white/20"
          />
          <span>Recipe Finder</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/favorites" className={linkClass}>
            {"\u2764\uFE0F Favorites"}
          </NavLink>
          <button
            onClick={handleRandom}
            disabled={loadingRandom}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
          >
            {loadingRandom ? "Loading..." : "\u{1F3B2} Random Recipe"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-200 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-700 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink
              to="/"
              end
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/favorites"
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {"\u2764\uFE0F Favorites"}
            </NavLink>
            <button
              onClick={handleRandom}
              disabled={loadingRandom}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              {loadingRandom ? "Loading..." : "\u{1F3B2} Random Recipe"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
