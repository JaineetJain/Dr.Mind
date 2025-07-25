"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";

interface Entry {
  id: number;
  text: string;
  created_at: string;
  emotion: string;
  sentiment: string;
}

export default function PastEntries() {
  const { supabase, session } = useSupabase();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (!session) return;
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("id, text, created_at, emotion, sentiment")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setEntries(data as Entry[]);
      }
    };
    fetchEntries();
  }, [session, supabase]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Past Entries</h2>
      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {entries.map((e) => (
          <article
            key={e.id}
            className="p-4 bg-white shadow rounded-lg border border-gray-100"
          >
            <header className="flex justify-between items-center text-sm mb-2">
              <span className="font-medium">{e.emotion || e.sentiment}</span>
              <time className="text-gray-500">
                {new Date(e.created_at).toLocaleString()}
              </time>
            </header>
            <p className="whitespace-pre-wrap text-sm">{e.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}