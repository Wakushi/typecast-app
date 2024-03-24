import { useToast } from "@/components/ui/use-toast"
import { FaCopy } from "react-icons/fa"

interface CopyProps {
  contentToCopy: string
}

export default function Copy({ contentToCopy }: CopyProps) {
  const { toast } = useToast()

  function copyToClipboard(e: any) {
    e.stopPropagation()
    navigator.clipboard.writeText(contentToCopy)
    toast({
      title: "Copied to clipboard",
    })
  }

  return (
    <FaCopy
      className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out"
      onClick={(e) => copyToClipboard(e)}
    />
  )
}
