
import "server-only";

import { getSupabaseAuthServer } from "./supabaseAuthServer";

export async function requireAdmin() {
  const supabase = await getSupabaseAuthServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      authorized: false as const,
      status: 401,
      message: "Authentication required.",
    };
  }

  const adminUserId = process.env.SUPABASE_ADMIN_USER_ID;

  if (!adminUserId) {
    console.error("SUPABASE_ADMIN_USER_ID is not configured.");

    return {
      authorized: false as const,
      status: 503,
      message: "Administrator access is not configured.",
    };
  }

  if (user.id !== adminUserId) {
    return {
      authorized: false as const,
      status: 403,
      message: "Administrator access required.",
    };
  }

  return {
    authorized: true as const,
    userId: user.id,
  };
}
