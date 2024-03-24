import "./globals.css"
import Header from "@/components/header"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { inter } from "@/public/fonts"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        <Providers>
          {" "}
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
