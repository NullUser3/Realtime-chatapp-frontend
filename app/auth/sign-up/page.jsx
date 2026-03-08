"use client";

import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/app/providers/AuthProvider";
import GoogleSvg from "@/app/components/GoogleSvg";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignUp() {
  const { registerApi } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      await registerApi(formData);
    } catch (err) {
      if (err.response?.status === 409 && err.response.data?.message?.includes("username")) {
        setError("username", { type: "server", message: "Username already exists" });
      } else if (err.response?.status === 409 && err.response.data?.message?.includes("email")) {
        setError("email", { type: "server", message: "Email already exists" });
      } else {
        toast(err.response?.data?.message || "Sign up failed");
      }
    }
  };

  const inputClass = (hasError) =>
    `border dark:bg-darkest dark:text-background dark:placeholder:text-background/50 dark:border-accent ${
      hasError ? "border-red-500" : "border-transparent"
    }`;

  return (
    <div className="relative py-12 flex min-h-screen w-full text-foreground dark:bg-foreground bg-background items-center justify-center">
      <ToastContainer className="absolute top-4 left-1/2 -translate-x-1/2" />

      <Card className="w-full max-w-sm dark:bg-darkest dark:border-accent">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-xl font-semibold text-black dark:text-background py-3">
            Create an account
          </CardTitle>
          <CardDescription className="flex items-center justify-center pb-9 dark:text-background/50">
            Enter your details below to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div className="grid gap-2 text-foreground">
              <Label className="text-foreground dark:text-background" htmlFor="username">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                autoComplete="off"
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 5, message: "Username must be at least 5 characters" },
                  maxLength: { value: 20, message: "Username cannot exceed 20 characters" },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Username can only contain letters, numbers, and underscores",
                  },
                })}
                className={inputClass(errors.username)}
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2 text-foreground">
              <Label className="text-foreground dark:text-background" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                autoComplete="off"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                })}
                className={inputClass(errors.email)}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2 text-foreground relative">
              <Label className="text-foreground dark:text-background" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*\d).{10,}$/,
                    message: "Password must be at least 10 characters long and include at least one number",
                  },
                })}
                className={inputClass(errors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:text-background/50 dark:hover:text-background"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 pb-3">
              <Controller
                name="terms"
                control={control}
                rules={{ required: "You must accept the terms" }}
                render={({ field }) => (
                  <Checkbox
                    id="terms"
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="terms" className="text-sm font-normal text-foreground dark:text-background cursor-pointer">
                I accept the
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <span className="underline text-sm underline-offset-4 hover:opacity-80 cursor-pointer dark:text-background/70">
                    terms and conditions
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-64 dark:bg-foreground dark:border-accent dark:text-background">
                  <p className="text-sm">
                    This chat app is a demo/portfolio project. All messages and accounts are for
                    demonstration purposes only. We do not guarantee data privacy or security. By
                    using this app, you agree to use it responsibly.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-500 -mt-4">{errors.terms.message}</p>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full bg-foreground dark:bg-foreground dark:hover:bg-accent dark:text-background text-background cursor-pointer"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
          <a className="py-3 text-sm dark:text-background/70 hover:dark:text-background" href="/auth/login">
            Already have an account? Login here.
          </a>
          <div className="flex w-full items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-subtle3 dark:bg-accent/40"></div>
            <span className="text-foreground/80 dark:text-background/50">or</span>
            <div className="flex-1 h-px bg-subtle3 dark:bg-accent/40"></div>
          </div>
          <Button
            onClick={() =>
    (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
  }
            variant="outline"
            className="w-full cursor-pointer bg-background dark:bg-foreground dark:border-accent dark:text-background dark:hover:bg-accent hover:bg-subtle/60 flex gap-3"
          >
            <GoogleSvg />
            <span>Continue with Google</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}