"use client"
import { useFarcaster } from "@/services/user-context"
import { fallbackFrameContext, FrameUI } from "frames.js/render"
import { signFrameAction, FarcasterSigner } from "frames.js/render/farcaster"
import { FrameImageNext } from "frames.js/render/next"
import { useFrame } from "frames.js/render/use-frame"

interface FrameRendererProps {
  frameUrl: string
}

export default function FrameRenderer({ frameUrl }: FrameRendererProps) {
  const { farcasterUser } = useFarcaster()
  const frameState = useFrame({
    homeframeUrl: frameUrl,
    frameActionProxy: "/frames",
    frameGetProxy: "/frames",
    frameContext: fallbackFrameContext,
    signerState: {
      hasSigner: true,
      signer: farcasterUser as FarcasterSigner,
      onSignerlessFramePress: () => {
        alert(
          "A frame button was pressed without a signer. Perhaps you want to prompt a login"
        )
      },
      signFrameAction: signFrameAction,
    },
  })

  return (
    <div className="custom-frame">
      <FrameUI
        frameState={frameState}
        theme={{
          bg: "transparent",
          buttonBg: "#fff",
          buttonBorderColor: "#111",
          buttonHoverBg: "#efefef",
          buttonColor: "#444",
          buttonRadius: "5",
        }}
        FrameImage={FrameImageNext}
      />
    </div>
  )
}
