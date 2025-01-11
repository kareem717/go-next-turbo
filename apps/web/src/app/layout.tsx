import "@repo/ui/globals.css";

import React from "react";
import { env } from "@/lib/env";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/app/components/theme-provider";
import { Toaster } from "@repo/ui/components/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "App",
    template: "%s | App",
  },
  description: "Building the app of apps.",
};

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          <NuqsAdapter>
            {children}
            <Toaster />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html >
  );
}
