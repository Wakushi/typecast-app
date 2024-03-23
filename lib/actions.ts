import { JSDOM } from "jsdom"

export async function cronFeed(channel: any, nextPage: any) {
  try {
    const result = await fetch(
      `https://hub.pinata.cloud/v1/castsByParent?url=${channel}&pageSize=20&reverse=true&pageToken=${nextPage}`
    )
    const resultData = await result.json()
    const pageToken = resultData.nextPageToken
    const casts = await Promise.all(
      resultData.messages.map(async (cast: any) => {
        const fname = await getFnameFromFid(cast.data.fid)
        const detailedCast = await getCast(fname, cast.hash)
        return {
          ...detailedCast,
          pageToken: pageToken,
        }
      })
    )
    return casts
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function getFnameFromFid(fid: any): Promise<string> {
  const result = await fetch(
    `https://hub.pinata.cloud/v1/userDataByFid?fid=${fid}&user_data_type=USER_DATA_TYPE_USERNAME`
  )
  const resultData = await result.json()
  const fname = resultData?.data?.userDataBody?.value || fid
  return fname
}

async function hasEmbededFrame(url: string): Promise<boolean> {
  try {
    const response = await fetch(url)
    const text = await response.text()
    const dom = new JSDOM(text)
    const metas = dom.window.document.head.getElementsByTagName("meta")

    for (let i = 0; i < metas.length; i++) {
      const property = metas[i].getAttribute("property")
      if (property === "fc:frame") {
        return true
      }
    }

    return false
  } catch (error) {
    console.error("Error fetching or parsing URL:", error)
    return false
  }
}

export const getCast = async (username: string, hash: string) => {
  try {
    const res = await fetch(
      `https://farcaster.tv/v2/user-thread-casts?castHashPrefix=${hash}&username=${username}&limit=3`
    )
    const cast = await res.json()

    if (
      cast.result.casts[2] &&
      cast.result.casts[2].author.username === username &&
      cast.result.casts[2].hash.includes(hash)
    ) {
      return cast.result.casts[2]
    }

    if (cast.result.casts[0].castType === "root-embed") {
      return cast.result.casts[1]
    }

    return cast.result.casts[0]
  } catch (e) {
    throw new Error("Unable to fetch cast.")
  }
}
