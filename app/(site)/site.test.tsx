import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Homepage", () => {
  render(<Home />);
  test("It renders the default hompage", () => {
    const heading = screen.getByRole("heading", { name: /index homepage/i });

    expect(heading).toBeInTheDocument();
  });
});
