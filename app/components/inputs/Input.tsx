"use client";

import clsx from "clsx";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { useCallback, useMemo, useState } from "react";

interface InputProps {
  id: string;
  label: string;
  type?: string | "text" | "password";
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
  const [hidePassword, setHidePassword] = useState(true);

  const switchPasswordStatus = useCallback(() => {
    setHidePassword(!hidePassword);
  }, [hidePassword]);

  const inputType = useMemo(() => {
    if (type === "password" && hidePassword) {
      return type;
    } else if (type === "password" && !hidePassword) {
      return "text";
    } else {
      return type;
    }
  }, [type, hidePassword]);

  return (
    <div>
      {label && (
        <label className={"mb-1 text-sm sm:text-base block w-fit"} htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          id={id}
          autoComplete={id}
          disabled={disabled}
          placeholder={placeholder}
          {...register(id, { required })}
          className={clsx({
            ["form-input block w-full text-sm sm:text-base rounded-md ring-1 focus:ring-2 ring-gray-300 focus:ring-sky-600 placeholder:text-gray-400 ring-inset border-0 py-2 shadow-sm p-3"]:
              true,
            ["cursor-not-allowedm opacity-50"]: disabled,
            ["focus:!ring-rose-600"]: errors[id]?.message,
          })}
        />
        {type === "password" &&
          (hidePassword ? (
            <BsEyeSlashFill
              onClick={switchPasswordStatus}
              className="absolute text-sky-400 top-1.5 cursor-pointer right-3"
              size={24}
            />
          ) : (
            <BsEyeFill
              onClick={switchPasswordStatus}
              className="absolute text-sky-400 top-1.5 cursor-pointer right-3"
              size={24}
            />
          ))}
      </div>
      {errors[id]?.message && (
        <p className="text-xs sm:text-sm text-rose-600 mt-1">
          {errors?.[id]?.message as string}
        </p>
      )}
    </div>
  );
};
