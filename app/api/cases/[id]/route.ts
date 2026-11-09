
import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabaseServer";
import { requireRole } from "../../../lib/requireRole";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET - Retrieve an individual surgical case.
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
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

    const { id } = await context.params;

    if (!id.trim()) {
      return NextResponse.json(
        { error: "Missing case ID." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from("surgical_cases")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(
        "Supabase case lookup failed:",
        error.message
      );

      return NextResponse.json(
        { error: "Unable to load case." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Case not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ case: data });
  } catch (error) {
    console.error("Get case API error:", error);

    return NextResponse.json(
      { error: "Unable to load case." },
      { status: 500 }
    );
  }
}

// PATCH - Update an existing surgical case.
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    // Administrators and editors can update cases.
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

    const { id } = await context.params;

    if (!id.trim()) {
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

    // Validate the surgical case date.
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
    const accuracyText = optionalText("accuracy");

    const accuracy =
      accuracyText === ""
        ? null
        : Number(accuracyText);

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

    // Update the surgical case.
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
        registration_method: optionalText(
          "registrationMethod"
        ),
        accuracy,
        technical_issues: optionalText(
          "technicalIssues"
        ),
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

    // Record the update in Activity History.
    const { error: activityError } = await supabase
      .from("case_activity_log")
      .insert({
        case_id: data.id,
        case_name: data.name,
        action: "UPDATED",
        description:
          `Surgical case "${data.name}" was updated.`,
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

// DELETE - Permanently delete a surgical case.
export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    // Only administrators can delete cases.
    const access = await requireRole([
      "administrator",
    ]);

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.message },
        { status: access.status }
      );
    }

    const { id } = await context.params;

    if (!id.trim()) {
      return NextResponse.json(
        { error: "Missing case ID." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Delete the case and retrieve its information
    // for the activity log.
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

    // Preserve deletion history.
    const { error: activityError } = await supabase
      .from("case_activity_log")
      .insert({
        case_id: data.id,
        case_name: data.name,
        action: "DELETED",
        description:
          `Surgical case "${data.name}" was deleted.`,
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
