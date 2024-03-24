"use client"

import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { CastData } from "@/lib/types/cast"
import { CastEmbed } from "./cast-embed/cast-embed"

interface FeedProps {
  loading: boolean
  feed: CastData[]
  loadingMore: boolean
  refetchData: () => void
}

export default function Feed({
  loading,
  feed,
  loadingMore,
  refetchData,
}: FeedProps) {
  return (
    <div className="mt-4 flex min-h-screen flex-col items-center justify-start">
      {loading ? (
        <Loader2 className="h-16 w-16 animate-spin" />
      ) : (
        <div className="flex flex-col items-center justify-start gap-8 mb-6">
          {feed ? (
            feed.map((cast: CastData, index: any) => (
              <div key={cast.hash + index} className="w-full">
                <CastEmbed cast={cast} />
              </div>
            ))
          ) : (
            <h1>Failed to fetch Posts</h1>
          )}
          {loadingMore ? (
            <Button disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button variant="secondary" onClick={refetchData}>
              More
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
