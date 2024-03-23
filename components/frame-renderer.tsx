"use client"
import { fallbackFrameContext, FrameUI } from "frames.js/render"
import { signFrameAction, FarcasterSigner } from "frames.js/render/farcaster"
import { FrameImageNext } from "frames.js/render/next"
import { useFrame } from "frames.js/render/use-frame"

interface FrameRendererProps {
  frameUrl: string
  farcasterSigner?: FarcasterSigner
}

export default function FrameRenderer({
  frameUrl,
  farcasterSigner,
}: FrameRendererProps) {
  const frameState = useFrame({
    homeframeUrl: frameUrl,
    frameActionProxy: "/frames",
    frameGetProxy: "/frames",
    frameContext: fallbackFrameContext,
    signerState: {
      hasSigner: true,
      signer: farcasterSigner,
      onSignerlessFramePress: () => {
        // Implement me
        alert(
          "A frame button was pressed without a signer. Perhaps you want to prompt a login"
        )
      },
      signFrameAction: signFrameAction,
    },
  })

  return (
    <div className="w-[400px]">
      <FrameUI
        frameState={frameState}
        theme={{
          bg: "purple",
          buttonBg: "#fff",
          buttonBorderColor: "#ccc",
          buttonHoverBg: "#efefef",
          buttonColor: "#444",
          buttonRadius: "4",
        }}
        FrameImage={FrameImageNext}
      />
    </div>
  )
}
