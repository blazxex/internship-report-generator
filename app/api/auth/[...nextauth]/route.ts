import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import Profile from "@/models/Profile"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await dbConnect()

          // Check if user exists
          const existingUser = await User.findOne({ email: user.email })

          if (!existingUser) {
            // Create new user
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
            })

            // Create empty profile for the user
            await Profile.create({
              userId: newUser._id.toString(),
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
            })
          }
        } catch (error) {
          console.error("Error during sign in:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
