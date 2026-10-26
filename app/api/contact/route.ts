import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStringField, isRateLimited, isValidEmail, readJsonObject } from "@/lib/api-guard";

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

const ALLOWED_SUBJECTS = [
  "General Inquiry",
  "Partnership Proposal",
  "Technical Support",
  "Press & Media",
];

export async function POST(request: Request) {
  try {
    if (isRateLimited(request, "contact")) {
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

    const name = getStringField(parsed.body, "name", MAX_NAME, true);
    const email = getStringField(parsed.body, "email", MAX_EMAIL, true);
    const subject = getStringField(parsed.body, "subject", 100);
    const message = getStringField(parsed.body, "message", MAX_MESSAGE, true);

    if (
      !name.valid || !name.value ||
      !email.valid || !email.value || !isValidEmail(email.value) ||
      !subject.valid ||
      (subject.value !== null && !ALLOWED_SUBJECTS.includes(subject.value)) ||
      !message.valid || !message.value
    ) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value,
    });

    if (error) {
      console.error("[POST /api/contact] Failed to save contact submission.");
      return NextResponse.json({ error: "Unable to send your message." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
