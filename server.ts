import { WebSocketServer } from "ws";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";

const wss = new WebSocketServer({ port: 1234 });
const docs = new Map<string, Y.Doc>(); // Maps room IDs to Y.Doc instances
const serverURL = "ws://localhost:1234"

wss.on("connection", (ws, request) => {
  const roomId = new URL(
    request.url || "",
    `http://${request.headers.host}`,
  ).searchParams.get("room");
  if (!roomId) {
    ws.close();
    return;
  }

  let ydoc = docs.get(roomId);
  if (!ydoc) {
    ydoc = new Y.Doc();
    docs.set(roomId, ydoc);
  }

  // will need to change this url
  new WebsocketProvider(serverURL, roomId as string, ydoc, {
    awareness: new Awareness(ydoc),
    WebSocketPolyfill: WebSocket,
  });
});
console.log("WebSocket server running on " + serverURL);
