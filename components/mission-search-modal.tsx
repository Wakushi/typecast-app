import {
  TYPECAST_CONTRACT_ABI,
  TYPECAST_CONTRACT_ADDRESS,
} from "@/lib/contract"
import { useState } from "react"
import { Input } from "./ui/input"
import { Loader2 } from "lucide-react"
import { writeContract } from "@wagmi/core"
import { useConfig } from "wagmi"
import { Checkbox } from "./ui/checkbox"
import Mission from "./mission"
import { createPublicClient, http } from "viem"
import { baseSepolia } from "viem/chains"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "./ui/button"

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.ALCHEMY_URL),
})

export default function MissionModal({
  farcasterUserFid,
}: {
  farcasterUserFid: number
}) {
  const [queriedUserFid, setQueriedUserFid] = useState("")
  const [isRecruiter, setisRecruiter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mission, setMission] = useState<any>(null)
  const config = useConfig()

  async function getMissionByFid(queriedUserFid: string) {
    const args = isRecruiter
      ? [farcasterUserFid, queriedUserFid]
      : [queriedUserFid, farcasterUserFid]
    try {
      const mission = await publicClient.readContract({
        address: TYPECAST_CONTRACT_ADDRESS,
        abi: TYPECAST_CONTRACT_ABI,
        functionName: "getMissionByFid",
        args,
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
        <span className="text-sm font-semibold p-[0.4rem]">Missions</span>
      </DialogTrigger>
      <DialogContent className="p-10">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div>
            <h3 className="text-2xl mb-2 font-bold">Find my missions</h3>
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isRecruiter"
                  checked={isRecruiter}
                  onCheckedChange={() =>
                    setisRecruiter((prevState) => !prevState)
                  }
                ></Checkbox>
                <label htmlFor="isRecruiter" className="font-light opacity-60">
                  I'm the recruiter
                </label>
              </div>
              <Button onClick={onSearch}>Search</Button>
            </div>
            {mission?.recruiterFid && (
              <div className="flex flex-col">
                <Mission
                  {...mission}
                  setIsLoading={setIsLoading}
                  isRecruiter={isRecruiter}
                />
                <div className="flex items-center justify-center gap-2 w-full my-4">
                  {isRecruiter ? (
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={onComplete}>
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
