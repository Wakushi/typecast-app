/** @jsxImportSource frog/jsx */

import { devtools } from "frog/dev"
import { handle } from "frog/next"
import { serveStatic } from "frog/serve-static"
import { Button, Frog, TextInput, parseEther } from "frog"
import { TYPECAST_CONTRACT_ABI } from "@/lib/contract"
import {
  getEthPriceInUSD,
  getUserHiringInfo,
  unpinUserHiringInfo,
} from "@/lib/actions"

const CONTRACT = (process.env.CONTRACT_ADDRESS as `0x`) || ""

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
})

app.frame("/hire/:ipfsHash", async (c) => {
  const ipfsHash = c.req.param("ipfsHash")
  const data = await getUserHiringInfo(ipfsHash)
  if (!data) {
    return c.res({
      action: "/finish",
      image: (
        <div
          style={{
            color: "white",
            display: "flex",
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            padding: "20px",
            fontSize: "18px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            position: "relative",
          }}
        >
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 900 600"
          >
            <defs>
              <filter id="blur1" x="-10%" y="-10%" width="120%" height="120%">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="161"
                  result="effect1_foregroundBlur"
                />
              </filter>
            </defs>
            <rect width="900" height="600" fill="#6600FF" />
            <g filter="url(#blur1)">
              <circle cx="734" cy="297" fill="#00CC99" r="357" />
              <circle cx="714" cy="572" fill="#6600FF" r="357" />
              <circle cx="186" cy="104" fill="#00CC99" r="357" />
              <circle cx="98" cy="443" fill="#00CC99" r="357" />
              <circle cx="477" cy="265" fill="#6600FF" r="357" />
              <circle cx="867" cy="460" fill="#00CC99" r="357" />
            </g>
          </svg>
          <div
            style={{
              display: "flex",
              position: "absolute",
              flexDirection: "column",
              width: "100%",
              maxWidth: "900px",
              height: "100%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgb(255, 255, 255, 0.1)",
              padding: "0 4rem",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                display: "flex",
                fontSize: "1.5rem",
              }}
            >
              <p>@typecast-app</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "1rem",
                  marginRight: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={
                      "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/disappointed-face.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>
              <h2
                style={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  lineHeight: "1",
                  alignSelf: "baseline",
                }}
              >
                Sorry, this dev has found a mission :(
              </h2>
            </div>
          </div>
        </div>
      ),
      intents: [
        <Button.Link href="https://typecast-app.vercel.app/">
          See more on TypeCast
        </Button.Link>,
      ],
      title: "Hire me",
    })
  }
  const {
    skills,
    experience,
    githubLink,
    portfolioLink,
    price,
    fName,
    userPfp,
    fid,
    paymentAddress,
  } = data
  return c.res({
    action: "/finish",
    image: (
      <div
        style={{
          color: "white",
          display: "flex",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          padding: "20px",
          fontSize: "18px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          position: "relative",
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1000 700"
        >
          <defs>
            <filter id="blur1" x="-10%" y="-10%" width="120%" height="120%">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="161"
                result="effect1_foregroundBlur"
              />
            </filter>
          </defs>
          <rect width="1000" height="700" fill="#6600FF" />
          <g filter="url(#blur1)">
            <circle cx="734" cy="297" fill="#00CC99" r="357" />
            <circle cx="714" cy="572" fill="#6600FF" r="357" />
            <circle cx="186" cy="104" fill="#00CC99" r="357" />
            <circle cx="98" cy="443" fill="#00CC99" r="357" />
            <circle cx="477" cy="265" fill="#6600FF" r="357" />
            <circle cx="867" cy="460" fill="#00CC99" r="357" />
          </g>
        </svg>
        <div
          style={{
            display: "flex",
            position: "absolute",
            flexDirection: "column",
            width: "100%",
            maxWidth: "900px",
            height: "100%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgb(255, 255, 255, 0.1)",
            padding: "0 4rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              display: "flex",
              fontSize: "1.5rem",
            }}
          >
            <p>@typecast-app</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={
                    userPfp ||
                    "https://logowik.com/content/uploads/images/ethereum-eth-icon9411.logowik.com.webp"
                  }
                  alt="profile"
                />
              </div>
              <h3>{fName}</h3>
            </div>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                lineHeight: "1",
                alignSelf: "baseline",
              }}
            >
              Available for hire
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifySelf: "end",
              border: "1px solid rgb(255, 255, 255, 0.3)",
              padding: "2rem",
              marginLeft: "auto",
            }}
          >
            <p
              style={{
                fontSize: "2rem",
              }}
            >
              <strong
                style={{
                  fontWeight: "bold",
                  marginRight: "1rem",
                }}
              >
                Skills:
              </strong>{" "}
              {skills}
            </p>
            <p
              style={{
                fontSize: "2rem",
              }}
            >
              <strong
                style={{
                  fontWeight: "bold",
                  marginRight: "1rem",
                }}
              >
                Experience:{" "}
              </strong>{" "}
              {experience}
            </p>
            <p
              style={{
                fontSize: "2rem",
              }}
            >
              <strong
                style={{
                  fontWeight: "bold",
                  marginRight: "1rem",
                }}
              >
                Daily Rate:{" "}
              </strong>{" "}
              ${price}/day
            </p>
          </div>
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Hire for (number) days" />,
      <Button.Transaction target={`/buy/${price}/${paymentAddress}/${fid}`}>
        Hire for {price}$/day
      </Button.Transaction>,
      githubLink ? <Button.Link href={githubLink}>Github</Button.Link> : null,
      portfolioLink ? (
        <Button.Link href={portfolioLink}>Portfolio</Button.Link>
      ) : null,
    ],
    title: "Hire me",
  })
})

app.frame("/finish", (c) => {
  const { frameData } = c
  if (frameData) {
    const { url } = frameData
    const ipfsHash = url.split("/").pop()
    if (ipfsHash) {
      unpinUserHiringInfo(ipfsHash)
    }
  }
  return c.res({
    image: (
      <div
        style={{
          color: "white",
          display: "flex",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          padding: "20px",
          fontSize: "18px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          position: "relative",
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 900 600"
        >
          <defs>
            <filter id="blur1" x="-10%" y="-10%" width="120%" height="120%">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="161"
                result="effect1_foregroundBlur"
              />
            </filter>
          </defs>
          <rect width="900" height="600" fill="#6600FF" />
          <g filter="url(#blur1)">
            <circle cx="734" cy="297" fill="#00CC99" r="357" />
            <circle cx="714" cy="572" fill="#6600FF" r="357" />
            <circle cx="186" cy="104" fill="#00CC99" r="357" />
            <circle cx="98" cy="443" fill="#00CC99" r="357" />
            <circle cx="477" cy="265" fill="#6600FF" r="357" />
            <circle cx="867" cy="460" fill="#00CC99" r="357" />
          </g>
        </svg>
        <div
          style={{
            display: "flex",
            position: "absolute",
            flexDirection: "column",
            width: "100%",
            maxWidth: "900px",
            height: "100%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgb(255, 255, 255, 0.1)",
            padding: "0 4rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              display: "flex",
              fontSize: "1.5rem",
            }}
          >
            <p>@typecast-app</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                lineHeight: "1",
                alignSelf: "baseline",
              }}
            >
              Mission created, thanks for hiring with TypeCast!
            </h2>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button.Link href="https://typecast-app.vercel.app/">
        See more on TypeCast
      </Button.Link>,
    ],
    title: "Success!",
  })
})

app.transaction("/buy/:dailyPrice/:paymentAddress/:fid", async (c) => {
  const { inputText } = c

  const dailyPrice = c.req.param("dailyPrice")
  const totalPriceInUsd = +dailyPrice * Number(inputText ?? 1)

  const ethPriceInUsd = await getEthPriceInUSD()
  const totalPriceInEth = totalPriceInUsd / ethPriceInUsd

  const devAddress = c.req.param("paymentAddress")
  const devFid = c.req.param("fid")
  const recruiterFid = c.frameData?.fid

  return c.contract({
    abi: TYPECAST_CONTRACT_ABI,
    // @ts-ignore
    chainId: "eip155:84532",
    functionName: "hire",
    args: [devAddress, devFid, recruiterFid],
    to: CONTRACT,
    value: parseEther(`${totalPriceInEth}`),
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
