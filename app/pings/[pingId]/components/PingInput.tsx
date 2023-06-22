"use client";

import { FieldValues, UseFormRegister } from "react-hook-form";

interface PingInputProps {
  type?: string | "text";
  id: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
}

export const PingInput: React.FC<PingInputProps> = ({
  type,
  id,
  placeholder,
  register,
  required,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="text-black dark:text-sky-600 text-base placeholder:text-sm font-normal py-2 px-4 bg-neutral-100 focus:outline-none rounded-full w-full pr-10"
      />
    </div>
  );
};
