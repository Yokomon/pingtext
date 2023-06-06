import { screen, render, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FieldValues, useForm } from "react-hook-form";
import { Input } from "../inputs/Input";

describe("Input component render process", () => {
  test("Input renders with an empty value by default", () => {
    const { result } = renderHook(() => useForm<FieldValues>());

    const {
      register,
      formState: { errors },
    } = result.current;

    render(
      <Input
        label="Phone number"
        id="phoneNumber"
        register={register}
        placeholder="Phone number"
        errors={errors}
      />
    );

    const inputElement = screen.getByRole("textbox", { name: "Phone number" });

    expect(inputElement).toHaveValue("");
  });

  test("confirm values when input changes", async () => {
    const value = "08190902345";
    const user = userEvent.setup();

    const { result } = renderHook(() => useForm<FieldValues>());

    const {
      register,
      formState: { errors },
    } = result.current;

    render(
      <Input
        label="Phone number"
        id="phoneNumber"
        register={register}
        placeholder="Phone number"
        errors={errors}
      />
    );

    const inputElement = screen.getByRole("textbox", { name: "Phone number" });

    await user.type(inputElement, value);

    expect(inputElement).toHaveValue(value);
  });
});
