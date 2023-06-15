import QueryProvider from "@/app/providers/QueryProvider";
import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "../AuthForm";

describe("Auth-form component", () => {
  test("check input values on first-render and confirm they're all empty", () => {
    render(<AuthForm />, { wrapper: QueryProvider });
    // Name input
    const nameInput = screen.getByRole("textbox", { name: /name/i });

    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue("");

    // Email input
    const emailInput = screen.getByRole("textbox", { name: /email/i });

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue("");

    // Password input
    const passwordInput = screen.getByLabelText(/password/i);

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveValue("");
  });

  test("confirm validation on empty field inputs", async () => {
    const user = userEvent.setup();
    render(<AuthForm />, { wrapper: QueryProvider });

    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.click(submitButton);

    const nameErrorMsg = await screen.findByText("Name is required");
    const emailErrorMsg = await screen.findByText("Email is required");
    const passwordErrorMsg = await screen.findByText(
      "Password must have at least 8 characters"
    );

    expect(nameErrorMsg).toBeInTheDocument();
    expect(emailErrorMsg).toBeInTheDocument();
    expect(passwordErrorMsg).toBeInTheDocument();
  });

  test("confirm user events on input and form submission", async () => {
    const user = userEvent.setup();
    render(<AuthForm />, { wrapper: QueryProvider });

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.type(nameInput, "Testing name input");
    await user.type(emailInput, "test");
    await user.type(passwordInput, "test");

    await user.click(submitButton);

    // Confirm onChange functions properly
    expect(nameInput).toHaveValue("Testing name input");
    expect(emailInput).toHaveValue("test");
    expect(passwordInput).toHaveValue("test");

    // Confirm validations on input-fields
    const emailErrorMsg = await screen.findByText("Email is invalid");
    const passwordErrorMsg = await screen.findByText(
      "Password must have at least 8 characters"
    );

    expect(emailErrorMsg).toBeInTheDocument();
    expect(passwordErrorMsg).toBeInTheDocument();

    // Clear error input fields
    await user.clear(emailInput);
    await user.clear(passwordInput);

    await user.type(emailInput, "test@mail.co.uk");
    await user.type(passwordInput, "passwordtest321");

    // Assertion confirmed
    expect(emailErrorMsg).not.toBeInTheDocument();
    expect(passwordErrorMsg).not.toBeInTheDocument();
  });
});
