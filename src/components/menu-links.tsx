import { Link } from "next/link";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";

const MenuLink = ({
  href,
  icon,
  label,
  ariaLabel,
}: {
  href: string;
  icon: any;
  label: string;
  ariaLabel: string;
}) => {
  return (
    <DropdownMenuItem
      nativeButton={false}
      aria-label={ariaLabel}
      render={
        <Link href={href}>
          <HugeiconsIcon icon={icon} strokeWidth={1.7} />
          {label}
        </Link>
      }
    />
  );
};

export { MenuLink };
