
import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../lib/supabaseServer";
import { requireRole } from "../../lib/requireRole";

export const dynamic = "force-dynamic";

// GET - Retrieve all surgical cases
export async function GET() {
  try {
    // Only approved users can view cases.
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

    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("surgical_cases")
      .select(
        "id, name, procedure, region, type, date, duration, status, system_name, registration_method, accuracy, technical_issues, notes, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Supabase query failed:",
        error.message
      );

      return NextResponse.json(
        { error: "Unable to retrieve surgical cases." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      cases: data ?? [],
    });
  } catch (error) {
    console.error("Database API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve surgical cases." },
      { status: 500 }
    );
  }
}

// POST - Create a new surgical case
export async function POST(request: Request) {
  try {
    // Administrators and editors can create cases.
    const access = await requireRole([
      "administrator",
      "editor",
    ]);

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.message },
        { status: access.status }
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

    // Validate required fields.
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

    // Duration must be a positive whole number.
    // No arbitrary maximum duration.
    const durationInput = input.duration;

    const duration =
      typeof durationInput === "string" &&
      /^\d+$/.test(durationInput.trim())
        ? Number(durationInput.trim())
        : NaN;

    if (
      !Number.isSafeInteger(duration) ||
      duration <= 0
    ) {
      return NextResponse.json(
        {
          error: "Duration must be a positive whole number.",
        },
        { status: 400 }
      );
    }

    // Validate case date.
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

    // Normalize optional text fields.
    const optionalText = (field: string) => {
      const value = input[field];

      return typeof value === "string"
        ? value.trim()
        : "";
    };

    // Validate optional accuracy.
    const accuracyInput = optionalText("accuracy");

    const accuracy =
      accuracyInput === ""
        ? null
        : Number(accuracyInput);

    if (
      accuracy !== null &&
      (!Number.isFinite(accuracy) || accuracy < 0)
    ) {
      return NextResponse.json(
        {
          error: "Accuracy must be a non-negative number.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Insert the new surgical case.
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
        registration_method: optionalText(
          "registrationMethod"
        ),
        accuracy,
        technical_issues: optionalText(
          "technicalIssues"
        ),
        notes: optionalText("notes"),
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Supabase insert failed:",
        error.message
      );

      return NextResponse.json(
        { error: "Unable to save surgical case." },
        { status: 500 }
      );
    }

    // Record the case creation in Activity History.
    const { error: activityError } = await supabase
      .from("case_activity_log")
      .insert({
        case_id: data.id,
        case_name: data.name,
        action: "CREATED",
        description:
          `Surgical case "${data.name}" was created.`,
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
