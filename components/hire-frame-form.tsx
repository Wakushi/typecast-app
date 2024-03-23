"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { FarcasterUser } from "@/lib/types/farcaster-user"
import { getFnameFromFid } from "@/lib/actions"
import { Loader2 } from "lucide-react"

const hireMeFormSchema = z.object({
  skills: z.string().min(1, "Skills are required"),
  experience: z.string().min(1, "Experience description is required"),
  githubLink: z.string().url("Must be a valid URL").optional(),
  cast: z.string().min(1, "A brief cast is required"),
  paymentAddress: z.string().min(1, "Payment address is required"),
  portfolioLink: z.string().url("Must be a valid URL").optional(),
  price: z.string().min(0, { message: "Invalid amount." }),
})

type HireMeFormData = z.infer<typeof hireMeFormSchema>

export default function HireFrameForm({
  farcasterUser,
}: {
  farcasterUser: FarcasterUser
}) {
  const [loading, setLoading] = useState(false)
  const [castComplete, setCastComplete] = useState(false)
  const [castCompleteMessage, setCastCompleteMessage] = useState("")

  const form = useForm<HireMeFormData>({
    resolver: zodResolver(hireMeFormSchema),
    defaultValues: {
      skills: "",
      experience: "",
      cast: "",
      paymentAddress: "0x",
      price: "0",
    },
  })

  async function onSubmit(values: z.infer<typeof hireMeFormSchema>) {
    try {
      setCastCompleteMessage("")
      setLoading(true)
      const { skills, experience, githubLink, cast, paymentAddress, price } =
        values
      const fName = farcasterUser.fid
        ? await getFnameFromFid(farcasterUser.fid)
        : ""
      // 1. Post JSON data to PINATA and get IPFS hash
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/pinata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills,
            experience,
            githubLink,
            paymentAddress,
            price,
            fid: farcasterUser?.fid ?? "",
            fName: fName,
          }),
        }
      )
      const response = await request.json()
      const pinataIpfsHash = response.success
      if (pinataIpfsHash) {
        // 2. Generate a frame url with the IPFS URL
        const frameUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/hire/${pinataIpfsHash}`
        // 3. Cast the messagen with the frame url
        const data = JSON.stringify({
          signer: farcasterUser.privateKey,
          fid: farcasterUser.fid,
          castMessage: values.cast + " " + frameUrl,
          parentUrl:
            "chain://eip155:1/erc721:0x7dd4e31f1530ac682c8ea4d8016e95773e08d8b0",
        })
        const submitMessage = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/message`,
          {
            method: "POST",
            headers: {
              contentType: "application/json",
            },
            body: data,
          }
        )
        const messageJson = await submitMessage.json()
        console.log("messageJson", messageJson)
        if (submitMessage.status != 200) {
          setLoading(false)
          setCastComplete(true)
          setCastCompleteMessage("Problem sending cast")
        }
        setLoading(false)
        setCastComplete(true)
        setCastCompleteMessage("Cast Sent!")
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      setCastComplete(true)
      setCastCompleteMessage("Problem uploading file")
    }
  }

  function ButtonLoading() {
    return (
      <Button className="w-full" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    )
  }

  if (castComplete) {
    return (
      <div className="flex justify-center items-center h-full">
        <h2 className="text-xl font-bold">{castCompleteMessage}</h2>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="skills"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <Input placeholder="Your skills" {...field} />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>Experience</FormLabel>
                <FormControl>
                  <Input placeholder="Your experience" {...field} />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="githubLink"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>GitHub Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/yourprofile"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Portfolio Link */}
          <FormField
            control={form.control}
            name="portfolioLink"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>Portfolio Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourportfolio.com" {...field} />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Price for Service */}
          <FormField
            control={form.control}
            name="price"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>Price for Service ($ per day)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Your daily rate"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Payment address */}
          <FormField
            control={form.control}
            name="paymentAddress"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>Payment address</FormLabel>
                <FormControl>
                  <Input placeholder="0x0123" {...field} />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Cast */}
          <FormField
            control={form.control}
            name="cast"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>Cast</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A message to potential employers"
                    style={{ resize: "none" }}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />
          {loading ? (
            ButtonLoading()
          ) : (
            <Button className="w-full" type="submit">
              Submit
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
