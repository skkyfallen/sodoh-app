import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

function isValidEmail(email: string): boolean {
  // Structural check: one @, non-empty local part, non-empty domain with a dot
  const atIdx = email.indexOf("@");
  if (atIdx < 1 || atIdx !== email.lastIndexOf("@")) return false;
  const local = email.slice(0, atIdx);
  const domain = email.slice(atIdx + 1);
  if (local.length === 0 || domain.length === 0) return false;
  const dotIdx = domain.lastIndexOf(".");
  return dotIdx > 0 && dotIdx < domain.length - 1;
}

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

    // Trim inputs early so all subsequent checks operate on the final stored value
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const trimmedSubject = typeof subject === "string" ? subject.trim() : null;

    if (trimmedName.length === 0 || trimmedName.length > MAX_NAME) {
      return NextResponse.json(
        { error: `Name must be between 1 and ${MAX_NAME} characters.` },
        { status: 400 }
      );
    }

    if (trimmedEmail.length > MAX_EMAIL || !isValidEmail(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (trimmedSubject !== null && trimmedSubject.length > MAX_SUBJECT) {
      return NextResponse.json(
        { error: `Subject must be at most ${MAX_SUBJECT} characters.` },
        { status: 400 }
      );
    }

    if (trimmedMessage.length === 0 || trimmedMessage.length > MAX_MESSAGE) {
      return NextResponse.json(
        { error: `Message must be between 1 and ${MAX_MESSAGE} characters.` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject || null,
      message: trimmedMessage,
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
