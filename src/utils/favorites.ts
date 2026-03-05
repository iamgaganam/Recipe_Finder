// localStorage helpers for favorite recipes

const FAVORITES_KEY = "recipe_finder_favorites";

export function getFavoriteIds(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFavoriteIds(ids: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function addFavoriteId(id: string): string[] {
  const ids = getFavoriteIds();
  if (!ids.includes(id)) {
    ids.push(id);
    saveFavoriteIds(ids);
  }
  return ids;
}

export function removeFavoriteId(id: string): string[] {
  const ids = getFavoriteIds().filter((fid) => fid !== id);
  saveFavoriteIds(ids);
  return ids;
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id);
}
