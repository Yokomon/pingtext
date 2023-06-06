import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Homepage renders on mount", () => {
  render(<Home />);
  test("It renders the default hompage", () => {
    const banner = screen.getByRole("heading", { name: /ping text/i });
    expect(banner).toBeInTheDocument();
  });
});
