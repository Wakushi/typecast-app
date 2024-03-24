import Linkify from "linkify-react"
import {
  ReplyIcon,
  RecastIcon,
  LikeIcon,
  BookmarkIcon,
  WarpcastIcon,
} from "./icons"
import { CastImages } from "./cast-images"
import { CastVideos } from "./cast-video"
import { CastData } from "@/lib/types/cast"
import FrameRenderer from "../frame-renderer"
import "../../styles/farcaster-embed.styles.css"

const linkifyOptions = {
  className: "farcaster-embed-body-link",
  target: "_blank",
}

const timestampOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
} as Intl.DateTimeFormatOptions

function stripLastEmbedUrlFromCastBody(source: string, target: string) {
  // Check if the target string is at the end of the source string
  if (source.endsWith(target)) {
    // Calculate the start position of the target string
    let startIndex = source.lastIndexOf(target)
    // Replace the target string with an empty space
    let sourceWithoutTarget = source.substring(0, startIndex)
    // Trim the last newline
    let lastNewLineIndex = sourceWithoutTarget.lastIndexOf("\n")
    if (lastNewLineIndex !== -1) {
      sourceWithoutTarget =
        sourceWithoutTarget.substring(0, lastNewLineIndex) +
        sourceWithoutTarget.substring(lastNewLineIndex + 1)
    }
    return sourceWithoutTarget + source.substring(startIndex + target.length)
  } else {
    // Return the original source string if the target is not at the end
    return source
  }
}

export function CastEmbed({
  cast,
  client,
}: {
  cast: CastData
  client?: boolean
}) {
  const author = cast?.author
  const profileUrl = `https://warpcast.com/~/profiles/${author?.fid}`
  const publishedAt = new Date(cast?.timestamp ?? 0)
  const timestamp = publishedAt.toLocaleString("en-US", timestampOptions)
  const warpcastUrl = `https://warpcast.com/${author?.username}/${cast?.hash}`
  const replies = cast?.replies && cast?.replies.count
  const likes = cast?.reactions && cast?.reactions.count
  const recasts = cast?.combinedRecastCount
    ? cast?.combinedRecastCount
    : cast?.recasts?.count
  const watches = cast?.watches && cast?.watches.count

  return (
    <div className="border border-slate-800 p-6 w-full min-w-[333px] md:w-[600px] rounded stretch">
      <div className="flex items-center gap-4 mb-2">
        {author?.pfp?.url && (
          <a
            href={profileUrl}
            className="min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-[50%] overflow-hidden"
          >
            <img
              src={author?.pfp?.url}
              alt={`@${author?.username}`}
              width={0}
              height={0}
              className="w-full h-full object-cover"
            />
          </a>
        )}
        <div className="farcaster-embed-author">
          <p className="farcaster-embed-author-display-name">
            {author?.displayName}
          </p>
          <p className="farcaster-embed-author-username">@{author?.username}</p>
        </div>
      </div>
      <div className="opacity-50 text-sm">
        <p>{timestamp}</p>
      </div>
      <CastEmbedBody cast={cast} />
      {cast?.tags?.length && cast?.tags?.length > 0 && (
        <div>
          <div className="farcaster-embed-channel">
            {cast?.tags[0].imageUrl && (
              <img
                src={cast?.tags[0].imageUrl}
                alt={cast?.tags[0].name}
                width={16}
                height={16}
                className="farcaster-embed-channel-avatar"
              />
            )}
            {cast?.tags[0].name && (
              <p className="farcaster-embed-channel-name">
                {cast?.tags[0].name}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="farcaster-embed-stats">
        <ul>
          <li>
            <a
              className="farcaster-embed-stats-link"
              href={warpcastUrl}
              target="_blank"
            >
              <ReplyIcon />
              <span>{replies?.toLocaleString("en-US")}</span>
            </a>
          </li>
          <li>
            <a
              className="farcaster-embed-stats-link"
              href={warpcastUrl}
              target="_blank"
            >
              <RecastIcon />
              <span>{recasts?.toLocaleString("en-US")}</span>
            </a>
          </li>
          <li>
            <a
              className="farcaster-embed-stats-link"
              href={warpcastUrl}
              target="_blank"
            >
              <LikeIcon />
              <span>{likes?.toLocaleString("en-US")}</span>
            </a>
          </li>
          <li>
            <a
              className="farcaster-embed-stats-link"
              href={warpcastUrl}
              target="_blank"
            >
              <BookmarkIcon />
              <span>{watches?.toLocaleString("en-US")}</span>
            </a>
          </li>
        </ul>
        <div className="farcaster-embed-warpcast-icon">
          <a
            href={warpcastUrl}
            title="Show on Warpcast"
            target="_blank"
            className="farcaster-embed-warpcast-link"
          >
            <WarpcastIcon />
          </a>
        </div>
      </div>
    </div>
  )
}

function CastEmbedBody({ cast, client }: { cast: CastData; client?: boolean }) {
  const urls = cast?.embeds && cast?.embeds.urls
  const lastUrl = (urls && urls[urls.length - 1]?.openGraph?.url) || ""

  if (
    cast?.embeds &&
    cast?.embeds?.urls &&
    cast?.embeds?.urls?.length > 0 &&
    cast?.embeds?.urls[0]?.openGraph?.url &&
    cast?.embeds?.urls[0]?.openGraph?.frame
  ) {
    return (
      <div>
        <Linkify as="p" options={linkifyOptions}>
          {stripLastEmbedUrlFromCastBody(cast?.text ?? "", lastUrl)}
        </Linkify>
        <FrameRenderer frameUrl={cast?.embeds?.urls[0]?.openGraph?.url} />
      </div>
    )
  } else {
    const images = cast?.embeds && cast?.embeds.images
    const hasImages = images && images.length > 0
    const hasVideos =
      cast?.embeds && cast?.embeds.videos && cast?.embeds.videos.length > 0
    const videos = cast?.embeds && cast?.embeds.videos
    const hasUrls =
      cast?.embeds && cast?.embeds.urls && cast?.embeds.urls.length > 0
    const hasCastEmbeds = cast?.embeds && cast?.embeds.casts
    const quoteCasts = cast?.embeds && cast?.embeds.casts

    return (
      <div className="farcaster-embed-body">
        <Linkify as="p" options={linkifyOptions}>
          {stripLastEmbedUrlFromCastBody(cast?.text ?? "", lastUrl)}
        </Linkify>
        {hasImages && <CastImages images={images} />}
        {hasVideos && videos && client && (
          <CastVideos videos={videos} client={client} />
        )}
        {hasUrls && (
          <div className="farcaster-embed-urls-container">
            {urls?.map((item, index) => {
              const { description, domain, image, title, url, useLargeImage } =
                item.openGraph || {}
              const isTwitter =
                domain === "twitter.com" ||
                domain === "t.co" ||
                domain === "x.com"

              if (domain === "warpcast.com") return null

              if (useLargeImage) {
                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    className="farcaster-embed-url-link"
                  >
                    {image && (
                      <img
                        src={image}
                        alt={title}
                        className="farcaster-embed-url-image"
                      />
                    )}
                    <span className="farcaster-embed-url-metadata">
                      <span className="farcaster-embed-url-title">{title}</span>
                      {description && (
                        <span className="farcaster-embed-url-description">
                          {description}
                        </span>
                      )}
                      {domain && (
                        <span className="farcaster-embed-url-domain">
                          {domain}
                        </span>
                      )}
                    </span>
                  </a>
                )
              }

              return (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  className="farcaster-embed-url-link farcaster-embed-url-link-compact"
                >
                  {image && !isTwitter && (
                    <img
                      src={image}
                      alt={title}
                      className="farcaster-embed-url-image"
                    />
                  )}
                  <span className="farcaster-embed-url-metadata">
                    <span className="farcaster-embed-url-title">{title}</span>
                    {description && (
                      <span className="farcaster-embed-url-description">
                        {description}
                      </span>
                    )}
                    {domain && (
                      <span className="farcaster-embed-url-domain">
                        {domain}
                      </span>
                    )}
                  </span>
                </a>
              )
            })}
          </div>
        )}
        {hasCastEmbeds && (
          <div className="farcaster-embed-quote-cast-container">
            {quoteCasts?.map((quoteCast: CastData) => {
              const qcPublishedAt = new Date(quoteCast?.timestamp ?? 0)
              const qcTimestamp = qcPublishedAt.toLocaleString(
                "en-US",
                timestampOptions
              )
              const qcHasImages =
                quoteCast.embeds &&
                quoteCast.embeds.images &&
                quoteCast.embeds.images.length > 0
              const qcImages = quoteCast.embeds && quoteCast.embeds.images
              const qcHasVideos =
                quoteCast.embeds &&
                quoteCast.embeds.videos &&
                quoteCast.embeds.videos.length > 0
              const qcVideos = quoteCast.embeds && quoteCast.embeds.videos

              return (
                <div
                  key={quoteCast.hash}
                  className="farcaster-embed-quote-cast"
                >
                  <div className="farcaster-embed-metadata">
                    <div className="min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] rounded-[50%] overflow-hidden">
                      <img
                        src={quoteCast?.author?.pfp?.url}
                        alt={`@${quoteCast.author?.username}`}
                        width={0}
                        height={0}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="farcaster-embed-author">
                      <p className="farcaster-embed-author-display-name">
                        {quoteCast.author?.displayName}
                      </p>
                      <p className="farcaster-embed-author-username">
                        @{quoteCast.author?.username}
                      </p>
                    </div>
                    <div className="farcaster-embed-timestamp">
                      <p>{qcTimestamp}</p>
                    </div>
                  </div>
                  <div className="farcaster-embed-body">
                    <Linkify as="p" options={linkifyOptions}>
                      {quoteCast.text}
                    </Linkify>
                    {qcHasImages && qcImages && (
                      <CastImages images={qcImages} />
                    )}
                    {qcHasVideos && qcVideos && (
                      <CastVideos videos={qcVideos} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}
