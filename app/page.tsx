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
import HireFrameForm from "@/components/hire-frame-form"

export default function Page({}: {
  searchParams: Record<string, string>
}): JSX.Element {
  const [channel, setChannel] = useState(
    "chain://eip155:1/erc721:0x7dd4e31f1530ac682c8ea4d8016e95773e08d8b0"
  )

  const { farcasterUser, loading, startFarcasterSignerProcess, logout } =
    useFarcasterIdentity()

  return (
    <div className="pt-[6rem] px-5 flex flex-col items-center border max-w-[700px] m-auto">
      <div className="max-w-[600px] gap-4 w-full flex items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full border border-slate-500"
              variant="outline"
            >
              Create post
            </Button>
          </DialogTrigger>
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full border border-slate-500"
              variant="default"
            >
              I'm open for work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[375px] max-h-[100vh] rounded overflow-auto">
            {farcasterUser?.status !== "approved" ? (
              <HireFrameForm farcasterUser={farcasterUser as FarcasterUser} />
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
      <Feed channel={channel} setChannel={setChannel} />
    </div>
  )
}
