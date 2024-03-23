import { FaRegUser } from "react-icons/fa"
import { Button } from "./ui/button"
import { tilt_neon } from "@/styles/fonts"

export default function Header() {
  return (
    <header className="flex items-center border border-b bg-white bg-opacity-[0.02] shadow-xl backdrop-blur-sm p-4 justify-between w-full fixed top-0 z-10">
      <div className={`${tilt_neon.className} text-2xl`}>typecast</div>
      <Button>
        <FaRegUser />
      </Button>
    </header>
  )
}
