"use client";

import CustomInputComponent from "@/components/custom-input-component";
import ToastService from "@/utils/toast-service";
import { Button, Form, Spinner } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import AuthService from "@/api/auth";
import useAuth from "@/stores/auth.store";
import { getFirstAccessibleHref } from "@/utils/navigation";
import { useEffect } from "react";

function LoginView() {
  const router = useRouter();
  const { auth, setAuth } = useAuth();

  const profileRequest = useMutation({
    mutationFn: async () => {
      const [user, pages] = await Promise.all([
        AuthService.fetchProfile(),
        AuthService.fetchMyPages(),
      ]);
      return { user, pages };
    },
    onError: (error) => {
      ToastService.error({ text: error?.message ?? "Unable to fetch profile" });
    },
    onSuccess: ({ user, pages }) => {
      setAuth({ access: auth!.access, refresh: auth!.refresh, user, pages });
      router.replace(getFirstAccessibleHref(pages));
      ToastService.success({ text: "Login successful" });
    },
  });

  const loginRequest = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (result) => {
      if (result) {
        setAuth({ user: undefined, ...result });
        profileRequest.mutate();
      }
    },
    onError: (error) => {
      ToastService.error({ text: error?.message ?? "Unable to login" });
    },
  });

  useEffect(() => {
    if (auth?.user && auth?.pages !== undefined) {
      router.replace(getFirstAccessibleHref(auth.pages));
    }
  }, [auth, router]);

  const isPending = loginRequest.isPending || profileRequest.isPending;

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -right-12 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <Image
            src="/images/new/logo.png"
            alt="logo"
            width={200}
            height={80}
            className="object-contain"
          />
          <p className="text-white/70 text-sm text-center max-w-xs leading-relaxed">
            Manage your operations, track performance, and grow your business.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Image
              src="/images/new/icon.png"
              alt="icon"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to your admin account
            </p>
          </div>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));
              loginRequest.mutate({
                email: data.email as string,
                password: data.password as string,
              });
            }}
          >
            <div className="w-full space-y-4 mb-6">
              <CustomInputComponent type="email" name="email" />
              <CustomInputComponent type="password" name="password" />
            </div>

            <Button
              isPending={isPending}
              className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg py-6 text-sm font-semibold transition-colors duration-200 cursor-pointer"
              type="submit"
            >
              {({ isPending }) => (
                <span className="flex items-center gap-2">
                  {isPending && <Spinner color="current" size="sm" />}
                  {isPending ? "Signing in…" : "Sign In"}
                </span>
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
