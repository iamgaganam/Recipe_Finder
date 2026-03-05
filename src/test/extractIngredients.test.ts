import { describe, it, expect } from "vitest";
import { extractIngredients } from "../api/mealdb";
import type { MealDetail } from "../types";

// Minimal mock meal for testing ingredient extraction
function makeMeal(overrides: Partial<MealDetail> = {}): MealDetail {
  const base: Record<string, unknown> = {
    idMeal: "1",
    strMeal: "Test Meal",
    strDrinkAlternate: null,
    strCategory: "Test",
    strArea: "Test",
    strInstructions: "Do something.",
    strMealThumb: "https://example.com/img.jpg",
    strTags: null,
    strYoutube: null,
    strSource: null,
  };
  // Initialize all 20 ingredient/measure slots to null
  for (let i = 1; i <= 20; i++) {
    base[`strIngredient${i}`] = null;
    base[`strMeasure${i}`] = null;
  }
  return { ...base, ...overrides } as unknown as MealDetail;
}

describe("extractIngredients", () => {
  it("returns empty array when no ingredients", () => {
    const meal = makeMeal();
    expect(extractIngredients(meal)).toEqual([]);
  });

  it("extracts valid ingredients and skips empty ones", () => {
    const meal = makeMeal({
      strIngredient1: "Chicken",
      strMeasure1: "500g",
      strIngredient2: "Salt",
      strMeasure2: "1 tsp",
      strIngredient3: "  ",
      strMeasure3: "some",
    } as Partial<MealDetail>);

    const result = extractIngredients(meal);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: "Chicken", measure: "500g" });
    expect(result[1]).toEqual({ name: "Salt", measure: "1 tsp" });
  });

  it("handles missing measures gracefully", () => {
    const meal = makeMeal({
      strIngredient1: "Pepper",
      strMeasure1: null,
    } as Partial<MealDetail>);

    const result = extractIngredients(meal);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ name: "Pepper", measure: "" });
  });
});
