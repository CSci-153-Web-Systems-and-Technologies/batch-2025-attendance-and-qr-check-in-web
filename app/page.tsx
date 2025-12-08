"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "../lib/client";
import LoginPage  from "./login/page";

export default function Home() {
  const supabase = createClient(); 
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("todos").select("*");
      setData(data || []);
    }
    load();
  }, []);
  
  return (
    <>
      < LoginPage />
    </>
  );
}
