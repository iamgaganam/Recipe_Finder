import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import Navbar from "./components/common/Navbar";
import SearchPage from "./components/search/SearchPage";
import RecipeDetailPage from "./components/recipe/RecipeDetailPage";
import FavoritesPage from "./components/favorites/FavoritesPage";

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <div className="flex min-h-screen flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
          <footer className="bg-gray-900 py-6 text-center text-sm text-gray-400">
            <p>
              Recipe Finder &copy;{new Date().getFullYear()} - Developed by{" "}
              <a
                href="https://www.linkedin.com/in/gagana-methmal/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-orange-400 transition-colors hover:text-orange-300"
              >
                Gagana Methmal
              </a>
            </p>
          </footer>
        </div>
      </FavoritesProvider>
    </BrowserRouter>
  );
}
