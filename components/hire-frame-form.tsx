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
import { getUserData } from "@/lib/actions"
import { Loader2 } from "lucide-react"
import Image from "next/image"

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

interface HireFrameFormProps {
  farcasterUser: FarcasterUser
  refetchData: (reloadFeed: boolean) => void
}

export default function HireFrameForm({
  farcasterUser,
  refetchData,
}: HireFrameFormProps) {
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
    if (!farcasterUser.fid) {
      return
    }
    try {
      setCastCompleteMessage("")
      setLoading(true)
      const {
        skills,
        experience,
        githubLink,
        cast,
        paymentAddress,
        price,
        portfolioLink,
      } = values
      const userData = await getUserData(farcasterUser?.fid)
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
            portfolioLink,
            paymentAddress,
            price,
            fid: farcasterUser.fid,
            fName: userData.username,
            userPfp: userData.pfp_url,
          }),
        }
      )
      const response = await request.json()
      const pinataIpfsHash = response.success
      if (pinataIpfsHash) {
        const frameUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/hire/${pinataIpfsHash}`
        const data = JSON.stringify({
          signer: farcasterUser.privateKey,
          fid: farcasterUser.fid,
          link: frameUrl,
          castMessage: cast + " " + frameUrl,
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
        if (submitMessage.status != 200) {
          setLoading(false)
          setCastComplete(true)
          setCastCompleteMessage("Problem sending cast")
        }
        setLoading(false)
        setCastComplete(true)
        setCastCompleteMessage("Cast Sent!")
        refetchData(true)
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
      <div className="flex flex-col h-[400px] justify-center items-center h-full">
        <div className="w-[300px] h-[300px]">
          <Image
            src="/images/validation.gif"
            alt="Validation"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <h2 className="text-xl font-bold tr">{castCompleteMessage}</h2>
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
