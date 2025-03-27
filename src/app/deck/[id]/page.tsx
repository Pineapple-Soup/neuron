"use client";

import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/components/QuillBox"), {
  ssr: false,
});

export default function DeckEditor() {
  return (
    <div className="container mx-auto p-4">
      <QuillEditor />
    </div>
  );
}
