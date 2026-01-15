import { ThemeToggle } from "@/components/theme-toggle";
// import { Logo } from "@/components/logo";
import { Field } from "@/components/ui/field";
import Link from "next/link";

const AuthHeader = () => {
  return (
    <Field
      orientation="horizontal"
      className="bg-background sticky top-0 justify-between"
    >
      <Link href="/">
        {/*<Logo className="w-10" />*/}
        <span></span>
      </Link>

      <ThemeToggle />
    </Field>
  );
};

export { AuthHeader };
