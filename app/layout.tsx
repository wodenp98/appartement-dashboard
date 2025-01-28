import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Appartements",
  description: "Appartements",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <head>
        <link rel="icon" href="/house.svg" sizes="36x36" />
    </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

