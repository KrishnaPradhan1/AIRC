"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { RecruiterSignup } from "@/components/auth/RecruiterSignup"
import { StudentSignup } from "@/components/auth/StudentSignup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Briefcase } from "lucide-react"
import { Suspense } from "react"

function SignupContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const role = searchParams.get('role')

    if (role === 'recruiter') {
        return <RecruiterSignup />
    }

    if (role === 'student') {
        return <StudentSignup />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
            <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Choose your account type to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div
                        className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-6 flex flex-col items-center gap-4 hover:bg-white/10 transition-all"
                        onClick={() => router.push('/auth/signup?role=student')}
                    >
                        <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <User className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-white">Student</h3>
                            <p className="text-sm text-gray-400">Find jobs and get AI resume feedback</p>
                        </div>
                    </div>

                    <div
                        className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-6 flex flex-col items-center gap-4 hover:bg-white/10 transition-all"
                        onClick={() => router.push('/auth/signup?role=recruiter')}
                    >
                        <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Briefcase className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-white">Recruiter</h3>
                            <p className="text-sm text-gray-400">Post jobs and find top talent</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupContent />
        </Suspense>
    )
}
