import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders an accessible button with default type and variant classes", () => {
    render(<Button>Save changes</Button>);

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("bg-[var(--brand)]");
  });

  it("forwards native props and custom classes", () => {
    render(
      <Button type="submit" variant="outline" disabled className="custom-class">
        Continue
      </Button>
    );

    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("custom-class");
    expect(button).toHaveClass("border");
  });
});
