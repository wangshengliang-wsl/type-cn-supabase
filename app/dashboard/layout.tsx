import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <DashboardSidebar user={user} />
      <main className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

