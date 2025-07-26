"use client";

import { useSupabase } from "@/components/SupabaseProvider";
import { useState } from "react";
import { motion } from "framer-motion";

const moods = [
  { label: "Happy", emoji: "😊", color: "bg-yellow-200" },
  { label: "Sad", emoji: "😢", color: "bg-blue-200" },
  { label: "Angry", emoji: "😡", color: "bg-red-200" },
  { label: "Anxious", emoji: "😰", color: "bg-purple-200" },
  { label: "Stressed", emoji: "😫", color: "bg-indigo-200" },
  { label: "Lonely", emoji: "😞", color: "bg-gray-200" },
  { label: "Tired", emoji: "😴", color: "bg-orange-200" },
  { label: "Grateful", emoji: "🙏", color: "bg-teal-200" },
  { label: "Excited", emoji: "🤩", color: "bg-pink-200" },
  { label: "Confused", emoji: "😕", color: "bg-lime-200" },
  { label: "Bored", emoji: "🥱", color: "bg-amber-200" },
];

export default function MoodTracker() {
  const { supabase, session } = useSupabase();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSelect = async (mood: string) => {
    setSelectedMood(mood);
    // Save to DB table "moods"
    if (!session) return;
    const { error } = await supabase.from("moods").insert({
      user_id: session.user.id,
      mood,
    });
    if (error) {
      setStatus("Failed to save mood");
    } else {
      setStatus("Mood saved 🎉");
      setTimeout(() => setStatus(null), 2000);
    }
  };

  return (
    <section className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">How are you feeling today?</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
        {moods.map((m) => (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            key={m.label}
            onClick={() => handleSelect(m.label)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg shadow-sm cursor-pointer ${m.color} ${selectedMood === m.label ? "ring-2 ring-offset-2 ring-indigo-500" : ""}`}
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-xs mt-1 font-medium">{m.label}</span>
          </motion.button>
        ))}
      </div>
      {status && <p className="text-sm text-teal-700">{status}</p>}
    </section>
  );
}