import "./globals.css"
import Header from "@/components/header"
import { FarcasterProvider } from "@/services/user-context"
import { inter } from "@/styles/fonts"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        <FarcasterProvider>
          <Header />
          {children}
        </FarcasterProvider>
      </body>
    </html>
  )
}
