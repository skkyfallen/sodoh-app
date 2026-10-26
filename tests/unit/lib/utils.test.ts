import { describe, expect, it } from "vitest";
import { cn, formatDate, safeHref } from "@/lib/utils";

describe("safeHref", () => {
  const fallback = "/fallback";

  it.each([
    ["/products", "/products"],
    ["/products?category=grains#list", "/products?category=grains#list"],
    ["https://example.com/path", "https://example.com/path"],
    ["mailto:hello@example.com", "mailto:hello@example.com"],
    ["tel:+2348000000000", "tel:+2348000000000"],
  ])("allows safe href %s", (value, expected) => {
    expect(safeHref(value, fallback)).toBe(expected);
  });

  it.each([
    undefined,
    null,
    42,
    "",
    "   ",
    "//evil.example/path",
    "/\\evil.example/path",
    "javascript:alert(1)",
    "data:text/html,unsafe",
    "https://",
  ])("uses the fallback for unsafe or invalid href %s", (value) => {
    expect(safeHref(value, fallback)).toBe(fallback);
  });
});

describe("cn", () => {
  it("combines classes and resolves conflicting Tailwind utilities", () => {
    expect(cn("p-2 text-sm", false && "hidden", "p-4")).toBe("text-sm p-4");
  });
});

describe("formatDate", () => {
  it("formats date values with the shared US date format", () => {
    expect(formatDate(new Date(2024, 1, 9, 12))).toBe("February 9, 2024");
    expect(formatDate("2024-02-09T12:00:00")).toBe("February 9, 2024");
  });
});
