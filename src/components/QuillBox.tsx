"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import { QuillBinding } from "y-quill";

Quill.register("modules/cursors", QuillCursors);

export default function QuillBox() {
  const pathname = usePathname();
  const roomId = pathname.split("/").pop();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId || !editorRef.current) return;

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

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:1234",
      roomId,
      ydoc,
      { WebSocketPolyfill: WebSocket, connect: true },
    );

    provider.on("sync", (isSynced: boolean) => {
      console.log("Synced:", isSynced);
    });
    provider.on("status", (event: { status: string }) => {
      console.log("Status:", event.status);
    });
    provider.on("status", (event) => {
      if (event.status === "disconnected") {
        console.warn("WebSocket disconnected - attempting reconnect");
      }
    });

    const binding = new QuillBinding(
      ydoc.getText("quill"),
      quill,
      provider.awareness,
    );

    return () => {
      binding.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId]);

  return <div ref={editorRef} style={{ height: "500px" }} />;
}
