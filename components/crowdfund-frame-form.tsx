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
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { z } from "zod"
import { FarcasterUser } from "@/lib/types/farcaster-user"

// Define your form schema using Zod
const crowdfundFormSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  fundingGoal: z.number().min(1, "Funding goal must be positive"),
  category: z.string().min(1, "Category is required"),
  endDate: z.date(),
  rewards: z
    .array(
      z.object({
        title: z.string(),
        pledgeAmount: z.number().min(1, "Pledge amount must be positive"),
        description: z.string(),
        deliveryDate: z.string(), // Ensure proper date validation as needed
      })
    )
    .optional(),
})

type CrowdfundFormData = z.infer<typeof crowdfundFormSchema>

export default function CrowdfundForm({
  farcasterUser,
}: {
  farcasterUser: FarcasterUser
}) {
  const form = useForm<CrowdfundFormData>({
    resolver: zodResolver(crowdfundFormSchema),
  })

  const onSubmit = (data: CrowdfundFormData) => {
    console.log(data)
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
            name="title"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Project Title" {...field} />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Project Description" {...field} />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fundingGoal"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>Funding Goal ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Funding Goal" {...field} />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Technology, Art, Film" {...field} />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full">
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        onSelect={(date) => {
                          if (date) {
                            form.setValue("endDate", date)
                          }
                        }}
                        initialFocus
                        {...field}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Rewards can be dynamically added. Demonstrating static for simplicity. */}
          {/* Implement dynamic reward fields as needed. */}

          <Button type="submit" className="w-full">
            Create Crowdfund Campaign
          </Button>
        </form>
      </Form>
    </div>
  )
}
