import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleSignInButton from "@/components/GoogleSignInButton";
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sukhumvit">
      <header className="border-b">
        <div className="max-w-screen-xl mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
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
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/api/auth/signin">
              <Button variant="ghost" size="sm">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    ระบบสร้างรายงานฝึกงาน
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    จัดการรายงานฝึกงานของคุณได้อย่างง่ายดาย
                    สร้างรายงานประจำสัปดาห์ และส่งออกเป็นไฟล์ DOCX หรือ PDF
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {/* <Link href="/api/auth/signin">
                    <Button>สมัครสมาชิก</Button>
                  </Link> */}
                  <Link href="/api/auth/signin">
                    <Button>เข้าสู่ระบบ</Button>
                  </Link>
                  {/* <Link href="/api/auth/signin?provider=google">
                    <Button variant="outline">
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
                      เข้าสู่ระบบด้วย Google
                    </Button>
                  </Link> */}
                </div>
              </div>
              {/* <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Internship Report"
                  className="aspect-square overflow-hidden rounded-xl object-cover object-center"
                  width="400"
                  height="400"
                />
              </div> */}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  คุณสมบัติหลัก
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ระบบสร้างรายงานฝึกงาน
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                <div className="rounded-full bg-gray-100 p-2">
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
                    className="h-6 w-6"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">สร้างรายงานได้ง่าย</h3>
                <p className="text-center text-gray-500">
                  สร้างรายงานประจำสัปดาห์ได้อย่างรวดเร็วและง่ายดาย
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                <div className="rounded-full bg-gray-100 p-2">
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
                    className="h-6 w-6"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">ติดตามชั่วโมงการฝึกงาน</h3>
                <p className="text-center text-gray-500">
                  ติดตามจำนวนชั่วโมงการฝึกงานทั้งหมดได้อย่างอัตโนมัติ
                </p>
              </div>
              {/* <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                <div className="rounded-full bg-gray-100 p-2">
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
                    className="h-6 w-6"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">ส่งออกเป็นไฟล์</h3>
                <p className="text-center text-gray-500">
                  ส่งออกรายงานเป็นไฟล์ DOCX หรือ PDF ได้ทันที
                </p>
              </div> */}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="max-w-screen-xl mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            © 2024 ระบบรายงานฝึกงานสำหรับนิสิตจุฬาฯ
          </p>
        </div>
      </footer>
    </div>
  );
}
