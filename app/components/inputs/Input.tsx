"use client";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string | "text";
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  placeholder: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  disabled,
  required,
  type,
  register,
  placeholder,
  errors,
}) => {
  return (
    <div>
      {label && (
        <label className={"mb-1 block w-fit"} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        autoComplete={id}
        disabled={disabled}
        placeholder={placeholder}
        {...register(id, { required })}
        className={clsx({
          ["form-input block w-full rounded-md ring-1 focus:ring-2 ring-gray-300 focus:ring-sky-600 placeholder:text-gray-400 ring-inset border-0 py-2 shadow-sm p-3"]:
            true,
          ["cursor-not-allowedm opacity-50"]: disabled,
          ["focus:ring-rose-600"]: errors[id]?.message,
        })}
      />
      {errors[id] && (
        <p className="text-sm text-rose-600 mt-1">
          {errors?.[id]?.message as string}
        </p>
      )}
    </div>
  );
};
