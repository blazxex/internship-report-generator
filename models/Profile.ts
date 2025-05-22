import mongoose, { Schema, type Document } from "mongoose"

export interface IProfile extends Document {
  userId: string
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
  createdAt: Date
  updatedAt: Date
}

const ProfileSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    studentId: { type: String, default: "" },
    companyName: { type: String, default: "" },
    position: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    supervisorName: { type: String, default: "" },
    supervisorPosition: { type: String, default: "" },
    department: { type: String, default: "ภาควิชาวิศวกรรมคอมพิวเตอร์" },
  },
  { timestamps: true },
)

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema)
