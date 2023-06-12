"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { FieldValues, useForm } from "react-hook-form";
import { MdWavingHand } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/inputs/Input";
import { getRegistrationSchema } from "../schemas/registration";
import { SocialButton } from "./SocialButton";
import { getAuthFormText } from "./lib/getAuthFormText";
import getAuthErrMsg from "./lib/getAuthErrMsg";

export type Variant = "REGISTER" | "LOGIN";

export const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("REGISTER");
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
    resolver: yupResolver(getRegistrationSchema(variant)),
  });

  const onSubmit = useCallback(
    (values: FieldValues) => {
      const { email, password } = values;
      if (variant === "REGISTER") {
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
            toast.error(getAuthErrMsg[err.response.status]);
          })
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(true);
        signIn("credentials", {
          email,
          password,
          callbackUrl: "/pings",
        })
          .then((cb) => {
            if (cb?.error) {
              toast.error(cb.error);
            }
          })
          .finally(() => setIsLoading(false));
      }
    },
    [variant, reset]
  );

  const socialLogin = (socialType: "google" | "facebook") => {
    setSocialsLoading(true);
    signIn(socialType, {
      callbackUrl: "/pings",
      redirect: false,
    }).then((cb) => {
      if (cb?.error) {
        return toast.error(cb.error);
      } else {
        return toast.success(`Authenticated successfully!`);
      }
    });
  };

  const handleVariant = useCallback(() => {
    if (variant === "REGISTER") {
      setVariant("LOGIN");
    } else {
      setVariant("REGISTER");
    }
  }, [variant]);

  return (
    <div className="w-full lg:w-1/2 border border-gray-200 shadow-sm rounded-md py-3 sm:py-6 px-2 sm:px-6 lg:px-12">
      <div className="flex justify-center items-center flex-col">
        <MdWavingHand
          size={30}
          className="my-4 text-yellow-400 hover:rotate-45 cursor-pointer duration-300"
        />
        <h3 className="text-base sm:text-lg text-gray-700 leading-7 mb-6 text-center">
          {variant === "REGISTER"
            ? getAuthFormText["defaultHeading"]
            : getAuthFormText["userAccountHeading"]}
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-4">
        {variant === "REGISTER" && (
          <Input
            id="name"
            label="Name"
            register={register}
            errors={errors}
            placeholder="Enter fullname"
            required
          />
        )}
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
            disabled={isLoading || socialsLoading}
            isLoading={isLoading}
          >
            {variant === "REGISTER"
              ? getAuthFormText["signUp"]
              : getAuthFormText["signIn"]}
          </Button>
        </div>

        <div className="space-y-2">
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
            disabled={socialsLoading || isLoading}
            fullWidth
          >
            {variant === "REGISTER"
              ? getAuthFormText["googleSignUp"]
              : getAuthFormText["googleLogin"]}
          </SocialButton>
        </div>
      </form>
      <div className="mt-5 text-gray-600 text-sm text-center">
        <p>
          {variant === "REGISTER"
            ? getAuthFormText["isAccount"]
            : getAuthFormText["noAccount"]}
          <span
            onClick={handleVariant}
            className="underline underline-offset-1 cursor-pointer mx-2"
          >
            {variant === "REGISTER"
              ? getAuthFormText["login"]
              : getAuthFormText["register"]}
          </span>
        </p>
      </div>
    </div>
  );
};
