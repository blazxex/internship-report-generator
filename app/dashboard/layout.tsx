"use client";

import type React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  UserCircle,
  FileText,
  LayoutDashboard,
  LogOut,
  User,
  Trash,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Add the deleteAccount function inside the component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const deleteAccount = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch("/api/user", {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "บัญชีถูกลบเรียบร้อยแล้ว",
          description:
            "บัญชีและข้อมูลทั้งหมดของคุณถูกลบออกจากระบบเรียบร้อยแล้ว",
        });
        await signOut({ callbackUrl: "/" });
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบบัญชีได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!session?.user?.name) return "U";

    const nameParts = session.user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Update the dropdown menu to include the delete account option
  return (
    <SidebarProvider>
      {/* Full screen layout */}
      <div className="flex flex-col min-h-screen w-screen">
        {/* Top navbar */}
        <div className="w-full h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
          <span className="text-lg font-semibold">ระบบรายงานฝึกงาน</span>

          {/* User menu */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ) : (
              <>
                <span className="text-sm text-muted-foreground hidden md:inline-block">
                  {session?.user?.name || "ผู้ใช้งาน"}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session?.user?.image || ""}
                          alt={session?.user?.name || "User"}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>ข้อมูลส่วนตัว</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>ออกจากระบบ</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-red-500"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>ลบบัญชี</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการลบบัญชี</AlertDialogTitle>
                          <AlertDialogDescription>
                            การดำเนินการนี้จะลบบัญชีและข้อมูลทั้งหมดของคุณออกจากระบบ
                            และไม่สามารถย้อนกลับได้
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={deleteAccount}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังลบบัญชี...
                              </>
                            ) : (
                              "ลบบัญชี"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Main content: sidebar + page */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar>
            <SidebarHeader className="px-4 py-2">
              <div className="flex items-center space-x-2 px-4 py-2">
                <span className="text-sm">เมนู</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard"}
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>แดชบอร์ด</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/profile"}
                  >
                    <Link href="/dashboard/profile">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>ข้อมูลส่วนตัว</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/reports"}
                  >
                    <Link href="/dashboard/reports">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>รายงานประจำสัปดาห์</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/resources"}
                  >
                    <Link href="/dashboard/resources">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>เอกสารประกอบการฝึกงาน</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>ออกจากระบบ</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          {/* Page content area */}
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="w-full min-h-full py-6 px-4 md:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
