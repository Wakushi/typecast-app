"use client"
import { useFarcaster } from "@/services/user-context"
import { signFrameAction, FarcasterSigner } from "frames.js/render/farcaster"
import { sendTransaction, switchChain } from "@wagmi/core"
import {
  FrameUI,
  OnTransactionFunc,
  fallbackFrameContext,
} from "frames.js/render"
import { FrameImageNext } from "frames.js/render/next"
import { useFrame } from "frames.js/render/use-frame"
import { useCallback } from "react"
import { useChainId, useConfig, useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"

interface FrameRendererProps {
  frameUrl: string
}

export default function FrameRenderer({ frameUrl }: FrameRendererProps) {
  const { farcasterUser } = useFarcaster()
  const currentChainId = useChainId()
  const config = useConfig()
  const account = useAccount()
  const { openConnectModal } = useConnectModal()

  const onTransaction: OnTransactionFunc = useCallback(
    async ({ transactionData }) => {
      const { params, chainId, method } = transactionData
      if (!chainId.startsWith("eip155:")) {
        alert(`debugger: Unrecognized chainId ${chainId}`)
        return null
      }

      if (!account.address) {
        openConnectModal?.()
        return null
      }

      const requestedChainId = parseInt(chainId.split("eip155:")[1]!)

      if (currentChainId !== requestedChainId) {
        console.log("switching chain")
        await switchChain(config, {
          chainId: requestedChainId,
        })
      }

      try {
        console.log("sending tx")
        const transactionId = await sendTransaction(config, {
          to: params.to,
          data: params.data,
          value: BigInt(params.value),
        })
        return transactionId
      } catch (error) {
        console.error(error)
        return null
      }
    },
    [account.address, currentChainId, config, openConnectModal]
  )

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
    onTransaction,
  })

  return (
    <div className="custom-frame">
      <FrameUI
        frameState={frameState}
        theme={{
          bg: "transparent",
          buttonBg: "#4c3a4ec0",
          buttonBorderColor: "transparent",
          buttonHoverBg: "#efefef",
          buttonColor: "#FFF",
          buttonRadius: "5",
        }}
        FrameImage={FrameImageNext}
      />
    </div>
  )
}
