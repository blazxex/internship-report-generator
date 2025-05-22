import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongoose"
import Profile from "@/models/Profile"

// GET /api/profile - Get user profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const profile = await Profile.findOne({ userId: session.user.id })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST /api/profile - Create or update user profile
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profileData = await req.json()

    await dbConnect()

    // Add userId to profile data
    profileData.userId = session.user.id

    // Check if profile exists
    const existingProfile = await Profile.findOne({ userId: session.user.id })

    let profile
    if (existingProfile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { userId: session.user.id },
        { $set: profileData },
        { new: true, runValidators: true },
      )
    } else {
      // Create new profile
      profile = await Profile.create(profileData)
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Error saving profile:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE /api/profile - Delete user profile
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Delete the profile
    await Profile.findOneAndDelete({ userId: session.user.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting profile:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
