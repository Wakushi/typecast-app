"use client"

import { useEffect, useState } from "react"
import { convertKeypairToHex, createKeypair } from "./crypto"
import { FarcasterUser } from "./types/farcaster-user"
export const LOCAL_STORAGE_KEYS = {
  FARCASTER_USER: "farcasterUser",
}

interface SignedKeyRequest {
  deeplinkUrl: string
  isSponsored: boolean
  key: string
  requestFid: number
  state: string
  token: string
  userFid: number
  signerUser?: object
  signerUserMetadata?: object
}

export function useFarcasterIdentity() {
  const [loading, setLoading] = useState(false)
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(
    getSignerFromLocalStorage()
  )

  function getSignerFromLocalStorage() {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.FARCASTER_USER)
      if (storedData) {
        const user: FarcasterUser = JSON.parse(storedData)

        if (user.status === "pending_approval") {
          if (user.deadline < Math.floor(Date.now() / 1000)) {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.FARCASTER_USER)
            return null
          }
        }

        return user
      }
      return null
    }

    return null
  }

  useEffect(() => {
    const signer = getSignerFromLocalStorage()
    if (signer) setFarcasterUser(signer)
  }, [])

  function logout() {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FARCASTER_USER, "")
    setFarcasterUser(null)
  }

  useEffect(() => {
    if (farcasterUser && farcasterUser.status === "pending_approval") {
      let intervalId: any

      const startPolling = () => {
        intervalId = setInterval(async () => {
          try {
            const fcSignerRequestResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/warpcast/signer-request`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ farcasterUser }),
              }
            )
            const responseBody = (await fcSignerRequestResponse.json()) as {
              result: { signedKeyRequest: SignedKeyRequest }
            }
            if (responseBody.result.signedKeyRequest.state !== "completed") {
              throw new Error("hasnt succeeded yet")
            }

            const user = {
              ...farcasterUser,
              ...responseBody.result,
              fid: responseBody.result.signedKeyRequest.userFid,
              status: "approved" as const,
            }
            localStorage.setItem(
              LOCAL_STORAGE_KEYS.FARCASTER_USER,
              JSON.stringify(user)
            )

            setFarcasterUser(user)
            clearInterval(intervalId)
          } catch (error) {
            console.info(error)
          }
        }, 2000)
      }

      const stopPolling = () => {
        clearInterval(intervalId)
      }

      const handleVisibilityChange = () => {
        if (document.hidden) {
          stopPolling()
        } else {
          startPolling()
        }
      }

      document.addEventListener("visibilitychange", handleVisibilityChange)

      startPolling()

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
        clearInterval(intervalId)
      }
    }
  }, [farcasterUser])

  async function startFarcasterSignerProcess() {
    setLoading(true)
    await createAndStoreSigner()
    setLoading(false)
  }

  async function createAndStoreSigner() {
    try {
      const keypair = await createKeypair()
      const keypairString = convertKeypairToHex(keypair)
      const authorizationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/signer`,
        {
          method: "POST",
          body: JSON.stringify({
            publicKey: keypairString.publicKey,
          }),
        }
      )
      const authorizationBody: {
        signature: string
        requestFid: string
        deadline: number
        requestSigner: string
      } = await authorizationResponse.json()
      const { signature, requestFid, deadline } = authorizationBody
      if (authorizationResponse.status === 200) {
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/warpcast/signed-key-request`
        const payload = JSON.stringify({
          key: keypairString.publicKey,
          signature,
          requestFid,
          deadline,
        })
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        }
        const fetchResponse = await fetch(url, requestOptions)
        const jsonResponse = await fetchResponse.json()
        const {
          result: { signedKeyRequest },
        } = jsonResponse as {
          result: { signedKeyRequest: { token: string; deeplinkUrl: string } }
        }

        const user: FarcasterUser = {
          ...authorizationBody,
          publicKey: keypairString.publicKey,
          deadline: deadline,
          token: signedKeyRequest.token,
          signerApprovalUrl: signedKeyRequest.deeplinkUrl,
          privateKey: keypairString.privateKey,
          status: "pending_approval",
        }
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.FARCASTER_USER,
          JSON.stringify(user)
        )
        setFarcasterUser(user)
      }
    } catch (error) {
      console.error("API Call failed", error)
    }
  }

  return {
    farcasterUser,
    loading,
    startFarcasterSignerProcess,
    logout,
  }
}
