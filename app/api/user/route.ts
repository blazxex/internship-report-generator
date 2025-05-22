import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import Profile from "@/models/Profile"
import Report from "@/models/Report"

// DELETE /api/user - Delete user account and all associated data
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Delete all user data
    await Promise.all([
      User.findOneAndDelete({ email: session.user.email }),
      Profile.findOneAndDelete({ userId: session.user.id }),
      Report.deleteMany({ userId: session.user.id }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user account:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
