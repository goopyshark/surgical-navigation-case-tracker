
import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabaseServer";
import { requireRole } from "../../../lib/requireRole";

export const dynamic = "force-dynamic";

// GET - Retrieve registered user profiles.
// Only approved administrators can access this endpoint.
export async function GET() {
  try {
    const access = await requireRole([
      "administrator",
    ]);

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.message },
        { status: access.status }
      );
    }

    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("user_profiles")
      .select(
        "id, email, role, approval_status, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Unable to retrieve user profiles:",
        error.message
      );

      return NextResponse.json(
        { error: "Unable to retrieve registered users." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      users: data ?? [],
    });
  } catch (error) {
    console.error("Admin users API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve registered users." },
      { status: 500 }
    );
  }
}
