"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function SupabaseTest() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("packages").select("*");
      setData(data);
      setError(error);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Supabase Connection Test</h1>
      {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
} 