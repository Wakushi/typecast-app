"use client"
import { useState } from "react"
import Feed from "@/components/feed"
import "./globals.css"

export default function Page({}: {
  searchParams: Record<string, string>
}): JSX.Element {
  const [open, setOpen] = useState(false)
  const [channel, setChannel] = useState(
    "chain://eip155:1/erc721:0x7dd4e31f1530ac682c8ea4d8016e95773e08d8b0"
  )

  // const { farcasterUser, loading, startFarcasterSignerProcess, logout } =
  //   useFarcasterIdentity()

  return (
    <div className="flex flex-col min-h-screen w-full sm:px-0 px-3 justify-center items-center gap-6 mb-6">
      <Feed channel={channel} setChannel={setChannel} />
    </div>
  )
}
