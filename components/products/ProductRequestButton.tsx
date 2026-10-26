"use client";

import { useRef, useState } from "react";
import type { Product } from "@/types/content";
import { Button } from "@/components/ui/button";
import ProductRequestDialog from "./ProductRequestDialog";

type Props = { product: Product };

// Static import (no lazy chunk): the dialog must open on the very first tap,
// even on slow mobile networks. ProductRequestDialog renders nothing while
// closed, so keeping it mounted preserves its exit transition.
export default function ProductRequestButton({ product }: Props) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const openDialog = () => {
    setHasOpened(true);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <Button ref={triggerRef} type="button" variant="brandOutline" onClick={openDialog} className="w-full">
        Request a quote
      </Button>
      {hasOpened && <ProductRequestDialog product={product} open={open} onClose={close} />}
    </>
  );
}
