"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import { QuillBinding } from "y-quill";

// Register Quill modules
Quill.register("modules/cursors", QuillCursors);

export default function DeckEditor() {
  // this is to get id from url
  const pathname = usePathname();
  const roomId = pathname.split("/").pop();
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!roomId || !editorRef.current) return;

    // Initialize Quill
    const quill = new Quill(editorRef.current, {
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
        history: {
          userOnly: true, // Local undo only
        },
      },
      placeholder: "Start collaborating...",
      theme: "snow",
    });
    quillRef.current = quill;

    // Initialize Yjs
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("quill");
    const provider = new WebsocketProvider(
      "ws://localhost:1234", // WebSocket server URL
      roomId as string, // Room ID from URL
      ydoc,
      { WebSocketPolyfill: WebSocket }, // Required for Next.js
    );

    // Shared text type
    const binding = new QuillBinding(ytext, quill, provider.awareness);

    // Cleanup
    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId]);

  return (
    <div className="container mx-auto p-4">
      <div ref={editorRef} style={{ height: "500px" }} />
    </div>
  );
}
