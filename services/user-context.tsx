"use client"
import { FarcasterUser } from "@/lib/types/farcaster-user"
import { useFarcasterIdentity } from "@/lib/use-farcaster-identity"
import { useContext, ReactNode, createContext, use } from "react"

interface FarcasterContextType {
  farcasterUser: FarcasterUser | null
  loading: boolean
  startFarcasterSignerProcess: () => void
  logout: () => void
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(
  undefined
)

export const FarcasterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { farcasterUser, loading, startFarcasterSignerProcess, logout } =
    useFarcasterIdentity()

  return (
    <FarcasterContext.Provider
      value={{ farcasterUser, loading, startFarcasterSignerProcess, logout }}
    >
      {children}
    </FarcasterContext.Provider>
  )
}

export const useFarcaster = (): FarcasterContextType => {
  const context = useContext(FarcasterContext)
  if (context === undefined) {
    throw new Error("useFarcaster must be used within a FarcasterProvider")
  }
  return context
}
