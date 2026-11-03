
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAuthServer } from "../../lib/supabaseAuthServer";
import { getSupabaseServer } from "../../lib/supabaseServer";

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
    // Verify that the user is authenticated.
    const auth = await getSupabaseAuthServer();

    const {
      data: { user },
      error: authError,
    } = await auth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Read the optional activity filter.
    const action = request.nextUrl.searchParams.get("action");

    // Reject unsupported filter values.
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

    // Connect to Supabase.
    const supabase = getSupabaseServer();

    let query = supabase
      .from("case_activity_log")
      .select(
        "id, case_id, case_name, action, description, performed_at"
      );

    // Apply filtering directly in the database.
    if (action !== null) {
      query = query.eq("action", action);
    }

    // Retrieve the most recent matching activities.
    // Use ID as a secondary sort for consistent ordering
    // when timestamps are identical.
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
