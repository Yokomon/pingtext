import { render, screen } from "@testing-library/react";
import { Button } from "../Button";

describe("Button component", () => {
  test("Button should be enabled by default", () => {
    render(<Button>Log in</Button>);

    const button = screen.getByRole("button", { name: "Log in" });

    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test("Button reaction to props value", () => {
    render(<Button disabled>Register</Button>);

    const button = screen.getByRole("button", { name: "Register" });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
