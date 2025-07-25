/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, TimeScale } from "chart.js";
import { useSupabase } from "@/components/SupabaseProvider";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, TimeScale);

interface MoodRow {
  id: number;
  created_at: string;
  mood: string;
}

export default function MoodChart() {
  const { supabase, session } = useSupabase();
  const [rows, setRows] = useState<MoodRow[]>([]);

  useEffect(() => {
    if (!session) return;
    const fetchRows = async () => {
      const { data, error } = await supabase
        .from("moods")
        .select("id, created_at, mood")
        .order("created_at");
      if (!error && data) setRows(data as MoodRow[]);
    };
    fetchRows();
  }, [session, supabase]);

  const data = {
    labels: rows.map((r) => new Date(r.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Mood over time",
        data: rows.map((r) => moodsToIndex(r.mood)),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
      },
    ],
  };

  const options: any = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: (value: number) => indexToMood(value),
        },
      },
    },
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Mood History</h2>
      {rows.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p className="text-center text-sm text-gray-600">No data yet</p>
      )}
    </section>
  );
}

const moodOrder = [
  "Extremely Negative",
  "Very Negative",
  "Negative",
  "Neutral",
  "Positive",
  "Very Positive",
  "Extremely Positive",
];

function moodsToIndex(mood: string) {
  // Simple mapping for demonstration; you can adapt.
  const index = moodOrder.indexOf(mood);
  return index === -1 ? 3 : index;
}

function indexToMood(index: number) {
  return moodOrder[index] || "Neutral";
}