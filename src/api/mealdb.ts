import type {
  MealsResponse,
  FilterResponse,
  CategoriesResponse,
  AreasResponse,
  MealDetail,
  MealSummary,
  Ingredient,
} from "../types";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Extract non-empty ingredients & measures from a meal detail object
export function extractIngredients(meal: MealDetail): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}` as keyof MealDetail] as string | null;
    const measure = meal[`strMeasure${i}` as keyof MealDetail] as string | null;
    if (name && name.trim()) {
      ingredients.push({ name: name.trim(), measure: measure?.trim() ?? "" });
    }
  }
  return ingredients;
}

// Search meals by name
export async function searchByName(query: string): Promise<MealDetail[]> {
  const res = await fetch(
    `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch recipes");
  const data: MealsResponse = await res.json();
  return data.meals ?? [];
}

// Filter meals by main ingredient (returns summaries only)
export async function filterByIngredient(
  ingredient: string,
): Promise<MealSummary[]> {
  const res = await fetch(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch recipes");
  const data: FilterResponse = await res.json();
  return data.meals ?? [];
}

// Filter meals by category
export async function filterByCategory(
  category: string,
): Promise<MealSummary[]> {
  const res = await fetch(
    `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch recipes");
  const data: FilterResponse = await res.json();
  return data.meals ?? [];
}

// Filter meals by area/cuisine
export async function filterByArea(area: string): Promise<MealSummary[]> {
  const res = await fetch(
    `${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch recipes");
  const data: FilterResponse = await res.json();
  return data.meals ?? [];
}

// Look up full meal details by ID
export async function getMealById(id: string): Promise<MealDetail | null> {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Failed to fetch recipe details");
  const data: MealsResponse = await res.json();
  return data.meals?.[0] ?? null;
}

// Get a random meal
export async function getRandomMeal(): Promise<MealDetail | null> {
  const res = await fetch(`${BASE_URL}/random.php`);
  if (!res.ok) throw new Error("Failed to fetch random recipe");
  const data: MealsResponse = await res.json();
  return data.meals?.[0] ?? null;
}

// List all categories
export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/list.php?c=list`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data: CategoriesResponse = await res.json();
  return data.meals.map((c) => c.strCategory);
}

// List all areas/cuisines
export async function getAreas(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/list.php?a=list`);
  if (!res.ok) throw new Error("Failed to fetch areas");
  const data: AreasResponse = await res.json();
  return data.meals.map((a) => a.strArea);
}
