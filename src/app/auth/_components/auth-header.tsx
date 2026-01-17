import { ThemeToggle } from "@/components/theme-toggle";
import { Field } from "@/components/ui/field";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const AuthHeader = () => {
  return (
    <Field
      orientation="horizontal"
      className="bg-background sticky top-0 justify-between"
    >
      <Link href="/" className="flex items-center text-lg font-bold">
        <HugeiconsIcon
          icon={QuillWrite01Icon}
          strokeWidth={2.4}
          className="size-7!"
        />
        Jottar
      </Link>

      <ThemeToggle />
    </Field>
  );
};

export { AuthHeader };
