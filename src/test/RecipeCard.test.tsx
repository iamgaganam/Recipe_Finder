import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesProvider } from "../context/FavoritesContext";
import RecipeCard from "../components/common/RecipeCard";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <FavoritesProvider>{ui}</FavoritesProvider>
    </MemoryRouter>,
  );
}

describe("RecipeCard", () => {
  it("renders recipe name and image", () => {
    renderWithProviders(
      <RecipeCard id="1" name="Pasta" image="https://example.com/pasta.jpg" />,
    );

    expect(screen.getByText("Pasta")).toBeInTheDocument();
    expect(screen.getByAltText("Pasta")).toBeInTheDocument();
  });

  it("renders category and area badges when provided", () => {
    renderWithProviders(
      <RecipeCard
        id="2"
        name="Sushi"
        image="https://example.com/sushi.jpg"
        category="Seafood"
        area="Japanese"
      />,
    );

    expect(screen.getByText("Seafood")).toBeInTheDocument();
    expect(screen.getByText("Japanese")).toBeInTheDocument();
  });

  it("renders a favorite toggle button", () => {
    renderWithProviders(
      <RecipeCard id="3" name="Tacos" image="https://example.com/tacos.jpg" />,
    );

    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });
});
