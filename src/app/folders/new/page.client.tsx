"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { ErrorText } from "@/components/error-text";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { createFolder } from "@/lib/actions/folder-actions";
import { Textarea } from "@/components/ui/textarea";
import { Slugify } from "@/lib/helpers/slugify";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ReloadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/ui/spinner";
import { FolderHeader } from "../folder-header";
import { ServerSession } from "@/app/layout";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 letters." })
    .max(30, "Name must be at most 30 letters."),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 letters." })
    .max(30, "Slug must be at most 30 letters.")
    .regex(
      slugRegex,
      "Slug may contain only lowercase letters, numbers and single hyphens",
    ),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters."),
});
type FormValues = z.infer<typeof formSchema>;

export function NewFolderClient({ session }: { session: ServerSession }) {
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
      const result = await createFolder({ name, slug, description });

      if (result.error) {
        setError(result.error);
      }

      form.reset();
      toast.success(`Created '${name}'`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "There was an error creating your folder",
      );
    }
  };

  const generateSlug = useCallback(() => {
    const name = form.getValues("name") || "";
    const newSlug = Slugify(name);
    form.setValue("slug", newSlug, { shouldValidate: true });
  }, [form]);

  return (
    <>
      <FolderHeader session={session} back={true}>
        <span></span>
      </FolderHeader>
      <FieldSet className="mx-auto flex w-full max-w-115 flex-col items-center gap-5 p-4">
        <section className="flex w-full flex-col gap-3.5">
          <FieldTitle className="m-0! w-full text-2xl leading-tight font-extrabold! md:text-3xl">
            New folder
          </FieldTitle>
          <FieldDescription className="m-0! w-full leading-tight">
            Create a new folder to group notes with similar ideas, themes or
            purposes.
          </FieldDescription>
        </section>

        <FieldGroup>
          <form
            className="contents"
            onSubmit={form.handleSubmit(onSubmit)}
            role="form"
            aria-labelledby="new-form-heading"
          >
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="input-group"
                >
                  <FieldLabel htmlFor={field.name} className="input-label">
                    Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="Folder name"
                    aria-invalid={fieldState.invalid}
                    className="input required"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Slug */}
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="input-group"
                >
                  <FieldLabel htmlFor={field.name} className="input-label">
                    Slug
                  </FieldLabel>
                  <InputGroup className="input text-foreground! h-11! shadow-none! dark:border-0!">
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type="text"
                      placeholder="folder-slug"
                      aria-invalid={fieldState.invalid}
                      className="required"
                    />
                    <InputGroupAddon align="inline-end">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => generateSlug()}
                        className="btn"
                      >
                        <HugeiconsIcon icon={ReloadIcon} />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="input-group"
                >
                  <FieldLabel htmlFor={field.name} className="input-label">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Brief description..."
                    aria-invalid={fieldState.invalid}
                    className="input max-h-30.5"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Buttons */}
            <Field orientation="horizontal" className="input-group">
              <Button
                variant="secondary"
                onClick={() => form.reset()}
                className="button flex-1"
              >
                Clear form
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="button flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Creating
                  </>
                ) : (
                  <>Create folder</>
                )}
              </Button>
            </Field>
          </form>
        </FieldGroup>
      </FieldSet>
    </>
  );
}
