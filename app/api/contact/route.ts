import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid field types." }, { status: 400 });
    }

    if (name.trim().length === 0 || name.length > MAX_NAME) {
      return NextResponse.json(
        { error: `Name must be between 1 and ${MAX_NAME} characters.` },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email) || email.length > MAX_EMAIL) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (subject !== undefined && subject !== null) {
      if (typeof subject !== "string" || subject.length > MAX_SUBJECT) {
        return NextResponse.json(
          { error: `Subject must be at most ${MAX_SUBJECT} characters.` },
          { status: 400 }
        );
      }
    }

    if (message.trim().length === 0 || message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { error: `Message must be between 1 and ${MAX_MESSAGE} characters.` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() || null : null,
      message: message.trim(),
    });

    if (error) {
      console.error("[POST /api/contact]", error.message);
      return NextResponse.json({ error: "Failed to save message." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
