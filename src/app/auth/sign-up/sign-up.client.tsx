"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  SquareLock02Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { GoogleIcon, AppleIcon } from "@/components/icons/social-icons";

import { signInSocial } from "@/lib/actions/auth-actions";
import { authClient } from "@/lib/auth-client";
import { getPublicErrorMessage, reportErrorToServer } from "@/lib/error-utils";
import { Spinner } from "@/components/ui/spinner";
import { AuthHeader } from "../_components/auth-header";
import { toast } from "sonner";
import { AuthMessage } from "../_components/auth-message";
import { ErrorText } from "@/components/error-text";
import { cn } from "@/lib/utils";

// validation: identifier must be email, password 6+ chars
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must be at most 100 characters."),
    email: z.email("Please enter a valid email address."),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .max(72, "Password must be at most 72 characters."),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

export function SignUpClient() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("returnTo") ?? "";
  const returnTo =
    raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState("");

  // const handleSocialAuth = async (
  //   provider: "google" | "apple",
  //   callbackURL: string,
  // ) => {
  //   setError("");

  //   try {
  //     await signInSocial({ provider, callbackURL });
  //   } catch (err) {
  //     const publicMsg = getPublicErrorMessage(err);
  //     const ref = await reportErrorToServer(err);
  //     setError(`${publicMsg} (ref: ${ref})`);
  //   }
  // };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const nameError = form.formState.errors.name;
  const emailError = form.formState.errors.email;
  const passwordError = form.formState.errors.password;

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: FormValues) => {
    const { confirmPassword, ...payload } = {
      ...data,
      name: data.name,
      email: data.email.toLowerCase().trim(),
    };

    setError("");

    try {
      const result = await authClient.signUp.email(payload);

      if (result.error) {
        switch (result.error.code) {
          case "USER_ALREADY_EXISTS":
            setError("This email is already registered. Try signing in.");
            return;

          case "INVALID_EMAIL":
            setError("Please enter a valid email address.");
            return;

          case "WEAK_PASSWORD":
            setError("Password is too weak.");
            return;

          default:
            setError(result.error.message ?? "Failed to create account.");
            return;
        }
      }

      // No error means sign-up was accepted
      toast.success("Account created. You can sign in now.");
      await fetch("/api/me/default-folders", {
        method: "POST",
        credentials: "include",
      });
      replace(`/auth/sign-in?returnTo=${returnTo}`);
    } catch (err) {
      // This is for network / unexpected errors only
      setError(
        err instanceof Error ? err.message : "Unexpected authentication error",
      );
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto flex max-w-115 flex-col items-center gap-5"
      role="form"
      aria-labelledby="sign-up-heading"
    >
      <AuthHeader />
      <FieldGroup className="gap-4.5!">
        {/* Title */}
        <AuthMessage
          id="sign-up-heading"
          title="Create account"
          description="Sign up for the best experience"
        />

        {/* Name */}
        <Field data-invalid={!!nameError} className="input-group gap-1.5!">
          <FieldLabel htmlFor="form-rhf-name" className="input-label">
            Name
          </FieldLabel>
          <Input
            {...form.register("name")}
            id="form-rhf-name"
            aria-invalid={!!nameError}
            aria-describedby={nameError ? "form-rhf-name-error" : undefined}
            autoComplete="name"
            className="input required"
            type="text"
            placeholder="John Doe"
          />
          <FieldError
            errors={[emailError]}
            id="form-rhf-email-error"
            role="alert"
          />
        </Field>

        {/* Email */}
        <Field data-invalid={!!emailError} className="input-group gap-1.5!">
          <FieldLabel htmlFor="form-rhf-email" className="input-label">
            Email
          </FieldLabel>
          <Input
            {...form.register("email")}
            id="form-rhf-email"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "form-rhf-email-error" : undefined}
            autoComplete="email"
            className="input required"
            type="email"
            placeholder="j@example.com"
          />
          <FieldError
            errors={[emailError]}
            id="form-rhf-email-error"
            role="alert"
          />
        </Field>

        {/* Password with visibility toggle */}
        <Field data-invalid={!!passwordError} className="input-group gap-1.5!">
          <FieldLabel
            htmlFor="form-rhf-password"
            className="input-label gap-1.5!"
          >
            Password
          </FieldLabel>

          <div className="relative flex h-max w-full items-center">
            <Input
              {...form.register("password")}
              id="form-rhf-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={!!passwordError}
              aria-describedby={
                passwordError ? "form-rhf-password-error" : undefined
              }
              className="input required"
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute top-1/2 right-0 grid size-11 -translate-y-1/2 place-items-center"
              onClick={(e) => setShowPassword((v) => !v)}
            >
              {showPassword ? (
                <HugeiconsIcon
                  size={20}
                  icon={ViewOffSlashIcon}
                  className="animate-in fade-in text-muted-foreground"
                />
              ) : (
                <HugeiconsIcon
                  size={20}
                  icon={ViewIcon}
                  className="animate-in fade-in text-muted-foreground"
                />
              )}
            </button>
          </div>

          <FieldError
            errors={[passwordError]}
            id="form-rhf-password-error"
            role="alert"
          />
          <FieldDescription>
            <span id="password-desc" className="sr-only" aria-live="polite">
              {showPassword ? "Password is visible" : "Password is hidden"}.
              Password must be at least 6 characters.
            </span>
          </FieldDescription>
        </Field>

        {/* Confirm password with visibility toggle */}
        <Field
          data-invalid={!!form.formState.errors.confirmPassword}
          className="input-group gap-1.5!"
        >
          <FieldLabel
            htmlFor="form-rhf-confirm-password"
            className="input-label gap-1.5!"
          >
            Confirm password
          </FieldLabel>

          <div className="relative flex h-max w-full items-center">
            <Input
              {...form.register("confirmPassword")}
              id="form-rhf-confirm-password"
              type={showPassword ? "text" : "password"}
              aria-invalid={!!form.formState.errors.confirmPassword}
              aria-describedby={
                form.formState.errors.confirmPassword
                  ? "form-rhf-confirm-password-error"
                  : undefined
              }
              className="input required"
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute top-1/2 right-0 grid size-11 -translate-y-1/2 place-items-center"
              onClick={(e) => setShowPassword((v) => !v)}
            >
              {showPassword ? (
                <HugeiconsIcon
                  size={20}
                  icon={ViewOffSlashIcon}
                  className="animate-in fade-in text-muted-foreground"
                />
              ) : (
                <HugeiconsIcon
                  size={20}
                  icon={ViewIcon}
                  className="animate-in fade-in text-muted-foreground"
                />
              )}
            </button>
          </div>

          <FieldError
            errors={[form.formState.errors.confirmPassword]}
            id="form-rhf-confirm-password-error"
            role="alert"
          />
        </Field>

        <Button className="button w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Sign up"}
        </Button>

        {/* Error field */}
        {error && (
          <Field>
            <ErrorText>{error}</ErrorText>
          </Field>
        )}

        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-background my-2">
          Or continue with
        </FieldSeparator>

        <Field className="w-full gap-4">
          <Button
            variant="secondary"
            type="button"
            disabled={true}
            onClick={(e) => e.preventDefault()}
            className="button pointer-events-auto! w-full cursor-not-allowed!"
          >
            <HugeiconsIcon
              icon={SquareLock02Icon}
              size={28}
              color="currentColor"
              strokeWidth={2}
            />
            Not available
          </Button>
        </Field>

        {/*<Field className="grid w-full grid-cols-2 gap-4">
          <Button
            variant="secondary"
            className="button w-full"
            type="button"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              handleSocialAuth("google", returnTo);
            }}
          >
            <GoogleIcon />
            Google
          </Button>
          <Button
            variant="secondary"
            className="button w-full"
            type="button"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              handleSocialAuth("apple", returnTo);
            }}
          >
            <AppleIcon size={28} fill={isDark ? "white" : "black"} />
            Apple
          </Button>
        </Field>*/}

        <div className="item-center text-foreground flex-center flex flex-wrap gap-1">
          Have an account?
          <Link
            href="/auth/sign-in"
            className={cn(
              buttonVariants({ variant: "link" }),
              "px-1! font-semibold!",
            )}
          >
            Sign in
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
