
import "server-only";

import { getSupabaseAuthServer } from "./supabaseAuthServer";
import { getSupabaseServer } from "./supabaseServer";

export type UserRole =
  | "administrator"
  | "editor"
  | "viewer";

type AuthorizedUser = {
  authorized: true;
  userId: string;
  role: UserRole;
};

type UnauthorizedUser = {
  authorized: false;
  status: number;
  message: string;
};

type AuthorizationResult =
  | AuthorizedUser
  | UnauthorizedUser;

export async function requireRole(
  allowedRoles: UserRole[]
): Promise<AuthorizationResult> {
  // Verify the user's authentication session.
  const auth = await getSupabaseAuthServer();

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    return {
      authorized: false,
      status: 401,
      message: "Authentication required.",
    };
  }

  // Retrieve the user's role and approval status.
  const supabase = getSupabaseServer();

  const { data: profile, error: profileError } =
    await supabase
      .from("user_profiles")
      .select("role, approval_status")
      .eq("id", user.id)
      .maybeSingle();

  if (profileError) {
    console.error(
      "Unable to retrieve user permissions:",
      profileError.message
    );

    return {
      authorized: false,
      status: 503,
      message: "Unable to verify account permissions.",
    };
  }

  // Users without profiles cannot access the application.
  if (!profile) {
    return {
      authorized: false,
      status: 403,
      message: "Your account is awaiting administrator approval.",
    };
  }

  // Only approved accounts can access protected resources.
  if (profile.approval_status !== "approved") {
    return {
      authorized: false,
      status: 403,
      message:
        profile.approval_status === "rejected"
          ? "Your account access request was declined."
          : "Your account is awaiting administrator approval.",
    };
  }

  const validRoles: UserRole[] = [
    "administrator",
    "editor",
    "viewer",
  ];

  if (
    !validRoles.includes(profile.role as UserRole)
  ) {
    return {
      authorized: false,
      status: 403,
      message: "Invalid account role.",
    };
  }

  const role = profile.role as UserRole;

  // Check whether the user's role permits this action.
  if (!allowedRoles.includes(role)) {
    return {
      authorized: false,
      status: 403,
      message:
        "You do not have permission to perform this action.",
    };
  }

  return {
    authorized: true,
    userId: user.id,
    role,
  };
}
