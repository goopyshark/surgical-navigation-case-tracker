
import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabaseServer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireAdmin } from "../../../lib/requireAdmin";

// GET - Load one surgical case
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();

  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Authentication cookies are refreshed by proxy.ts.
        },
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing case ID" },
      { status: 400 }
    );
  }

  const { data, error } = await getSupabaseServer()
    .from("surgical_cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase case lookup failed:", error.message);

    return NextResponse.json(
      { error: "Unable to load case" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Case not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ case: data });
}

// PATCH - Update an existing surgical case
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.message },
        { status: admin.status }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing case ID." },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid case data." },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;

    for (const field of [
      "name",
      "procedure",
      "region",
      "type",
      "date",
      "duration",
      "status",
    ]) {
      if (
        typeof input[field] !== "string" ||
        !(input[field] as string).trim()
      ) {
        return NextResponse.json(
          { error: `${field} is required.` },
          { status: 400 }
        );
      }
    }

    const duration = Number(input.duration);

    if (!Number.isSafeInteger(duration) || duration <= 0) {
      return NextResponse.json(
        { error: "Duration must be a positive whole number." },
        { status: 400 }
      );
    }

    const date = input.date as string;

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`)
        .toISOString()
        .slice(0, 10) !== date
    ) {
      return NextResponse.json(
        { error: "Enter a valid case date." },
        { status: 400 }
      );
    }

    const optionalText = (field: string) =>
      typeof input[field] === "string"
        ? (input[field] as string).trim()
        : "";

    const accuracyText = optionalText("accuracy");

    const accuracy =
      accuracyText === "" ? null : Number(accuracyText);

    if (
      accuracy !== null &&
      (!Number.isFinite(accuracy) || accuracy < 0)
    ) {
      return NextResponse.json(
        { error: "Accuracy must be a non-negative number." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("surgical_cases")
      .update({
        name: (input.name as string).trim(),
        procedure: (input.procedure as string).trim(),
        region: (input.region as string).trim(),
        type: (input.type as string).trim(),
        date,
        duration,
        status: (input.status as string).trim(),
        system_name: optionalText("systemName"),
        registration_method: optionalText("registrationMethod"),
        accuracy,
        technical_issues: optionalText("technicalIssues"),
        notes: optionalText("notes"),
      })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error(
        "Supabase case update failed:",
        error.message
      );

      return NextResponse.json(
        { error: "Unable to update case." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Case not found." },
        { status: 404 }
      );
    }

    // WEEK 6: Log successful case updates.
    const { error: activityError } = await supabase
      .from("case_activity_log")
      .insert({
        case_id: data.id,
        case_name: data.name,
        action: "UPDATED",
        description: `Surgical case "${data.name}" was updated.`,
      });

    if (activityError) {
      console.error(
        "Case update activity logging failed:",
        activityError.message
      );
    }

    return NextResponse.json({
      case: data,
      activityLogged: !activityError,
    });
  } catch (error) {
    console.error("Update case API error:", error);

    return NextResponse.json(
      { error: "Unable to update case." },
      { status: 500 }
    );
  }
}

// DELETE - Permanently delete a surgical case
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.message },
        { status: admin.status }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing case ID." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Return the case name before the record is removed.
    const { data, error } = await supabase
      .from("surgical_cases")
      .delete()
      .eq("id", id)
      .select("id, name")
      .maybeSingle();

    if (error) {
      console.error(
        "Supabase case deletion failed:",
        error.message
      );

      return NextResponse.json(
        { error: "Unable to delete case." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Case not found." },
        { status: 404 }
      );
    }

    // WEEK 6: Preserve deletion history in a separate table.
    const { error: activityError } = await supabase
      .from("case_activity_log")
      .insert({
        case_id: data.id,
        case_name: data.name,
        action: "DELETED",
        description: `Surgical case "${data.name}" was deleted.`,
      });

    if (activityError) {
      console.error(
        "Case deletion activity logging failed:",
        activityError.message
      );
    }

    return NextResponse.json({
      success: true,
      deletedId: data.id,
      activityLogged: !activityError,
    });
  } catch (error) {
    console.error("Delete case API error:", error);

    return NextResponse.json(
      { error: "Unable to delete case." },
      { status: 500 }
    );
  }
}
