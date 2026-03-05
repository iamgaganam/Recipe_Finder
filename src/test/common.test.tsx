import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

describe("Loader", () => {
  it("renders a spinning element", () => {
    const { container } = render(<Loader />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});

describe("ErrorMessage", () => {
  it("displays the error message", () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders a retry button when onRetry is provided", () => {
    render(<ErrorMessage message="Error" onRetry={() => {}} />);
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.queryByText("Try Again")).not.toBeInTheDocument();
  });
});
