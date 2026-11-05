"use client";

import type { ReactNode } from "react";
import Button from "@mui/material/Button";
import NextLink from "@/components/mui/NextLink";
import {
  sodohBrandOutlineButtonSx,
  sodohButtonBaseSx,
  sodohButtonSizeSx,
  sodohDarkButtonSx,
  sodohOutlineLightButtonSx,
  sodohPrimaryButtonSx,
  type SodohButtonSize,
} from "./sodoh-mui";

export type SodohCtaVariant = "primary" | "dark" | "outlineLight" | "brandOutline";

const variantSx = {
  primary: sodohPrimaryButtonSx,
  dark: sodohDarkButtonSx,
  outlineLight: sodohOutlineLightButtonSx,
  brandOutline: sodohBrandOutlineButtonSx,
} as const;

type SodohCtaButtonProps = {
  href: string;
  variant?: SodohCtaVariant;
  size?: SodohButtonSize;
  fullWidth?: boolean;
  ariaLabel?: string;
  children: ReactNode;
};

/**
 * Sodoh-styled MUI link button for the public site.
 * Server components (Hero, SiteCta, pages) render this client leaf
 * so pages stay server-rendered while CTAs get MUI behaviour.
 */
export default function SodohCtaButton({
  href,
  variant = "primary",
  size = "lg",
  fullWidth = false,
  ariaLabel,
  children,
}: SodohCtaButtonProps) {
  return (
    <Button
      component={NextLink}
      href={href}
      aria-label={ariaLabel}
      fullWidth={fullWidth}
      sx={[sodohButtonBaseSx, variantSx[variant], sodohButtonSizeSx[size]]}
    >
      {children}
    </Button>
  );
}
