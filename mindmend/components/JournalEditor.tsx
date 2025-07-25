/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";

export default function JournalEditor() {
  const { supabase, session } = useSupabase();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      // Save to database
      if (session) {
        const { error } = await supabase.from("journal_entries").insert({
          user_id: session.user.id,
          text,
          sentiment: data.sentiment,
          emotion: data.emotion,
          summary: data.summary,
        });
        if (error) throw new Error(error.message);
      }

      setMessage("Entry saved with insights 📝");
      setText("");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Daily Journal</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Write about your day..."
        className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-indigo-500"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-md transition-colors disabled:opacity-60"
      >
        {loading ? "Analyzing..." : "Save Entry"}
      </button>
      {message && <p className="text-center text-sm text-indigo-700">{message}</p>}
    </section>
  );
}