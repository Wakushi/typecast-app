"use client"
import { FaRegUser } from "react-icons/fa"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { tilt_neon } from "@/public/fonts"
import { LoginWindow } from "./login-window"
import { useEffect, useState } from "react"
import { getUserData } from "@/lib/actions"
import { useFarcaster } from "@/services/user-context"
import { GiTBrick } from "react-icons/gi"
import { FaCircleInfo } from "react-icons/fa6"

export default function Header() {
  const { farcasterUser, loading, startFarcasterSignerProcess, logout } =
    useFarcaster()
  const [detailedUser, setDetailedUser] = useState<any>({})

  useEffect(() => {
    async function getUser(fid: any): Promise<any> {
      return await getUserData(fid)
    }
    if (farcasterUser?.fid) {
      getUser(farcasterUser.fid).then((user) => {
        setDetailedUser(user)
      })
    }
  }, [farcasterUser])

  return (
    <header className="flex items-center border border-b bg-white bg-opacity-[0.02] shadow-xl backdrop-blur-sm p-4 md:px-6 justify-between w-full fixed top-0 z-10">
      <div
        className={`${tilt_neon.className} text-2xl flex items-center gap-2`}
      >
        <GiTBrick className="text-[2rem]" />
        <span>typecast</span>
      </div>
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <FaCircleInfo className="text-2xl opacity-60" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[375px]">
            <div>About</div>
          </DialogContent>
        </Dialog>
        {farcasterUser?.fid && detailedUser.username ? (
          <a
            href={`https://warpcast.com/${detailedUser.username}`}
            target="_blank"
            className="min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-[50%] overflow-hidden"
          >
            {" "}
            <img
              src={detailedUser.pfp_url}
              alt={`@${detailedUser?.username}'s profile picture`}
              width={48}
              height={48}
              className="min-w-[48px] min-h-[48px] object-cover"
            />
          </a>
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
      </div>
    </header>
  )
}
