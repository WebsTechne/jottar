"use client";

import { useCallback, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";
import { ErrorText } from "@/components/error-text";
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
import { updateFolder } from "@/lib/actions/folder-actions";
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
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

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

export function UpdateFolderSheet({
  folder,
  open,
  onOpenChange,
}: {
  folder: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [error, setError] = useState("");

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: folder.name,
      slug: folder.slug,
      description: folder.description ?? "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: FormValues) => {
    const id = folder.id;
    const name = data.name.trim();
    const slug = data.slug.trim();
    const description = data.description.trim();

    setError("");

    try {
      const result = await updateFolder({ id, name, slug, description });

      if (result.error) {
        setError(result.error);
      }

      toast.success(`Updated '${name}'`);
      router.replace(`/folders/${slug}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "There was an error updating your folder",
      );
    }
  };

  const generateSlug = useCallback(() => {
    const name = form.getValues("name") || "";
    const newSlug = Slugify(name);
    form.setValue("slug", newSlug, { shouldValidate: true });
  }, [form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full! max-w-115!">
        <form
          className="contents"
          onSubmit={form.handleSubmit(onSubmit)}
          role="form"
          aria-labelledby="new-form-heading"
        >
          <FieldSet className="flex flex-col items-center gap-5 p-4">
            <section className="flex w-full flex-col gap-3.5">
              <FieldTitle className="m-0! w-full text-xl leading-tight font-bold! md:text-2xl">
                Update Folder
              </FieldTitle>
              <FieldDescription className="m-0! w-full leading-tight">
                Update the folder details below to modify its name, slug or
                description.
              </FieldDescription>
            </section>

            <FieldGroup>
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

              {error && (
                <Field>
                  <ErrorText>{error}</ErrorText>
                </Field>
              )}
            </FieldGroup>
          </FieldSet>

          <SheetFooter className="grid grid-cols-2 p-4!">
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
                  Updating
                </>
              ) : (
                <>Update folder</>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
