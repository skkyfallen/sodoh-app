/**
 * Shared Sodoh styling for MUI controls on the public site.
 * Plain style objects (not SxProps unions) so they compose cleanly
 * inside `sx={[...]}` arrays.
 * Keeps the pill shape, 44px+ touch targets, brand greens and the
 * tactile pressable feel — so MUI buttons/fields read as Sodoh,
 * not as default MUI. Light-only tokens mirror app/globals.css.
 */

export const sodohButtonBaseSx = {
  borderRadius: "14px",
  fontFamily: "var(--font-body), system-ui, sans-serif",
  fontWeight: 600,
  textTransform: "none",
  transition:
    "transform 240ms cubic-bezier(0.16,1,0.3,1), background-color 240ms, border-color 240ms, box-shadow 240ms, color 240ms",
  "&:hover": { transform: "translateY(-1px)" },
  "&:active": { transform: "translateY(0)" },
};

export const sodohButtonSizeSx = {
  lg: { minHeight: 48, paddingLeft: 3.5, paddingRight: 3.5, fontSize: "0.9375rem" },
  md: { minHeight: 44, paddingLeft: 3, paddingRight: 3, fontSize: "0.875rem" },
  sm: { minHeight: 40, paddingLeft: 2, paddingRight: 2, fontSize: "0.875rem" },
} as const;

export type SodohButtonSize = keyof typeof sodohButtonSizeSx;

export const sodohPrimaryButtonSx = {
  backgroundColor: "var(--brand)",
  color: "#ffffff",
  boxShadow: "0 6px 16px rgba(1,105,54,0.18)",
  "&:hover": {
    backgroundColor: "var(--brand-hover)",
    boxShadow: "0 10px 24px rgba(1,105,54,0.22)",
  },
  "&.Mui-disabled": { backgroundColor: "var(--surface-muted)", color: "var(--muted)", boxShadow: "none" },
};

export const sodohDarkButtonSx = {
  backgroundColor: "#0c2418",
  color: "#ffffff",
  "&:hover": { backgroundColor: "var(--brand)" },
};

export const sodohOutlineLightButtonSx = {
  backgroundColor: "transparent",
  border: "1px solid rgba(255,255,255,0.4)",
  color: "#ffffff",
  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.4)" },
};

export const sodohBrandOutlineButtonSx = {
  backgroundColor: "transparent",
  border: "1px solid var(--brand)",
  color: "var(--brand)",
  "&:hover": { backgroundColor: "var(--brand)", color: "#ffffff", borderColor: "var(--brand)" },
};

export const sodohGhostButtonSx = {
  backgroundColor: "transparent",
  color: "var(--body)",
  "&:hover": { backgroundColor: "var(--surface-soft)", color: "var(--ink)" },
};

export const sodohFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "var(--surface)",
    color: "var(--ink)",
    fontSize: "0.9375rem",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--brand)" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--brand)",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": { color: "var(--muted)", fontSize: "0.9375rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--brand)" },
  "& .MuiInputBase-input::placeholder": { color: "var(--muted)", opacity: 1 },
};
