import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<any> {
  const id = params.id
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
  }
  const result = await fetch(
    `https://api.pinata.cloud/v3/farcaster/users/${id}`,
    options
  )
  const resultData = await result.json()
  const userData = resultData.data
  return NextResponse.json(userData)
}
