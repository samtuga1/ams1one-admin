"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import useAuth from "@/stores/auth.store";

const Home = () => {
  const { auth } = useAuth();

  useEffect(() => {
    if (auth) {
      redirect("/sales");
    } else {
      redirect("/login");
    }
  }, [auth]);
};

export default Home;
