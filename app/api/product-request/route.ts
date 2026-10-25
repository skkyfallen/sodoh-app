import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ProductRequestFormData } from "@/types/content";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ProductRequestFormData>;

    const productId = body.product_id?.trim();
    const productTitle = body.product_title?.trim();
    const name = body.name?.trim();
    const email = body.email?.trim();
    const quantity = Number(body.quantity_kg);

    if (!productId || !productTitle || !name || !email || !Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Product, quantity, name, and a valid email are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("product_requests").insert({
      product_id: productId,
      product_title: productTitle,
      quantity_kg: quantity,
      name,
      email,
      phone: body.phone?.trim() || null,
      message: body.message?.trim() || null,
    });

    if (error) {
      console.error("[POST /api/product-request]", error.message);
      return NextResponse.json(
        { error: "Failed to submit your request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}