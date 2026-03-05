import { describe, it, expect, beforeEach } from "vitest";
import {
  getFavoriteIds,
  addFavoriteId,
  removeFavoriteId,
  isFavorite,
  saveFavoriteIds,
} from "../utils/favorites";

describe("favorites localStorage utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty array when nothing stored", () => {
    expect(getFavoriteIds()).toEqual([]);
  });

  it("adds a favorite id", () => {
    const result = addFavoriteId("123");
    expect(result).toContain("123");
    expect(getFavoriteIds()).toContain("123");
  });

  it("does not add duplicate ids", () => {
    addFavoriteId("123");
    addFavoriteId("123");
    expect(getFavoriteIds()).toEqual(["123"]);
  });

  it("removes a favorite id", () => {
    saveFavoriteIds(["1", "2", "3"]);
    const result = removeFavoriteId("2");
    expect(result).toEqual(["1", "3"]);
    expect(getFavoriteIds()).toEqual(["1", "3"]);
  });

  it("isFavorite returns correct boolean", () => {
    saveFavoriteIds(["42"]);
    expect(isFavorite("42")).toBe(true);
    expect(isFavorite("99")).toBe(false);
  });
});
