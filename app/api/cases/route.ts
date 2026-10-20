
import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../lib/supabaseServer";
import { getSupabaseAuthServer } from "../../lib/supabaseAuthServer";
import { requireAdmin } from "../../lib/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("surgical_cases")
      .select(
        "id, name, procedure, region, type, date, duration, status, system_name, registration_method, accuracy, technical_issues, notes, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase query failed:", error.message);

      return NextResponse.json(
        { error: "Unable to retrieve surgical cases." },
        { status: 500 }
      );
    }

    return NextResponse.json({ cases: data ?? [] });
  } catch (error) {
    console.error("Database API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve surgical cases." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Only the configured administrator may create cases.
    const admin = await requireAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.message },
        { status: admin.status }
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "Invalid case data." },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;

    const requiredFields = [
      "name",
      "procedure",
      "region",
      "type",
      "date",
      "duration",
      "status",
    ];

    for (const field of requiredFields) {
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

    if (
      !Number.isSafeInteger(duration) ||
      duration <= 0
    ) {
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

    const optionalText = (field: string) => {
      const value = input[field];

      return typeof value === "string"
        ? value.trim()
        : "";
    };

    const accuracyInput = optionalText("accuracy");

    const accuracy =
      accuracyInput === "" ? null : Number(accuracyInput);

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
      .insert({
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
      .select()
      .single();

    if (error) {
      console.error("Supabase insert failed:", error.message);

      return NextResponse.json(
        { error: "Unable to save surgical case." },
        { status: 500 }
      );
    }

    // WEEK 6: Record case creation in the activity log.
    const { error: activityError } = await supabase
      .from("case_activity_log")
      .insert({
        case_id: data.id,
        case_name: data.name,
        action: "CREATED",
        description: `Surgical case "${data.name}" was created.`,
      });

    if (activityError) {
      console.error(
        "Case activity logging failed:",
        activityError.message
      );
    }

    return NextResponse.json(
      {
        case: data,
        activityLogged: !activityError,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create case API error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to save surgical case." },
      { status: 500 }
    );
  }
}
