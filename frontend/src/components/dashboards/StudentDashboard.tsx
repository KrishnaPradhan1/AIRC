import { useEffect, useState } from "react";
import { Sparkles, GraduationCap, Briefcase, FileText, Search, LogOut, User, ChevronDown, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { getMyApplications } from "@/lib/api";
import { useRouter } from "next/navigation";
import { PageTransition, cardHoverVariants, containerVariants, itemVariants } from "../ui/PageTransition";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export function StudentDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/student/login');
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
              <span className="text-sm text-gray-500 ml-2">| Student Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Student</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/student/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/student/settings" className="cursor-pointer">
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
          <h1 className="text-3xl mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Find jobs and manage your applications</p>
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
              <CardTitle className="text-sm">Applications</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{applications.length}</div>
              <p className="text-xs text-gray-600">Total submitted</p>
            </CardContent>
          </MotionCard>

          <MotionCard variants={itemVariants} whileHover="hover" custom={cardHoverVariants}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">In Review</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">--</div>
              <p className="text-xs text-gray-600">Being reviewed</p>
            </CardContent>
          </MotionCard>

          <MotionCard variants={itemVariants} whileHover="hover" custom={cardHoverVariants}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Interviews</CardTitle>
              <GraduationCap className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">--</div>
              <p className="text-xs text-gray-600">Scheduled</p>
            </CardContent>
          </MotionCard>

          <MotionCard variants={itemVariants} whileHover="hover" custom={cardHoverVariants}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Match Score</CardTitle>
              <Sparkles className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">--%</div>
              <p className="text-xs text-gray-600">AI profile score</p>
            </CardContent>
          </MotionCard>
        </motion.div>

        {/* Search Jobs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Search Jobs</CardTitle>
              <CardDescription>Find opportunities that match your skills and interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input placeholder="Search by job title, company, or skills..." />
                </div>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
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
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>Update your resume and improve AI matching</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/dashboard/student/resume">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Resume
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
              <CardTitle>Browse Jobs</CardTitle>
              <CardDescription>Explore available job opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/student/jobs">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View All Jobs
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
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Manage your profile and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/student/profile">
                  <FileText className="h-4 w-4 mr-2" />
                  View Profile
                </Link>
              </Button>
            </CardContent>
          </MotionCard>
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Recent Applications</h2>
            <Button variant="outline" asChild>
              <Link href="/dashboard/student/applications">View All Applications</Link>
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {loading ? (
                  <p className="text-center text-gray-500">Loading applications...</p>
                ) : applications.length === 0 ? (
                  <p className="text-center text-gray-500">No applications submitted yet.</p>
                ) : (
                  applications.slice(0, 5).map((app, index) => (
                    <div key={app.id || index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <p className="mb-1 font-medium">{app.job_title}</p>
                        <p className="text-sm text-gray-600">{app.company_name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-blue-600">{app.status}</span>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended Jobs */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Recommended Jobs</h2>
            <Button variant="outline" asChild>
              <Link href="/dashboard/student/jobs">Browse All Jobs</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Software Engineer</CardTitle>
                <CardDescription>Tech Corp Inc. • Remote • Full-time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Looking for a talented software engineer to join our team...
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Apply Now</Button>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Analyst</CardTitle>
                <CardDescription>Data Solutions Ltd. • Hybrid • Full-time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Join our data analytics team and work on cutting-edge projects...
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Apply Now</Button>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
