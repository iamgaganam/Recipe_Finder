// API responses types and app domain models

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  // Ingredients & measures are numbered 1-20
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

export interface Ingredient {
  name: string;
  measure: string;
}

export interface Category {
  strCategory: string;
}

export interface Area {
  strArea: string;
}

// API response wrappers
export interface MealsResponse {
  meals: MealDetail[] | null;
}

export interface FilterResponse {
  meals: MealSummary[] | null;
}

export interface CategoriesResponse {
  meals: Category[];
}

export interface AreasResponse {
  meals: Area[];
}

// Search modes
export type SearchMode = "name" | "ingredient";
