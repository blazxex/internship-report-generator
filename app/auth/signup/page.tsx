"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import GoogleSignInButton from "@/components/GoogleSignInButton";
export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/dashboard", // or your desired path
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">สมัครสมาชิก</CardTitle>
        <CardDescription className="text-center">
          สร้างบัญชีเพื่อจัดการรายงานฝึกงานของคุณ
        </CardDescription>
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
            สมัครสมาชิกด้วย Google
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
          <div className="space-y-2">
            <Label htmlFor="confirm-password">ยืนยันรหัสผ่าน</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={true}
            />
          </div>
          <Button className="w-full" disabled={true}>
            สมัครสมาชิกด้วยอีเมล (เร็วๆ นี้)
          </Button>
        </div> */}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/auth/signin"
            className="text-primary underline-offset-4 hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
