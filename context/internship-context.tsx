"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface ProfileData {
  firstName: string
  lastName: string
  studentId: string
  companyName: string
  position: string
  startDate: string
  endDate: string
  supervisorName: string
  supervisorPosition: string
  department: string
}

export interface ReportEntry {
  id: string
  date: string
  hours: string
  description: string
}

export interface Report {
  id: string
  entries: ReportEntry[]
  totalHours: number
}

interface InternshipContextType {
  profile: ProfileData
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>
  reports: Report[]
  setReports: React.Dispatch<React.SetStateAction<Report[]>>
  language: "th" | "en"
  setLanguage: React.Dispatch<React.SetStateAction<"th" | "en">>
  showPreview: boolean
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>
  getTotalHours: () => number
  getDaysCompleted: () => number
  getDaysRemaining: () => number
  getTotalDays: () => number
  saveProfile: () => Promise<void>
  saveReports: () => Promise<void>
  loading: boolean
}

const defaultProfile: ProfileData = {
  firstName: "",
  lastName: "",
  studentId: "",
  companyName: "",
  position: "",
  startDate: "",
  endDate: "",
  supervisorName: "",
  supervisorPosition: "",
  department: "ภาควิชาวิศวกรรมคอมพิวเตอร์",
}

const InternshipContext = createContext<InternshipContextType | undefined>(undefined)

export function InternshipProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [reports, setReports] = useState<Report[]>([])
  const [language, setLanguage] = useState<"th" | "en">("th")
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  // Load data from API when session is available
  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchProfileData()
      fetchReportsData()
    } else if (status === "unauthenticated") {
      // Load from localStorage if not authenticated
      loadFromLocalStorage()
      setLoading(false)
    }
  }, [status, session])

  // Fetch profile data from API
  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/profile")

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        // If no profile exists yet, use default or localStorage
        loadProfileFromLocalStorage()
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      loadProfileFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  // Fetch reports data from API
  const fetchReportsData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/reports")

      if (response.ok) {
        const data = await response.json()
        setReports(data)
      } else {
        // If no reports exist yet, use localStorage
        loadReportsFromLocalStorage()
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
      loadReportsFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  // Save profile to API
  const saveProfile = async () => {
    if (status === "authenticated" && session) {
      try {
        setLoading(true)
        const response = await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        })

        if (!response.ok) {
          throw new Error("Failed to save profile")
        }

        // Also save to localStorage as backup
        localStorage.setItem("internshipProfile", JSON.stringify(profile))
      } catch (error) {
        console.error("Error saving profile:", error)
        // Save to localStorage if API fails
        localStorage.setItem("internshipProfile", JSON.stringify(profile))
      } finally {
        setLoading(false)
      }
    } else {
      // Save to localStorage if not authenticated
      localStorage.setItem("internshipProfile", JSON.stringify(profile))
    }
  }

  // Save reports to API
  const saveReports = async () => {
    if (status === "authenticated" && session) {
      try {
        setLoading(true)
        const response = await fetch("/api/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reports),
        })

        if (!response.ok) {
          throw new Error("Failed to save reports")
        }

        // Also save to localStorage as backup
        localStorage.setItem("internshipReports", JSON.stringify(reports))
      } catch (error) {
        console.error("Error saving reports:", error)
        // Save to localStorage if API fails
        localStorage.setItem("internshipReports", JSON.stringify(reports))
      } finally {
        setLoading(false)
      }
    } else {
      // Save to localStorage if not authenticated
      localStorage.setItem("internshipReports", JSON.stringify(reports))
    }
  }

  // Load data from localStorage
  const loadFromLocalStorage = () => {
    loadProfileFromLocalStorage()
    loadReportsFromLocalStorage()

    const savedLanguage = localStorage.getItem("internshipLanguage")
    const savedShowPreview = localStorage.getItem("internshipShowPreview")

    if (savedLanguage) {
      setLanguage(savedLanguage as "th" | "en")
    }
    if (savedShowPreview) {
      setShowPreview(savedShowPreview === "true")
    }
  }

  const loadProfileFromLocalStorage = () => {
    const savedProfile = localStorage.getItem("internshipProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }

  const loadReportsFromLocalStorage = () => {
    const savedReports = localStorage.getItem("internshipReports")
    if (savedReports) {
      setReports(JSON.parse(savedReports))
    }
  }

  // Save language and preview settings to localStorage
  useEffect(() => {
    localStorage.setItem("internshipLanguage", language)
  }, [language])

  useEffect(() => {
    localStorage.setItem("internshipShowPreview", showPreview.toString())
  }, [showPreview])

  // Calculate total hours from all reports
  const getTotalHours = () => {
    return reports.reduce((total, report) => total + report.totalHours, 0)
  }

  // Calculate days completed based on reports
  const getDaysCompleted = () => {
    if (!profile.startDate) return 0

    const startDate = new Date(profile.startDate)
    const today = new Date()
    const currentDate = today < new Date(profile.endDate) ? today : new Date(profile.endDate)

    // Calculate the difference in days
    const diffTime = currentDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }

  // Calculate total internship days
  const getTotalDays = () => {
    if (!profile.startDate || !profile.endDate) return 0

    const startDate = new Date(profile.startDate)
    const endDate = new Date(profile.endDate)

    // Calculate the difference in days
    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }

  // Calculate days remaining
  const getDaysRemaining = () => {
    return Math.max(0, getTotalDays() - getDaysCompleted())
  }

  return (
    <InternshipContext.Provider
      value={{
        profile,
        setProfile,
        reports,
        setReports,
        language,
        setLanguage,
        showPreview,
        setShowPreview,
        getTotalHours,
        getDaysCompleted,
        getDaysRemaining,
        getTotalDays,
        saveProfile,
        saveReports,
        loading,
      }}
    >
      {children}
    </InternshipContext.Provider>
  )
}

export function useInternship() {
  const context = useContext(InternshipContext)
  if (context === undefined) {
    throw new Error("useInternship must be used within an InternshipProvider")
  }
  return context
}
