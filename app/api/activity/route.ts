
import { NextResponse } from "next/server";
import { getSupabaseAuthServer } from "../../lib/supabaseAuthServer";
import { getSupabaseServer } from "../../lib/supabaseServer";

export const dynamic = "force-dynamic";

// GET - Retrieve surgical case activity history
export async function GET() {
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

    // Only retrieve records after authentication succeeds.
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("case_activity_log")
      .select(
        "id, case_id, case_name, action, description, performed_at"
      )
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
