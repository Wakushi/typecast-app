import { NextRequest, NextResponse } from "next/server"

const pinataSDK = require("@pinata/sdk")
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json()
    body.available = true
    const options = {
      pinataMetadata: {
        name: "typecast",
      },
      pinataOptions: {
        cidVersion: 0,
      },
    }
    const { IpfsHash } = await pinata.pinJSONToIPFS(body, options)
    return NextResponse.json({ success: IpfsHash })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "An error occured" })
  }
}
