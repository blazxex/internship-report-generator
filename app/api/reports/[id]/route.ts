import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongoose"
import Report from "@/models/Report"

// GET /api/reports/[id] - Get a specific report
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reportId = params.id

    await dbConnect()

    const report = await Report.findOne({
      userId: session.user.id,
      id: reportId,
    })

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error fetching report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// PUT /api/reports/[id] - Update a specific report
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reportId = params.id
    const reportData = await req.json()

    await dbConnect()

    // Ensure the report belongs to the user
    const existingReport = await Report.findOne({
      userId: session.user.id,
      id: reportId,
    })

    if (!existingReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Update the report
    reportData.userId = session.user.id

    const updatedReport = await Report.findOneAndUpdate(
      { userId: session.user.id, id: reportId },
      { $set: reportData },
      { new: true, runValidators: true },
    )

    return NextResponse.json({ success: true, report: updatedReport })
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE /api/reports/[id] - Delete a specific report
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reportId = params.id

    await dbConnect()

    // Ensure the report belongs to the user
    const existingReport = await Report.findOne({
      userId: session.user.id,
      id: reportId,
    })

    if (!existingReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Delete the report
    await Report.findOneAndDelete({
      userId: session.user.id,
      id: reportId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
