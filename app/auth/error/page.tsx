"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorMessage = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง"

  if (error === "Configuration") {
    errorMessage = "เกิดข้อผิดพลาดในการตั้งค่าระบบเข้าสู่ระบบ กรุณาติดต่อผู้ดูแลระบบ"
  } else if (error === "AccessDenied") {
    errorMessage = "คุณไม่มีสิทธิ์เข้าถึงหน้านี้"
  } else if (error === "Verification") {
    errorMessage = "ลิงก์ยืนยันตัวตนไม่ถูกต้องหรือหมดอายุแล้ว กรุณาลองใหม่อีกครั้ง"
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">เกิดข้อผิดพลาด</CardTitle>
        <CardDescription className="text-center">{errorMessage}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="rounded-full bg-red-50 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-red-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/auth/signin">กลับไปหน้าเข้าสู่ระบบ</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
