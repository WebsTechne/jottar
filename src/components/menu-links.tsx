import { ReactNode } from "react";
import Link from "next/link";
import { DropdownMenuItem } from "./ui/dropdown-menu";

const MenuLink = ({
  href,
  icon,
  label,
  ariaLabel,
}: {
  href: string;
  icon?: ReactNode;
  label: string;
  ariaLabel: string;
}) => {
  return (
    <DropdownMenuItem
      nativeButton={false}
      aria-label={ariaLabel}
      render={
        <Link href={href} className="text-base!">
          {icon}
          {label}
        </Link>
      }
    />
  );
};

export { MenuLink };
