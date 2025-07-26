"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseProvider";
import MoodTracker from "@/components/MoodTracker";
import JournalEditor from "@/components/JournalEditor";
import MoodChart from "@/components/MoodChart";
import PastEntries from "@/components/PastEntries";

export default function DashboardPage() {
  const { session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.replace("/login");
    }
  }, [session, router]);

  if (!session) {
    return null; // or loading indicator
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-teal-50 p-4 md:p-10 space-y-8">
      <h1 className="text-3xl font-bold text-center">Welcome back 👋</h1>
      <MoodTracker />
      <JournalEditor />
      <MoodChart />
      <PastEntries />
    </main>
  );
}