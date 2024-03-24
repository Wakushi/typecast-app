"use client"
import { useEffect, useState } from "react"
import Feed from "@/components/feed"
import "./globals.css"
import { FarcasterUser } from "@/lib/types/farcaster-user"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoginWindow } from "@/components/login-window"
import UploadForm from "@/components/upload-form"
import HireFrameForm from "@/components/hire-frame-form"
import { useFarcaster } from "@/services/user-context"
import { CastData } from "@/lib/types/cast"
import { DEV_CHANNEL } from "@/lib/utils"

export default function Page({}: {
  searchParams: Record<string, string>
}): JSX.Element {
  const { farcasterUser, loading, startFarcasterSignerProcess, logout } =
    useFarcaster()

  const [feed, setFeed] = useState<CastData[]>([])
  const [loadingFeed, setLoadingFeed] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextPageToken, setNextPageToken] = useState("")

  async function fetchData(nextPage: any, initialLoad: boolean) {
    try {
      if (initialLoad) {
        setLoadingFeed(true)
      } else {
        setLoadingMore(true)
      }
      const data = JSON.stringify({
        channel: DEV_CHANNEL,
        nextPage: initialLoad ? "" : nextPage,
      })
      const feedData = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/feed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }
      )
      const feed: CastData[] = await feedData.json()
      if (initialLoad) {
        setFeed(feed)
      } else {
        setFeed((prevFeed: any) => [...prevFeed, ...feed])
      }
      setNextPageToken(feed[0].pageToken || "")
      setLoadingFeed(false)
      setLoadingMore(false)
    } catch (error) {
      console.log(error)
      setLoadingFeed(false)
      setLoadingMore(false)
    }
  }

  function refetchData(reloadFeed: boolean = false) {
    fetchData(nextPageToken, reloadFeed)
  }

  useEffect(() => {
    fetchData("", true)
  }, [])

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
              <UploadForm
                farcasterUser={farcasterUser as FarcasterUser}
                refetchData={refetchData}
              />
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
            {farcasterUser?.status === "approved" ? (
              <HireFrameForm
                farcasterUser={farcasterUser as FarcasterUser}
                refetchData={refetchData}
              />
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
      <Feed
        loading={loadingFeed}
        feed={feed}
        loadingMore={loadingMore}
        refetchData={refetchData}
      />
    </div>
  )
}
