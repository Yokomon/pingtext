"use client";

import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { FieldValues, useForm } from "react-hook-form";
import { MdWavingHand } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/inputs/Input";
import { registrationSchema } from "../schemas/registration";
import { SocialButton } from "./SocialButton";

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [socialsLoading, setSocialsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
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
        signIn("credentials", {
          ...values,
          callbackUrl: "/pings",
        });
      })
      .catch((err) => {
        throw new Error("Registration error", err);
      })
      .finally(() => setIsLoading(false));
  };

  const socialLogin = (socialType: "google" | "facebook") => {
    setSocialsLoading(true);
    signIn(
      socialType,
      {
        redirect: false,
        callbackUrl: "/pings",
      },
      {
        prompt: "login",
      }
    ).then((cb) => {
      if (cb?.error) console.log("Error", cb.error);
    });
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

        <div className="space-y-3">
          <div className="relative">
            <div className="inline-flex items-center justify-center absolute inset-0">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="p-3 bg-white text-gray-600">
                Or continue with
              </span>
            </div>
          </div>
          <SocialButton
            type="button"
            onClick={() => socialLogin("google")}
            socialIcon={FcGoogle}
            isLoading={socialsLoading}
            disabled={socialsLoading}
            fullWidth
          >
            Sign up with Google
          </SocialButton>
        </div>
      </form>
    </div>
  );
};
