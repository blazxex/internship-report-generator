"use client"

import type React from "react"
import { useState } from "react"
import { useInternship } from "@/context/internship-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { profile, setProfile, saveProfile, loading } = useInternship()
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await saveProfile()
      toast({
        title: "บันทึกข้อมูลเรียบร้อยแล้ว",
        description: "ข้อมูลส่วนตัวของคุณถูกบันทึกเรียบร้อยแล้ว",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ข้อมูลส่วนตัว</h1>
        <p className="text-muted-foreground">กรอกข้อมูลส่วนตัวและรายละเอียดการฝึกงานของคุณ</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลนิสิต</CardTitle>
              <CardDescription>กรอกข้อมูลส่วนตัวของคุณ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">ชื่อ</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    placeholder="ชื่อ"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">นามสกุล</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    placeholder="นามสกุล"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">รหัสนิสิต</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={profile.studentId}
                  onChange={handleChange}
                  placeholder="รหัสนิสิต"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">ภาควิชา</Label>
                <Input
                  id="department"
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  placeholder="ภาควิชา"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลการฝึกงาน</CardTitle>
              <CardDescription>กรอกข้อมูลเกี่ยวกับการฝึกงานของคุณ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">ชื่อบริษัท</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={profile.companyName}
                  onChange={handleChange}
                  placeholder="ชื่อบริษัท"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">ตำแหน่งฝึกงาน</Label>
                <Input
                  id="position"
                  name="position"
                  value={profile.position}
                  onChange={handleChange}
                  placeholder="ตำแหน่งฝึกงาน"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">วันที่เริ่มฝึกงาน</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={profile.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">วันที่สิ้นสุดฝึกงาน</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={profile.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลผู้ดูแล</CardTitle>
              <CardDescription>กรอกข้อมูลเกี่ยวกับผู้ดูแลการฝึกงานของคุณ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supervisorName">ชื่อผู้ดูแล</Label>
                <Input
                  id="supervisorName"
                  name="supervisorName"
                  value={profile.supervisorName}
                  onChange={handleChange}
                  placeholder="ชื่อผู้ดูแล"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisorPosition">ตำแหน่งผู้ดูแล</Label>
                <Input
                  id="supervisorPosition"
                  name="supervisorPosition"
                  value={profile.supervisorPosition}
                  onChange={handleChange}
                  placeholder="ตำแหน่งผู้ดูแล"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-end">
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                "บันทึกข้อมูล"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
