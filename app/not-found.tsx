"use client";

import EmptyImage from "@/public/images/new/empty-page.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="relative w-64 h-64">
          <Image
            src={EmptyImage}
            alt="Page not found"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="mt-4 text-2xl font-gotham-black text-gray-800">
          Page not found
        </h1>
        <p className="mt-2 text-sm font-gotham-regular text-gray-400 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <button
          onClick={() => router.push("/sales")}
          className="mt-8 bg-linear-to-br from-primary to-[#5b4abf] text-white text-sm font-gotham-bold px-8 py-3 rounded-lg transition-opacity hover:opacity-90 cursor-pointer"
        >
          Go to Sales
        </button>
      </div>
    </div>
  );
}
