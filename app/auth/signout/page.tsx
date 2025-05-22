"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function SignOut() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut({ callbackUrl: "/" })
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">ออกจากระบบ</CardTitle>
        <CardDescription className="text-center">คุณต้องการออกจากระบบหรือไม่?</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button onClick={handleSignOut} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          ออกจากระบบ
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/dashboard">กลับไปหน้าแดชบอร์ด</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
