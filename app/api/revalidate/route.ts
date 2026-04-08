import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const ALLOWED_PATHS = ["/", "/about", "/products", "/contact"];

/**
 * POST /api/revalidate
 * Revalidates pages after admin edits. Expects { paths: string[] } body.
 * Protected by checking the Supabase auth cookie via middleware.
 * Only paths in the allow-list are revalidated to prevent path injection.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requestedPaths: unknown[] = Array.isArray(body.paths)
      ? body.paths
      : ALLOWED_PATHS;

    // Only allow paths from the known allow-list
    const paths = requestedPaths.filter(
      (p): p is string => typeof p === "string" && ALLOWED_PATHS.includes(p)
    );

    if (paths.length === 0) {
      return NextResponse.json(
        { error: "No valid paths to revalidate." },
        { status: 400 }
      );
    }

    for (const p of paths) {
      revalidatePath(p);
    }

    return NextResponse.json({ revalidated: true, paths });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
