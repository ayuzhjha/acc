import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import SplashCursor from "@/components/SplashCursor"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
})

export const metadata: Metadata = {
    title: "ACM Weekly Coding Challenge",
    description: "Solve. Submit. Climb the leaderboard. Weekly coding challenges by ACM Student Chapter.",
    keywords: ["ACM", "coding challenge", "competitive programming", "leaderboard", "student chapter"],
    authors: [{ name: "ACM Student Chapter" }],
    openGraph: {
        title: "ACM Weekly Coding Challenge",
        description: "Solve. Submit. Climb the leaderboard.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "ACM Weekly Coding Challenge",
        description: "Solve. Submit. Climb the leaderboard.",
    },
    generator: 'v0.app',
    icons: {
        icon: '/intrologo.png',
    },
}

export const viewport: Viewport = {
    themeColor: "#0085CA",
    width: "device-width",
    initialScale: 1,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <SplashCursor />
                        {children}
                        <Toaster />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
