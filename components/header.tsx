"use client"
import { FaRegUser } from "react-icons/fa"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { tilt_neon } from "@/styles/fonts"
import { LoginWindow } from "./login-window"
import { useEffect, useState } from "react"
import { getFnameFromFid } from "@/lib/actions"
import { useFarcaster } from "@/services/user-context"

export default function Header() {
  const { farcasterUser, loading, startFarcasterSignerProcess, logout } =
    useFarcaster()
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    async function getUsername(fid: any): Promise<string> {
      return await getFnameFromFid(fid)
    }
    if (farcasterUser?.fid) {
      getUsername(farcasterUser?.fid).then((usernameFromFid) => {
        setUsername(usernameFromFid)
      })
    }
  }, [farcasterUser])

  return (
    <header className="flex items-center border border-b bg-white bg-opacity-[0.02] shadow-xl backdrop-blur-sm p-4 justify-between w-full fixed top-0 z-10">
      <div className={`${tilt_neon.className} text-2xl`}>typecast</div>
      {farcasterUser && username ? (
        <>@{username}</>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <FaRegUser />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[375px]">
            <LoginWindow
              farcasterUser={farcasterUser}
              loading={loading}
              startFarcasterSignerProcess={startFarcasterSignerProcess}
              logout={logout}
            ></LoginWindow>
          </DialogContent>
        </Dialog>
      )}
    </header>
  )
}
