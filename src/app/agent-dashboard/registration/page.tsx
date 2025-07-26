"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AgentRegistrationRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?register=agent");
  }, [router]);

  return null;
}
