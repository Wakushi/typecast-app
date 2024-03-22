"use client"

import React, { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"

export default function Feed({ channel }: any) {
  const [feed, setFeed]: any = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextPageToken, setNextPageToken] = useState("")

  async function fetchData(nextPage: any, initialLoad: boolean) {
    try {
      if (initialLoad) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      const data = JSON.stringify({
        channel: channel,
        nextPage: nextPage,
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
      const feed = await feedData.json()
      console.log("Feed", feed)

      setFeed((prevFeed: any) => [...prevFeed, ...feed])
      setNextPageToken(feed[0].pageToken)
      setLoading(false)
      setLoadingMore(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setLoadingMore(false)
    }
  }

  function refetchData() {
    fetchData(nextPageToken, false)
  }

  useEffect(() => {
    setFeed([])
    fetchData("", true)
  }, [channel])

  return (
    <div className="mt-4 flex min-h-screen flex-col items-center justify-start">
      {loading ? (
        <Loader2 className="h-16 w-16 animate-spin" />
      ) : (
        <div className="flex flex-col items-center justify-start gap-12 mb-6">
          {feed ? (
            feed.map((item: any, index: any) => (
              <div>{item.castAddBody.text}</div>
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
