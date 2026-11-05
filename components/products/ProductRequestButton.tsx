"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import type { Product } from "@/types/content";
import { sodohBrandOutlineButtonSx, sodohButtonBaseSx } from "@/components/sections/sodoh-mui";

const ProductRequestDialog = dynamic(() => import("./ProductRequestDialog"), {
  loading: () => null,
});

type Props = { product: Product };

// Load the dialog dependency only after a request is made.
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
      <Button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        fullWidth
        sx={[sodohButtonBaseSx, sodohBrandOutlineButtonSx, { minHeight: 44, fontSize: "0.875rem" }]}
      >
        Request a quote
      </Button>
      {hasOpened && <ProductRequestDialog product={product} open={open} onClose={close} />}
    </>
  );
}
