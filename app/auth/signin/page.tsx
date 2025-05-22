"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">เข้าสู่ระบบ</CardTitle>
        <CardDescription className="text-center">
          เข้าสู่ระบบเพื่อจัดการรายงานฝึกงานของคุณ
        </CardDescription>
        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md">
            {error === "OAuthSignin" &&
              "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง"}
            {error === "OAuthCallback" &&
              "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง"}
            {error === "OAuthCreateAccount" &&
              "ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่อีกครั้ง"}
            {error === "EmailCreateAccount" &&
              "ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่อีกครั้ง"}
            {error === "Callback" &&
              "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง"}
            {error === "Default" &&
              "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง"}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            isLoading={isLoading}
          />
          {/* <Button
            className="w-full"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
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
                className="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            )}
            เข้าสู่ระบบด้วย Google
          </Button> */}
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              หรือ
            </span>
          </div>
        </div>
        {/* <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              placeholder="m.example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={true}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={true}
            />
          </div>
          <Button className="w-full" disabled={true}>
            เข้าสู่ระบบด้วยอีเมล (เร็วๆ นี้)
          </Button>
        </div> */}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/auth/signup"
            className="text-primary underline-offset-4 hover:underline"
          >
            สมัครสมาชิก
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
