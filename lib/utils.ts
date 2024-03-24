import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DEV_CHANNEL =
  "chain://eip155:1/erc721:0x7dd4e31f1530ac682c8ea4d8016e95773e08d8b0"

export function cropString(
  str: string,
  startLength = 10,
  endLength = 10,
  delimiter = "..."
) {
  if (str.length <= startLength + endLength + delimiter.length) {
    return str
  }

  return (
    str.substring(0, startLength) +
    delimiter +
    str.substring(str.length - endLength)
  )
}
