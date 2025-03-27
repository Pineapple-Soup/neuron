"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");

  return (
    <div className="h-screen w-full text-center flex flex-col justify-center align-middle gap-12">
      <h1 className="font-bold text-3xl">Hi! Welcome to Neuron.</h1>
      <div className="flex flex-row gap-2 mx-auto">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="border p-2 rounded w-48"
        />
        <Link href={`/deck/${roomId}`}>
          <button className="bg-black text-white p-2 rounded-lg hover:cursor-pointer">
            Go to Room
          </button>
        </Link>
      </div>
    </div>
  );
}
