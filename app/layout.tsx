import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InternshipProvider } from "@/context/internship-context";
import { ThemeProvider } from "@/components/theme-provider";
import { NextAuthProvider } from "@/components/next-auth-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ระบบรายงานฝึกงาน",
  description: "ระบบรายงานฝึกงานสำหรับนิสิตจุฬาฯ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${inter.className} font-sukhumvit`}>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <InternshipProvider>
              {children}
              <Toaster />
            </InternshipProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
