"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import channels from "@/lib/channels.json"

import { z } from "zod"
import Image from "next/image"
import { FarcasterUser } from "@/lib/types/farcaster-user"
import { Channel } from "@/lib/types/channel"
import { uploadFile } from "@/lib/upload-file"

const formSchema = z.object({
  cast: z.string().min(2).max(320),
  file: z.any(),
  parentUrl: z.string(), // channel url
})

interface FormProps {
  farcasterUser: FarcasterUser
}

export default function UploadForm({ farcasterUser }: FormProps) {
  const [selectedFile, setSelecteFile] = useState()
  const [imageLoading, setImageLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [castComplete, setCastComplete] = useState(false)
  const [castCompleteMessage, setCastCompleteMessage] = useState("")

  async function fileChangeHandler(event: any) {
    setImageLoading(true)
    const file = event.target.files[0]
    setSelecteFile(file)
    setImageLoading(false)
  }

  async function reset() {
    setSelecteFile(undefined)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cast: "",
      file: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setCastCompleteMessage("")
      setLoading(true)
      const fileLink = await uploadFile(selectedFile)
      const data = JSON.stringify({
        signer: farcasterUser.privateKey,
        fid: farcasterUser.fid,
        link: fileLink,
        castMessage: values.cast,
        parentUrl: values.parentUrl,
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
    <div className="flex flex-col flex-grow justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          {selectedFile && !imageLoading && (
            <div className="relative">
              <Image
                className="max-h-[250px] rounded-md sm:max-h-[500px] h-auto object-cover hover:cursor-pointer hover:opacity-80"
                width={500}
                height={500}
                src={URL.createObjectURL(selectedFile)}
                alt="User image"
                onClick={reset}
              />
            </div>
          )}
          {imageLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!selectedFile && (
            <Input
              placeholder="file"
              type="file"
              onChange={fileChangeHandler}
            />
          )}
          <FormField
            control={form.control}
            name="cast"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Cast</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading ? true : false}
                    placeholder="Image uploaded from PhotoCast"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Cast / Caption</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Channel</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a channel to cast in" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {channels.map((channel: Channel) => (
                      <SelectItem key={channel.url} value={channel.url}>
                        {channel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
