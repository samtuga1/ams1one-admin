"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PlayersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dollar-rush-players");
  }, [router]);
  return null;
}
