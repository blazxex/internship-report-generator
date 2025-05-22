"use client"

import { useInternship } from "@/context/internship-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Clock, ClipboardList } from "lucide-react"

export default function DashboardPage() {
  const { profile, getTotalHours, getDaysCompleted, getDaysRemaining, getTotalDays } = useInternship()

  const totalHours = getTotalHours()
  const daysCompleted = getDaysCompleted()
  const daysRemaining = getDaysRemaining()
  const totalDays = getTotalDays()

  // Calculate progress percentage
  const progressPercentage = totalDays > 0 ? Math.round((daysCompleted / totalDays) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">แดชบอร์ด</h1>
        <p className="text-muted-foreground">ภาพรวมการฝึกงานของคุณ</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนวันที่ฝึกงานแล้ว</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysCompleted} วัน</div>
            <p className="text-xs text-muted-foreground">จากทั้งหมด {totalDays} วัน</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนวันที่เหลือ</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysRemaining} วัน</div>
            <p className="text-xs text-muted-foreground">จากทั้งหมด {totalDays} วัน</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนชั่วโมงทั้งหมด</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours} ชั่วโมง</div>
            <p className="text-xs text-muted-foreground">จากรายงานทั้งหมด</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ความคืบหน้าการฝึกงาน</CardTitle>
          <CardDescription>
            {profile.startDate && profile.endDate ? (
              <>
                ระยะเวลาฝึกงาน: {new Date(profile.startDate).toLocaleDateString("th-TH")} -{" "}
                {new Date(profile.endDate).toLocaleDateString("th-TH")}
              </>
            ) : (
              "กรุณากรอกวันที่เริ่มและสิ้นสุดการฝึกงานในหน้าข้อมูลส่วนตัว"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>ความคืบหน้า</div>
              <div className="font-medium">{progressPercentage}%</div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="grid grid-cols-3 text-center text-sm text-muted-foreground">
              <div>
                <div className="font-medium text-foreground">{daysCompleted} วัน</div>
                <div>ผ่านไปแล้ว</div>
              </div>
              <div>
                <div className="font-medium text-foreground">{daysRemaining} วัน</div>
                <div>เหลืออีก</div>
              </div>
              <div>
                <div className="font-medium text-foreground">{totalDays} วัน</div>
                <div>ทั้งหมด</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>สรุปรายงาน</CardTitle>
          <CardDescription>ข้อมูลจากรายงานประจำสัปดาห์ทั้งหมด</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5 text-muted-foreground" />
              <div className="font-medium">จำนวนชั่วโมงทั้งหมด: {totalHours} ชั่วโมง</div>
            </div>
            {profile.companyName && (
              <div className="rounded-md bg-muted p-4">
                <div className="font-medium">ข้อมูลการฝึกงาน</div>
                <div className="mt-2 text-sm">
                  <div>
                    ชื่อ-นามสกุล: {profile.firstName} {profile.lastName}
                  </div>
                  <div>รหัสนิสิต: {profile.studentId}</div>
                  <div>บริษัท: {profile.companyName}</div>
                  <div>ตำแหน่ง: {profile.position}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
