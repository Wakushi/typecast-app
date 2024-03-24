import { cropString } from "@/lib/utils"
import { formatUnits } from "viem"
import Copy from "./copy"

interface MissionModalProps {
  setIsLoading: (isLoading: boolean) => void
  amountDue: bigint
  completedAt: bigint
  devAddress: string
  devFid: bigint
  recruiterFid: bigint
  hiredAt: bigint
  offerIpfsHash: string
  recruiterAddress: string
  isRecruiter: boolean
}

export default function Mission({
  amountDue,
  completedAt,
  devAddress,
  devFid,
  recruiterFid,
  hiredAt,
  offerIpfsHash,
  recruiterAddress,
  isRecruiter,
}: MissionModalProps) {
  return (
    <div className="p-5 bg-slate-900 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Contract Details
      </h2>
      <div className="flex flex-col justify-center space-y-2">
        <p>
          <strong className="font-medium">
            {isRecruiter ? "Developer FID" : "Recruiter FID"}:
          </strong>{" "}
          <span className="font-light">
            {Number(isRecruiter ? devFid : recruiterFid)}
          </span>
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
          <strong className="font-medium">
            {isRecruiter ? "Developer Address" : "Recruiter Address"}:
          </strong>{" "}
          <span className="flex items-center gap-2 font-light">
            {cropString(isRecruiter ? devAddress : recruiterAddress)}{" "}
            <Copy contentToCopy={isRecruiter ? devAddress : recruiterAddress} />
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
