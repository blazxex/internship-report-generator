import mongoose, { Schema, type Document } from "mongoose"

export interface IReportEntry {
  id: string
  date: string
  hours: string
  description: string
}

export interface IReport extends Document {
  id: string
  userId: string
  entries: IReportEntry[]
  totalHours: number
  createdAt: Date
  updatedAt: Date
}

const ReportEntrySchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    date: { type: String, default: "" },
    hours: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
)

const ReportSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    entries: [ReportEntrySchema],
    totalHours: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Create a compound index on userId and id to ensure uniqueness
ReportSchema.index({ userId: 1, id: 1 }, { unique: true })

export default mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema)
