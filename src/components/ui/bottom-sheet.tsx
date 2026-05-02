"use client";

import { useUIStore } from "@/store/uiStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface BottomSheetProps {
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ title, children }: BottomSheetProps) {
  const { isBottomSheetOpen, closeBottomSheet } = useUIStore();

  return (
    <Sheet open={isBottomSheetOpen} onOpenChange={(open) => !open && closeBottomSheet()}>
      <SheetContent side="bottom" className="h-[auto] max-h-[90vh] rounded-t-3xl sm:max-w-md sm:mx-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left font-heading">{title || "Menu"}</SheetTitle>
        </SheetHeader>
        <div className="pb-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
