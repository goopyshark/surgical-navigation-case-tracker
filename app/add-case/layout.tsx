
import { redirect } from "next/navigation";
import { getSupabaseAuthServer } from "../lib/supabaseAuthServer";

export default async function AddCaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseAuthServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?next=/add-case");
  }

  return <>{children}</>;
}
