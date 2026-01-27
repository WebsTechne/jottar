"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { ErrorText } from "@/components/error-text";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { createFolder } from "@/lib/actions/folder-actions";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 letters." })
    .max(30, "Name must be at most 30 letters."),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 letters." })
    .max(30, "Slug must be at most 30 letters."),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters."),
});
type FormValues = z.infer<typeof formSchema>;

export function NewFolderClient({ userId }: { userId: string }) {
  const [error, setError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: FormValues) => {
    const name = data.name.trim();
    const slug = data.slug.trim();
    const description = data.description.trim();

    setError("");

    try {
      const result = await createFolder({ name, slug, description, userId });

      if (result.error) {
        setError(result.error);
      }
      toast.success(`Folder '${name}' has been created successfully!`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "There was an error creating your folder",
      );
    }
  };

  return (
    <Field>
      <form
        className="contents"
        onSubmit={form.handleSubmit(onSubmit)}
        role="form"
        aria-labelledby="new-form-heading"
      >
        {/*<Field*/}
      </form>
    </Field>
  );
}
