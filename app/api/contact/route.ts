import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


/**
 * Basic email sanity check using a split-based approach rather than a
 * backtracking-prone regex, to avoid ReDoS vulnerability.
 * The check is intentionally permissive — it only verifies that there is
 * exactly one "@" symbol, a non-empty local part, and a domain with at
 * least one dot. Full RFC 5321 validation is left to the database/email
 * provider layer to avoid false rejections of unusual but valid addresses.
 */
function isValidEmail(email: string): boolean {
  const atIdx = email.indexOf("@");
  if (atIdx <= 0 || atIdx !== email.lastIndexOf("@")) return false;
  const domain = email.slice(atIdx + 1);
  const dotIdx = domain.lastIndexOf(".");
  return dotIdx > 0 && dotIdx < domain.length - 1;
}

const ALLOWED_SUBJECTS = [
  "General Inquiry",
  "Partnership Proposal",
  "Technical Support",
  "Press & Media",
];

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

    // Length limits to prevent abuse
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      name.trim().length > 100 ||
      email.trim().length > 254 ||
      message.trim().length > 5000
    ) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    // Basic email format validation
    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Subject must be one of the allowed values (or omitted)
    if (subject && !ALLOWED_SUBJECTS.includes(subject)) {
      return NextResponse.json({ error: "Invalid subject." }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim(),
      subject: subject ?? null,
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
