import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const supabase = await createClient();

  // 1. Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch user profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 3. Render Dashboard with data
  return (
    <Dashboard profile={profile} />
  );
}
