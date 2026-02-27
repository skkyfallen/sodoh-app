import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * POST /api/revalidate
 * Revalidates pages after admin edits. Expects { paths: string[] } body.
 * Protected by checking the Supabase auth cookie via middleware.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paths: string[] = body.paths ?? ["/", "/about", "/products", "/contact"];

    for (const p of paths) {
      revalidatePath(p);
    }

    return NextResponse.json({ revalidated: true, paths });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
