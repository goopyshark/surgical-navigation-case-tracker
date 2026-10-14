
import { NextResponse } from "next/server";
import { getSupabaseAuthServer } from "../../../lib/supabaseAuthServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await getSupabaseAuthServer();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "No valid login session found.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      message: "Supabase authentication verified.",
    });
  } catch (error) {
    console.error("Authentication check failed:", error);

    return NextResponse.json(
      {
        authenticated: false,
        message: "Unable to verify authentication.",
      },
      { status: 500 }
    );
  }
}
