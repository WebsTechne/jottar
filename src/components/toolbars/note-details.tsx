"use client";

import { cloneElement, useState, type ReactElement } from "react";
import { useMediaQuery } from "@/hooks/use-media-quary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

export function NoteDetails({ children }: { children: ReactElement }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={(props) => cloneElement(children, props)}
        ></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Note details</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when
              you&apos;redone.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Note details</DrawerTitle>
          <DrawerDescription className="sr-only">
            Make changes to your note details here. Click save when you&apos;re
            done.
          </DrawerDescription>
        </DrawerHeader>
        <form>
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            value={""}
            className="input w-full"
          />
          {/*<Textarea
						name="content"
						id="content"
						placeholder="Content"
						className="w-full"
					/>*/}
        </form>
        <DrawerFooter className="grid grid-cols-2 pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
          <Button type="button" className="w-full">
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
