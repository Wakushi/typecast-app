/** @jsxImportSource frog/jsx */

// import { neynar } from 'frog/hubs'
import { devtools } from "frog/dev"
import { handle } from "frog/next"
import { serveStatic } from "frog/serve-static"
import { Button, Frog, TextInput, parseEther } from "frog"
import { createWalletClient, http, createPublicClient } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia } from "viem/chains"
import { PinataFDK } from "pinata-fdk"

const CONTRACT = (process.env.CONTRACT_ADDRESS as `0x`) || ""

// const account = privateKeyToAccount((process.env.PRIVATE_KEY as `0x`) || "")

// const publicClient = createPublicClient({
//   chain: baseSepolia,
//   transport: http(process.env.ALCHEMY_URL),
// })

// const walletClient = createWalletClient({
//   account,
//   chain: baseSepolia,
//   transport: http(process.env.ALCHEMY_URL),
// })

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
})

app.frame("/hire/:ipfsHash", async (c) => {
  const ipfsHash = c.req.param("ipfsHash")
  const hireData = await fetch(
    `https://${process.env.NEXT_PUBLIC_GATEWAY}/ipfs/${ipfsHash}`
  )
  const data = await hireData.json()
  const {
    skills,
    experience,
    githubLink,
    portfolioLink,
    price,
    available,
    fName,
    paymentAddress,
  } = data
  if (!available) {
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
                    src="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/362635561/900"
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
                Sorry, this dev has found a mission :(
              </h2>
            </div>
          </div>
        </div>
      ),
      intents: [
        githubLink ? <Button.Link href={githubLink}>Github</Button.Link> : null,
        portfolioLink ? (
          <Button.Link href={portfolioLink}>Portfolio</Button.Link>
        ) : null,
      ],
      title: "Hire me",
    })
  }
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
                  src="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/362635561/900"
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
      <Button.Transaction target={`/buy/${price}`}>
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

app.transaction("/buy/:price", async (c) => {
  const price = c.req.param("price")

  return c.contract({
    abi: [],
    // @ts-ignore
    chainId: "eip155:84532",
    functionName: "buyHat",
    args: [c.frameData?.fid],
    to: CONTRACT,
    value: parseEther(`${price}`),
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
