
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "../../lib/supabaseServer";
import { requireRole } from "../../lib/requireRole";

export const dynamic = "force-dynamic";

const ALLOWED_ACTIONS = [
  "CREATED",
  "UPDATED",
  "DELETED",
] as const;

const ACTIVITY_LIMIT = 100;

// GET - Retrieve surgical case activity history.
// Optional filter: ?action=CREATED, UPDATED, or DELETED.
export async function GET(request: NextRequest) {
  try {
    // Only approved users can view activity history.
    const access = await requireRole([
      "administrator",
      "editor",
      "viewer",
    ]);

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.message },
        { status: access.status }
      );
    }

    // Read the optional action filter.
    const action = request.nextUrl.searchParams.get("action");

    if (
      action !== null &&
      !ALLOWED_ACTIONS.some(
        (allowedAction) => allowedAction === action
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid action filter. Use CREATED, UPDATED, or DELETED.",
        },
        { status: 400 }
      );
    }

    // Retrieve activity records from Supabase.
    const supabase = getSupabaseServer();

    let query = supabase
      .from("case_activity_log")
      .select(
        "id, case_id, case_name, action, description, performed_at"
      );

    // Apply filtering at the database level.
    if (action !== null) {
      query = query.eq("action", action);
    }

    // Return the most recent matching activities.
    const { data, error } = await query
      .order("performed_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(ACTIVITY_LIMIT);

    if (error) {
      console.error(
        "Unable to retrieve activity history:",
        error.message
      );

      return NextResponse.json(
        { error: "Unable to retrieve activity history." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      activities: data ?? [],
    });
  } catch (error) {
    console.error("Activity history API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve activity history." },
      { status: 500 }
    );
  }
}
