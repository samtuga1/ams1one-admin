"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  token: string;
  dimmed?: boolean;
}

export default function QRCodeDisplay({ token, dimmed }: QRCodeDisplayProps) {
  return (
    <div
      className="rounded-2xl p-4 bg-white inline-block"
      style={{ opacity: dimmed ? 0.25 : 1, filter: dimmed ? "grayscale(1)" : "none" }}
    >
      <QRCodeSVG
        value={token}
        size={280}
        bgColor="#ffffff"
        fgColor="#111111"
        level="M"
      />
    </div>
  );
}
