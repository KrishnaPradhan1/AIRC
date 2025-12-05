import { useEffect, useState } from "react";
import { Sparkles, Briefcase, Users, FileText, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { getJobs } from "@/lib/api";
import { useRouter } from "next/navigation";
import { PageTransition, cardHoverVariants, containerVariants, itemVariants } from "../ui/PageTransition";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export function RecruiterDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        // In a real app, we would filter by recruiter ID or use a specific endpoint
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/recruiter/login');
  };

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-lg">AI Resume Classifier</span>
              <span className="text-sm text-gray-500 ml-2">| Recruiter Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Recruiter</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/recruiter/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/recruiter/settings" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl mb-2">Recruiter Dashboard</h1>
          <p className="text-gray-600">Manage your job postings and review candidates</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <MotionCard variants={itemVariants} whileHover="hover" custom={cardHoverVariants}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{jobs.length}</div>
              <p className="text-xs text-gray-600">Total active postings</p>
            </CardContent>
          </MotionCard>

          <MotionCard variants={itemVariants} whileHover="hover" custom={cardHoverVariants}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">--</div>
              <p className="text-xs text-gray-600">Applications received</p>
            </CardContent>
          </MotionCard>

          <MotionCard variants={itemVariants} whileHover="hover" custom={cardHoverVariants}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Candidates Reviewed</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">--</div>
              <p className="text-xs text-gray-600">Processed by AI</p>
            </CardContent>
          </MotionCard>

          <MotionCard variants={itemVariants} whileHover="hover" custom={cardHoverVariants}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Shortlisted</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">--</div>
              <p className="text-xs text-gray-600">Ready for interview</p>
            </CardContent>
          </MotionCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <MotionCard
            variants={itemVariants}
            whileHover="hover"
            custom={cardHoverVariants}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle>Post New Job</CardTitle>
              <CardDescription>Create a new job posting and find candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/dashboard/recruiter/jobs/new">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Create Job Posting
                </Link>
              </Button>
            </CardContent>
          </MotionCard>

          <MotionCard
            variants={itemVariants}
            whileHover="hover"
            custom={cardHoverVariants}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle>Review Applications</CardTitle>
              <CardDescription>View and analyze candidate resumes with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/recruiter/applications">
                  <FileText className="h-4 w-4 mr-2" />
                  View Applications
                </Link>
              </Button>
            </CardContent>
          </MotionCard>

          <MotionCard
            variants={itemVariants}
            whileHover="hover"
            custom={cardHoverVariants}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/recruiter/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Link>
              </Button>
            </CardContent>
          </MotionCard>
        </motion.div>

        {/* Recent Jobs */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Recent Job Postings</h2>
            <Button variant="outline" asChild>
              <Link href="/dashboard/recruiter/jobs">View All Jobs</Link>
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {loading ? (
                  <p className="text-center text-gray-500">Loading jobs...</p>
                ) : jobs.length === 0 ? (
                  <p className="text-center text-gray-500">No jobs posted yet.</p>
                ) : (
                  jobs.slice(0, 5).map((job, index) => (
                    <div key={job.id || index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <p className="mb-1 font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.location} • {job.type}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-green-600">Active</span>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/recruiter/jobs/${job.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </PageTransition>
  );
}
