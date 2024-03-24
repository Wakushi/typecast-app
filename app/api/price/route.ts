import { NextResponse } from "next/server"

export async function GET(): Promise<any> {
  try {
    const ethPriceResponse = await fetch(
      `https://api.mobula.io/api/1/market/data?asset=ETHEREUM`,
      {
        method: "GET",
        headers: {
          Authorization: process.env.MOBULA_API_KEY ?? "",
        },
      }
    )
    const ethData = await ethPriceResponse.json()
    const ethPrice = ethData.data.price
    return NextResponse.json(ethPrice)
  } catch (error) {
    console.log(error)
    return error
  }
}
