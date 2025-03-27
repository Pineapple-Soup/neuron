import { WebSocketServer } from "ws";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";

const wss = new WebSocketServer({ port: 1234 });
const docs = new Map<string, Y.Doc>(); // Persists docs by room ID

wss.on("connection", (ws, req) => {
  // Extract room ID from URL (e.g., ws://localhost:1234?room=my-room)
  const roomId = new URL(
    req.url || "",
    `http://${req.headers.host}`,
  ).searchParams.get("room");

  if (!roomId) return ws.close();

  // Reuse or create a Y.Doc for this room
  const ydoc = docs.get(roomId) || new Y.Doc();
  if (!docs.has(roomId)) docs.set(roomId, ydoc);

  // Mirror npx y-websocket's behavior
  new WebsocketProvider(
    null as any, // Bypass provider's WebSocket creation
    roomId,
    ydoc,
    {
      _ws: ws, // Inject raw WebSocket
      awareness: new Awareness(ydoc), // Enable live cursors
      disableBc: true, // Disable BroadcastChannel (server-only)
    },
  );

  // Optional: Logging
  console.log(`User joined room: ${roomId}`);
});

console.log("WebSocket server running on ws://localhost:1234");
