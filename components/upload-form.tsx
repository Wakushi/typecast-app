"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { z } from "zod"
import Image from "next/image"
import { FarcasterUser } from "@/lib/types/farcaster-user"
import { uploadFile } from "@/lib/upload-file"
import { DEV_CHANNEL } from "@/lib/utils"
import { Textarea } from "./ui/textarea"
import { CiImageOn } from "react-icons/ci"

const formSchema = z.object({
  cast: z.string().min(2).max(320),
  file: z.any(),
})

interface UploadFormProps {
  farcasterUser: FarcasterUser
  refetchData: (reloadFeed: boolean) => void
  userCastMessage?: string
}

export default function UploadForm({
  farcasterUser,
  refetchData,
  userCastMessage,
}: UploadFormProps) {
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
      cast: userCastMessage ? userCastMessage : "",
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
        parentUrl: DEV_CHANNEL,
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
      setTimeout(() => {
        refetchData(true)
      }, 2000)
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
    <div className="flex flex-col flex-grow justify-center items-center py-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="cast"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Cast</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full max-w-[600px] min-h-[130px] mb-4 resize-none"
                    placeholder="What's on your mind?"
                    disabled={loading ? true : false}
                    {...field}
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <>
            {!selectedFile && (
              <div className="flex justify-end">
                <input
                  id="fileInput"
                  className="hidden"
                  type="file"
                  onChange={fileChangeHandler}
                />
                <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#eee3",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <CiImageOn className="text-2xl" />
                  </div>
                </label>
              </div>
            )}
          </>
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
