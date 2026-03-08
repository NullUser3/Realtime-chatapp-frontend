"use client";

import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/providers/AuthProvider";
import GoogleSvg from "@/app/components/GoogleSvg";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";


function ErrorToast({ closeToast, data }) {
  return (
    <div className="flex flex-col w-full gap-2">
      <h3 className="text-sm font-semibold text-foreground dark:text-background">
        {data.title}
      </h3>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-foreground/70 dark:text-background/60">{data.content}</p>
        <button
          onClick={closeToast}
          className="shrink-0 text-xs border border-subtle2 dark:border-accent rounded-lg px-3 py-1.5 
            text-foreground dark:text-background hover:bg-subtle2 dark:hover:bg-accent 
            transition-all active:scale-95"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
export default function Login() {
  const { loginApi } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      await loginApi(formData);
    } catch (err) {
      toast(ErrorToast, {
  data: {
    title: "Login failed",
    content: err.response?.data?.message || "Something went wrong, please try again.",
  },
  closeButton: false,
  autoClose: 5000,
});
      setError("root", {
        type: "server",
        message: err.response?.data?.message,
      });
    }
  };

  return (
    <div className="relative py-12 flex min-h-dvh w-full text-foreground dark:bg-foreground bg-background items-center justify-center">
      <ToastContainer
  className="absolute top-4 left-1/2 -translate-x-1/2"
  toastClassName={() =>
    "relative flex items-center p-3 px-4 rounded-xl shadow-md cursor-pointer " +
    "bg-background dark:bg-foreground " +
    "border border-subtle2 dark:border-accent " +
    "text-sm font-medium"
  }
  progressStyle={{ background: "var(--accent)", opacity: 1, height: "3px" }}
/>

      <Card className="w-full max-w-sm dark:bg-darkest dark:border-accent">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-xl font-semibold text-black dark:text-background py-3">
            Welcome to my Chatapp
          </CardTitle>
          <CardDescription className="flex items-center justify-center pb-9 dark:text-background/50">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register("email", { required: "Email is required" })}
                className={`border dark:bg-darkest dark:text-background dark:placeholder:text-background/50 dark:border-accent ${
                  errors.root ? "border-red-500" : "border-transparent"
                }`}
              />
            </div>

            {/* Password */}
            <div className="grid gap-2 relative pb-9">
              <div className="flex items-center text-foreground">
                <Label htmlFor="password" className="dark:text-background">Password</Label>
                <button
                  type="button"
                  className="ml-auto text-sm underline-offset-4 hover:underline dark:text-background/70 dark:hover:text-background"
                >
                  Forgot password?
                </button>
              </div>

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                {...register("password", { required: "Password is required" })}
                className={`border dark:bg-darkest dark:text-background dark:placeholder:text-background/50 dark:border-accent ${
                  errors.root ? "border-red-500" : "border-transparent"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-10.5 text-gray-500 hover:text-gray-700 dark:text-background/50 dark:hover:text-background"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full bg-foreground dark:bg-foreground dark:hover:bg-accent dark:text-background text-background cursor-pointer"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <a className="py-3 text-sm dark:text-background/70 hover:dark:text-background" href="/auth/sign-up">
            Don&apos;t have an account? Create one here.
          </a>
          <div className="flex w-full items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-subtle3 dark:bg-accent/40"></div>
            <span className="text-foreground/80 dark:text-background/50">or</span>
            <div className="flex-1 h-px bg-subtle3 dark:bg-accent/40"></div>
          </div>
          <Button
            onClick={() =>
    (window.location.href = `/api/auth/google`)
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