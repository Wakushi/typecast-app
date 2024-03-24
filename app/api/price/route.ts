import { createPublicClient, formatUnits, http } from "viem"
import { baseSepolia } from "viem/chains"
import { TYPECAST_CONTRACT_ABI } from "@/lib/contract"
import { NextResponse } from "next/server"

const CONTRACT = (process.env.CONTRACT_ADDRESS as `0x`) || ""

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.ALCHEMY_URL),
})

export async function GET(): Promise<any> {
  try {
    const priceInUSD = await publicClient.readContract({
      address: CONTRACT,
      abi: TYPECAST_CONTRACT_ABI,
      functionName: "getEthPrice",
    })
    const readablePrice = formatUnits(priceInUSD as bigint, 18)
    return NextResponse.json(readablePrice)
  } catch (error) {
    console.log(error)
    return error
  }
}
