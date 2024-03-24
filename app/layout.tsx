import "./globals.css"
import Header from "@/components/header"
import { Providers } from "@/components/providers"
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
        </Providers>
      </body>
    </html>
  )
}
