"use client"
import { useState } from "react"
import Feed from "@/components/feed"
import "./globals.css"
import { useFarcasterIdentity } from "@/lib/use-farcaster-identity"
import { FarcasterUser } from "@/lib/types/farcaster-user"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoginWindow } from "@/components/login-window"
import UploadForm from "@/components/upload-form"

export default function Page({}: {
  searchParams: Record<string, string>
}): JSX.Element {
  const [open, setOpen] = useState(false)
  const [channel, setChannel] = useState(
    "chain://eip155:1/erc721:0x7dd4e31f1530ac682c8ea4d8016e95773e08d8b0"
  )

  const { farcasterUser, loading, startFarcasterSignerProcess, logout } =
    useFarcasterIdentity()

  return (
    <div className="pt-[6rem] px-5 flex flex-col items-center border max-w-[700px] m-auto">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="max-w-[600px] w-full mt-4 border border-slate-500"
            variant="outline"
          >
            +
          </Button>
        </DialogTrigger>
        <Feed channel={channel} setChannel={setChannel} />
        <DialogContent className="sm:max-w-[425px] max-w-[375px]">
          {farcasterUser?.status === "approved" ? (
            <UploadForm farcasterUser={farcasterUser as FarcasterUser} />
          ) : (
            <LoginWindow
              farcasterUser={farcasterUser}
              loading={loading}
              startFarcasterSignerProcess={startFarcasterSignerProcess}
              logout={logout}
            ></LoginWindow>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
