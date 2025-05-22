import type React from "react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - ระบบรายงานฝึกงาน",
  description: "Authentication pages for the internship report system",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-screen-xl mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M5 3a2 2 0 0 0-2 2" />
                <path d="M19 3a2 2 0 0 1 2 2" />
                <path d="M21 19a2 2 0 0 1-2 2" />
                <path d="M5 21a2 2 0 0 1-2-2" />
                <path d="M9 3h1" />
                <path d="M9 21h1" />
                <path d="M14 3h1" />
                <path d="M14 21h1" />
                <path d="M3 9v1" />
                <path d="M21 9v1" />
                <path d="M3 14v1" />
                <path d="M21 14v1" />
              </svg>
              <span className="text-lg font-semibold">ระบบรายงานฝึกงาน</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="border-t">
        <div className="max-w-screen-xl mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">© 2024 ระบบรายงานฝึกงานสำหรับนิสิตจุฬาฯ</p>
        </div>
      </footer>
    </div>
  )
}
