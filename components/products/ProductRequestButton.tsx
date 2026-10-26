"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Product } from "@/types/content";
import { Button } from "@/components/ui/button";

const ProductRequestDialog = dynamic(() => import("./ProductRequestDialog"), {
  loading: () => null,
});

type Props = { product: Product };

// Load the dialog and its motion dependency only after a request is made.
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
