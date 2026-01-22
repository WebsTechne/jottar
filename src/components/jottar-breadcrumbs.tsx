import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type BreadcrumbEntry = {
  name: string;
  href?: string;
  children?: { name: string; href: string }[];
};

export default function MonicxBreadcrumbs({
  items,
}: {
  items: BreadcrumbEntry[];
}) {
  return (
    <Breadcrumb className="mb-3.5">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div className="contents" key={index}>
              <BreadcrumbItem>
                {item.name === "ellipsis" && item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="size-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.children.map((child, i) => (
                        <DropdownMenuItem key={i} asChild>
                          <Link
                            href={child.href}
                            className="text-foreground hover:text-secondary underline-offset-4 hover:underline"
                          >
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : isLast ? (
                  <BreadcrumbPage className="text-primary">
                    {item.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href || "#"}
                      className="text-foreground hover:text-muted-foreground/90 underline-offset-4 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
