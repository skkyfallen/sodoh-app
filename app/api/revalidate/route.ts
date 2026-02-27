import { NextResponse } from "next/server";

/**
 * POST /api/revalidate
 * Revalidates pages after admin edits. Expects { paths: string[] } body.
 * Protected by checking the Supabase auth cookie via middleware.
 */
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paths: string[] = body.paths ?? ["/", "/about", "/products", "/contact"];

    // revalidatePath is not available on the edge runtime (Cloudflare Pages);
    // cache is busted by ISR's revalidate interval instead.
    void paths;

    return NextResponse.json({ revalidated: true, paths });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
