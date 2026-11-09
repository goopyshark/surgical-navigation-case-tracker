
import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/supabaseServer";
import { requireRole } from "../../../../lib/requireRole";

export const dynamic = "force-dynamic";

type UserRole =
  | "administrator"
  | "editor"
  | "viewer";

type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const VALID_ROLES: UserRole[] = [
  "administrator",
  "editor",
  "viewer",
];

const VALID_STATUSES: ApprovalStatus[] = [
  "pending",
  "approved",
  "rejected",
];

// PATCH - Update a user's role and approval status.
// Only approved administrators can perform this action.
export async function PATCH(
  request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    // Validate the user ID.
    const UUID_PATTERN =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!UUID_PATTERN.test(id)) {
      return NextResponse.json(
        { error: "Invalid user ID." },
        { status: 400 }
      );
    }

    // Prevent administrators from changing their own access.
    if (id === access.userId) {
      return NextResponse.json(
        {
          error:
            "You cannot change your own role or approval status.",
        },
        { status: 403 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "Invalid account update." },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;

    const role = input.role;
    const approvalStatus = input.approval_status;

    if (
      typeof role !== "string" ||
      !VALID_ROLES.includes(role as UserRole)
    ) {
      return NextResponse.json(
        { error: "Invalid user role." },
        { status: 400 }
      );
    }

    if (
      typeof approvalStatus !== "string" ||
      !VALID_STATUSES.includes(
        approvalStatus as ApprovalStatus
      )
    ) {
      return NextResponse.json(
        { error: "Invalid approval status." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Confirm the target account exists.
    const { data: existingUser, error: lookupError } =
      await supabase
        .from("user_profiles")
        .select("id, role, approval_status")
        .eq("id", id)
        .maybeSingle();

    if (lookupError) {
      console.error(
        "Unable to retrieve account:",
        lookupError.message
      );

      return NextResponse.json(
        { error: "Unable to retrieve account." },
        { status: 500 }
      );
    }

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Update the target account.
    const { data: updatedUser, error: updateError } =
      await supabase
        .from("user_profiles")
        .update({
          role,
          approval_status: approvalStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          "id, email, role, approval_status, created_at, updated_at"
        )
        .single();

    if (updateError) {
      console.error(
        "Unable to update account:",
        updateError.message
      );

      return NextResponse.json(
        { error: "Unable to update account." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: updatedUser,
      message: "Account updated successfully.",
    });
  } catch (error) {
    console.error("Admin account update error:", error);

    return NextResponse.json(
      { error: "Unable to update account." },
      { status: 500 }
    );
  }
}
