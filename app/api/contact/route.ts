import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = 'edge';

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

    const supabase = await createClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      subject: subject || null,
      message,
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
