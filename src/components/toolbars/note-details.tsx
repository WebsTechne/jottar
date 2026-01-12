"use client";

import { cloneElement, useState, type ReactElement } from "react";
import { useMediaQuery } from "@/hooks/use-media-quary";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import capitalize from "@/lib/helpers/capitalize";

export function NoteDetails({ children }: { children: ReactElement }) {
  const items = ["#Tag-1", "#Tag-2", "#Tag-3"];

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const roleItems = [
    { label: "Developer", value: "developer" },
    { label: "Designer", value: "designer" },
    { label: "Manager", value: "manager" },
    { label: "Other", value: "other" },
  ];

  // Controlled state for inputs to avoid uncontrolled -> controlled warnings
  const [title, setTitle] = useState("");
  const [role, setRole] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={(props) => cloneElement(children, props)}
      ></DialogTrigger>
      <DialogContent className="p-4! sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Note details</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-3">
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input h-10! w-full"
          />

          <MultiSelect>
            <MultiSelectTrigger className="input w-full">
              <MultiSelectValue placeholder="Select frameworks..." />
            </MultiSelectTrigger>
            <MultiSelectContent>
              <MultiSelectGroup>
                {items.map((tag) => (
                  <MultiSelectItem key={tag} value={tag}>
                    {tag}
                  </MultiSelectItem>
                ))}
              </MultiSelectGroup>
            </MultiSelectContent>
          </MultiSelect>

          <Select
            value={role ?? ""}
            onValueChange={(value) => setRole(value)}
            onOpenChange={(open) => console.log(open)} // Example handler
          >
            <SelectTrigger id="desktop-form-role" className="input w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {roleItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </form>
      </DialogContent>
    </Dialog>
  );
}
