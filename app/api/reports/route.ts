import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongoose"
import Report from "@/models/Report"

// GET /api/reports - Get all reports for the user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const reports = await Report.find({ userId: session.user.id }).sort({ id: 1 })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST /api/reports - Create a new report or update existing reports
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reportsData = await req.json()

    await dbConnect()

    // Delete existing reports for this user
    await Report.deleteMany({ userId: session.user.id })

    // Add userId to each report and insert them
    const reportsWithUserId = reportsData.map((report: any) => ({
      ...report,
      userId: session.user.id,
    }))

    if (reportsWithUserId.length > 0) {
      await Report.insertMany(reportsWithUserId)
    }

    return NextResponse.json({ success: true, count: reportsWithUserId.length })
  } catch (error) {
    console.error("Error saving reports:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
