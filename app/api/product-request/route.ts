import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStringField, isRateLimited, isValidEmail, readJsonObject } from "@/lib/api-guard";

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_PHONE = 50;
const MAX_MESSAGE = 5000;
const MAX_PRODUCT_IDENTIFIER = 100;
const MAX_PRODUCT_TITLE = 200;
const MAX_QUANTITY_KG = 100_000;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    if (isRateLimited(request, "product-request")) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const parsed = await readJsonObject(request);
    if (!parsed.ok) {
      const error = parsed.status === 413
        ? "Request body is too large."
        : parsed.status === 415
          ? "Content type must be application/json."
          : "Invalid request.";
      return NextResponse.json({ error }, { status: parsed.status });
    }

    const productId = getStringField(parsed.body, "product_id", MAX_PRODUCT_IDENTIFIER);
    const productSlug = getStringField(parsed.body, "product_slug", MAX_PRODUCT_IDENTIFIER);
    const fallbackSlug = productSlug.value === null
      ? getStringField(parsed.body, "slug", MAX_PRODUCT_IDENTIFIER)
      : { valid: true, value: null };
    const submittedTitle = getStringField(parsed.body, "product_title", MAX_PRODUCT_TITLE);
    const name = getStringField(parsed.body, "name", MAX_NAME, true);
    const email = getStringField(parsed.body, "email", MAX_EMAIL, true);
    const phone = getStringField(parsed.body, "phone", MAX_PHONE);
    const message = getStringField(parsed.body, "message", MAX_MESSAGE);

    const slug = productSlug.value ?? fallbackSlug.value;
    const rawQuantity = parsed.body.quantity_kg;
    const quantity = typeof rawQuantity === "number"
      ? rawQuantity
      : typeof rawQuantity === "string" && rawQuantity.trim().length <= 16
        ? Number(rawQuantity.trim())
        : Number.NaN;

    if (
      !productId.valid || !productSlug.valid || !fallbackSlug.valid || !submittedTitle.valid ||
      !name.valid || !name.value ||
      !email.valid || !email.value || !isValidEmail(email.value) ||
      !phone.valid || !message.valid ||
      (!productId.value && !slug) ||
      (productId.value !== null && !UUID_PATTERN.test(productId.value)) ||
      !Number.isFinite(quantity) || quantity < 0.5 || quantity > MAX_QUANTITY_KG ||
      Math.abs(quantity * 100 - Math.round(quantity * 100)) > 1e-8
    ) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const supabase = await createClient();

    let productQuery = supabase.from("products").select("id,title,slug").eq("is_active", true);
    productQuery = productId.value
      ? productQuery.eq("id", productId.value)
      : productQuery.eq("slug", slug!);

    const { data: product, error: productError } = await productQuery.maybeSingle();
    if (productError) {
      console.error("[POST /api/product-request] Failed to look up product.");
      return NextResponse.json({ error: "Unable to submit your request. Please try again." }, { status: 500 });
    }
    if (!product || (slug !== null && product.slug !== slug) || product.title.length > MAX_PRODUCT_TITLE) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { error } = await supabase.from("product_requests").insert({
      product_id: product.id,
      product_title: product.title,
      quantity_kg: quantity,
      name: name.value,
      email: email.value,
      phone: phone.value,
      message: message.value,
    });

    if (error) {
      console.error("[POST /api/product-request] Failed to save product request.");
      return NextResponse.json(
        { error: "Unable to submit your request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
