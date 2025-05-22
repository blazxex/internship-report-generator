"use client";

import { useState } from "react";
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
  Menu,
  X,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    const nameParts = session.user.name.split(" ");
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-screen font-sukhumvit">
        {/* 🔹 Top Navbar */}
        <div className="w-full h-16 bg-white border-b px-4 flex items-center justify-between shadow-sm">
          <div className="hidden md:block absolute left-0 top-0 z-40 h-16 w-10 flex items-center justify-center">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 pl-3 pt-2 hover:bg-gray-200 rounded transition"
            >
              {isSidebarCollapsed ? (
                <PanelRightOpen className="w-4 h-4" />
              ) : (
                <PanelRightClose className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-lg font-semibold">ระบบรายงานฝึกงาน</span>
          </div>
          <div className="flex items-center gap-2">
            {status === "loading" ? (
              <>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </>
            ) : (
              <>
                <span className="hidden md:inline text-sm text-muted-foreground">
                  {session?.user?.name || "ผู้ใช้งาน"}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full"
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
                        ข้อมูลส่วนตัว
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      ออกจากระบบ
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-red-500"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          ลบบัญชี
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการลบบัญชี</AlertDialogTitle>
                          <AlertDialogDescription>
                            การดำเนินการนี้จะลบบัญชีและข้อมูลทั้งหมดของคุณออกจากระบบ
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleSignOut}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังลบ...
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

        {/* 🔹 Main Content with Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar (Desktop) */}
          {!isSidebarCollapsed && (
            <div
              className={`hidden md:flex transition-all duration-300 ${
                isSidebarCollapsed ? "w-12" : "w-64"
              } bg-white border-r`}
            >
              <Sidebar>
                <SidebarContent className="pt-16">
                  {/* Collapse Toggle Always Visible */}
                  {/* <div className="flex justify-end pr-2 mb-4">
                    <button
                      onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      {isSidebarCollapsed ? (
                        <PanelRightOpen className="w-4 h-4" />
                      ) : (
                        <PanelRightClose className="w-4 h-4" />
                      )}
                    </button>
                  </div> */}

                  {/* Menu Items (hidden if collapsed) */}
                  {!isSidebarCollapsed && (
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === "/dashboard"}
                        >
                          <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            แดชบอร์ด
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
                            ข้อมูลส่วนตัว
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
                            รายงานประจำสัปดาห์
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
                            เอกสารฝึกงาน
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  )}
                </SidebarContent>
              </Sidebar>
            </div>
          )}

          {/* Sidebar (Mobile) */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <div
                className="w-64 h-full bg-white shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-semibold text-lg">เมนู</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      แดชบอร์ด
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      ข้อมูลส่วนตัว
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link
                      href="/dashboard/reports"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      รายงานประจำสัปดาห์
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link
                      href="/dashboard/resources"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      เอกสารฝึกงาน
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </div>
          )}

          {/* Page content */}
          <main
            className={`flex-1 overflow-auto bg-gray-50 transition-all duration-300 ${
              isSidebarCollapsed ? "md:ml-0" : ""
            }`}
          >
            <div className="w-full min-h-full py-6 px-4 md:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
