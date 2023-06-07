"use client";

import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { FieldValues, useForm } from "react-hook-form";
import { MdWavingHand } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/inputs/Input";
import { registrationSchema } from "../schemas/registration";

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit = (values: FieldValues) => {
    setIsLoading(true);
    axios
      .post("/api/register", values)
      .then(() => {
        setIsLoading(false);
        reset();
        signIn("credentials", values);
      })
      .catch((err) => {
        throw new Error("Registration error", err);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full lg:w-1/2 border border-gray-200 shadow-sm rounded-md py-3 sm:py-6 px-2 sm:px-6 lg:px-12">
      <div className="flex justify-center items-center flex-col">
        <MdWavingHand
          size={30}
          className="my-4 text-yellow-400 hover:rotate-45 cursor-pointer duration-300"
        />
        <h3 className="text-base sm:text-lg text-gray-700 leading-7 mb-6 text-center">
          Become a member of our engaging chat community. Let&apos;s connect,
          share, and explore together!
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-4">
        <Input
          id="name"
          label="Name"
          register={register}
          errors={errors}
          placeholder="Enter fullname"
          required
        />
        <Input
          id="email"
          label="Email"
          register={register}
          errors={errors}
          placeholder="Enter email address"
          required
        />
        <Input
          id="password"
          label="Password"
          register={register}
          type="password"
          errors={errors}
          placeholder="Enter password"
          required
        />
        <div className="py-4">
          <Button
            fullWidth
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
};
