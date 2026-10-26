
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAuthServer } from "../../lib/supabaseAuthServer";
import { getSupabaseServer } from "../../lib/supabaseServer";

export const dynamic = "force-dynamic";

// GET - Retrieve surgical case activity history
// Optional filter: ?action=CREATED, UPDATED, or DELETED
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

    // Read the optional action filter.
    const action = request.nextUrl.searchParams.get("action");

    const allowedActions = ["CREATED", "UPDATED", "DELETED"];

    // Reject unsupported action values.
    if (action !== null && !allowedActions.includes(action)) {
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

    const { data, error } = await query
      .order("performed_at", { ascending: false })
      .limit(100);

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
