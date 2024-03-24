"use client"
import { FaRegUser } from "react-icons/fa"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { tilt_neon } from "@/public/fonts"
import { LoginWindow } from "./login-window"
import { useEffect, useState } from "react"
import { getUserData } from "@/lib/actions"
import { useFarcaster } from "@/services/user-context"
import { GiTBrick } from "react-icons/gi"
import { FaCircleInfo } from "react-icons/fa6"
import {
  TYPECAST_CONTRACT_ABI,
  TYPECAST_CONTRACT_ADDRESS,
} from "@/lib/contract"
import { createClient, createPublicClient, formatUnits, http } from "viem"
import { baseSepolia } from "viem/chains"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "./ui/input"
import { Loader2 } from "lucide-react"
import { cropString } from "@/lib/utils"
import Copy from "./copy"
import { writeContract } from "@wagmi/core"
import { useConfig } from "wagmi"

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.ALCHEMY_URL),
})

export default function Header() {
  const { farcasterUser, loading, startFarcasterSignerProcess, logout } =
    useFarcaster()
  const [detailedUser, setDetailedUser] = useState<any>({})

  useEffect(() => {
    async function getUser(fid: any): Promise<any> {
      return await getUserData(fid)
    }
    if (farcasterUser?.fid) {
      getUser(farcasterUser.fid).then((user) => {
        setDetailedUser(user)
      })
    }
  }, [farcasterUser])

  return (
    <header className="flex items-center border border-b bg-white bg-opacity-[0.02] shadow-xl backdrop-blur-sm p-4 md:px-6 justify-between w-full fixed top-0 z-10">
      <div
        className={`${tilt_neon.className} text-2xl flex items-center gap-2`}
      >
        <GiTBrick className="text-[2rem]" />
        <span>typecast</span>
      </div>
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger>
            <FaCircleInfo className="text-2xl opacity-60" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[375px]">
            <div>About</div>
          </DialogContent>
        </Dialog>
        {farcasterUser?.fid && detailedUser.username ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-[50%] overflow-hidden">
              <img
                src={detailedUser.pfp_url}
                alt={`@${detailedUser?.username}'s profile picture`}
                width={48}
                height={48}
                className="min-w-[48px] min-h-[48px] object-cover"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {" "}
                <a
                  href={`https://warpcast.com/${detailedUser.username}`}
                  target="_blank"
                >
                  My Account
                </a>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <MissionModal farcasterUserFid={detailedUser?.fid} />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FaRegUser />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-w-[375px]">
              <LoginWindow
                farcasterUser={farcasterUser}
                loading={loading}
                startFarcasterSignerProcess={startFarcasterSignerProcess}
                logout={logout}
              ></LoginWindow>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  )
}

function MissionModal({ farcasterUserFid }: { farcasterUserFid: number }) {
  const [queriedUserFid, setQueriedUserFid] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mission, setMission] = useState<any>(null)
  const config = useConfig()

  async function getMissionByFid(queriedUserFid: string) {
    try {
      const mission = await publicClient.readContract({
        address: TYPECAST_CONTRACT_ADDRESS,
        abi: TYPECAST_CONTRACT_ABI,
        functionName: "getMissionByFid",
        args: [farcasterUserFid, queriedUserFid],
      })
      return mission
    } catch (error) {
      console.log(error)
      return error
    }
  }

  const handleInputChange = (event: any) => {
    setQueriedUserFid(event.target.value)
  }

  function onSearch() {
    setIsLoading(true)
    getMissionByFid(queriedUserFid).then((mission) => {
      setIsLoading(false)
      if (mission) {
        setMission(mission)
      } else {
        setMission(null)
      }
    })
  }

  async function onComplete() {
    setIsLoading(true)
    try {
      await writeContract(config, {
        abi: TYPECAST_CONTRACT_ABI,
        address: TYPECAST_CONTRACT_ADDRESS,
        functionName: "completeMission",
        args: [mission.recruiterAddress],
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onCancel() {
    setIsLoading(true)
    try {
      await writeContract(config, {
        abi: TYPECAST_CONTRACT_ABI,
        address: TYPECAST_CONTRACT_ADDRESS,
        functionName: "cancelMission",
        args: [mission.devAddress],
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <span className="text-sm font-semibold px-2 py-4">Missions</span>
      </DialogTrigger>
      <DialogContent className="p-10">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div>
            <h3 className="text-xl mb-2">Find open missions</h3>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-light opacity-60" htmlFor="devUsername">
                User FID
              </label>
              <Input
                type="text"
                id="queriedUserFid"
                value={queriedUserFid}
                onChange={handleInputChange}
              />
              <Button onClick={onSearch}>Search</Button>
            </div>
            {mission?.recruiterFid && (
              <div className="flex flex-col">
                <Mission {...mission} setIsLoading={setIsLoading} />
                <div className="flex items-center justify-center gap-2 w-full my-4">
                  <Button className="w-full" onClick={onComplete}>
                    Complete
                  </Button>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface MissionModalProps {
  setIsLoading: (isLoading: boolean) => void
  amountDue: bigint
  completedAt: bigint
  devAddress: string
  devFid: bigint
  hiredAt: bigint
  offerIpfsHash: string
  recruiterAddress: string
}

function Mission({
  amountDue,
  completedAt,
  devAddress,
  devFid,
  hiredAt,
  offerIpfsHash,
  recruiterAddress,
  setIsLoading,
}: MissionModalProps) {
  return (
    <div className="p-5 bg-slate-900 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Contract Details
      </h2>
      <div className="flex flex-col justify-center space-y-2">
        <p>
          <strong className="font-medium">Developer Fid:</strong>{" "}
          <span className="font-light">{Number(devFid)}</span>
        </p>
        <p>
          <strong className="font-medium">Amount Due:</strong>{" "}
          <span className="font-light">
            {Number(formatUnits(amountDue, 18)).toFixed(4)} ETH
          </span>
        </p>
        <p>
          <strong className="font-medium">Completed At:</strong>{" "}
          <span className="font-light">
            {" "}
            {completedAt.toString() === "0"
              ? "Not yet completed"
              : Number(completedAt)}
          </span>
        </p>
        <p>
          <strong className="font-medium">Developer Address:</strong>{" "}
          <span className="flex items-center gap-2 font-light">
            {cropString(devAddress)} <Copy contentToCopy={devAddress} />
          </span>
        </p>
        <p>
          <strong className="font-medium">Hired At:</strong>{" "}
          <span className="font-light">
            {" "}
            {new Date(Number(hiredAt) * 1000).toLocaleString()}
          </span>
        </p>
        <p>
          <strong className="font-medium">Offer IPFS Hash:</strong>{" "}
          <span className="flex items-center gap-2 font-light">
            {cropString(offerIpfsHash)} <Copy contentToCopy={offerIpfsHash} />
          </span>
        </p>
      </div>
    </div>
  )
}

function About() {
  return (
    <div>
      <h3>About</h3>
      <div>
        <p>
          Typecast is a platform for developers to find work and recruiters to
          find developers. It is built on the Farcaster protocol.
        </p>
        <p>Built during the EthGlobal Farcaster hackathon by @makushi</p>
      </div>
    </div>
  )
}
