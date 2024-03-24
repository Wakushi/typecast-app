export default function About() {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-xl">About</h3>
      <div className="flex flex-col gap-2">
        <p>
          Typecast is a platform for developers to find work and recruiters to
          find developers. It is built on the Farcaster protocol.
        </p>
        <p>
          Create a custom post with your skills and requirements, and let
          recruiters find you.
        </p>
        <p>
          As a recruiter, you can pay a first deposit to hire a developer and
          the funds will be locked in a smart contract for a 7-day period during
          which you can cancel but the developer won't be able to run away with
          the funds.
        </p>
        <p>
          This allows you to organize your collaboration and make sure the
          developer is committed to the project.
        </p>

        <p className="text-md opacity-60">
          Built during the EthGlobal Farcaster hackathon by{" "}
          <a
            className="underline"
            href="https://warpcast.com/makushi"
            target="_blank"
          >
            @makushi
          </a>
        </p>
      </div>
    </div>
  )
}
