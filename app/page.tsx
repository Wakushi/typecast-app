"use client"
import { useState } from "react"
import Feed from "@/components/feed"
import "./globals.css"

export default function Page({}: {
  searchParams: Record<string, string>
}): JSX.Element {
  const [channel, setChannel] = useState(
    "chain://eip155:1/erc721:0x7dd4e31f1530ac682c8ea4d8016e95773e08d8b0"
  )

  // const { farcasterUser, loading, startFarcasterSignerProcess, logout } =
  //   useFarcasterIdentity()

  return (
    <div className="pt-20">
      <Feed channel={channel} setChannel={setChannel} />
    </div>
  )
}
