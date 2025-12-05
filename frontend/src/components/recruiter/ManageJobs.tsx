import { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, Search, Plus, Edit, Eye, Trash2, Users, Clock, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getJobs, deleteJob, updateJob } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { PageTransition, containerVariants, itemVariants } from "../ui/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  status: "active" | "draft" | "closed";
  applicants_count: number;
  created_at: string;
  salary: string;
  skills: string[];
}

const MotionCard = motion(Card);

export function ManageJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      draft: "bg-yellow-100 text-yellow-700",
      closed: "bg-gray-100 text-gray-700",
    };
    return variants[status] || variants.active;
  };

  const filterByStatus = (status?: string) => {
    const filtered = status ? jobs.filter(job => job.status === status) : jobs;
    if (searchTerm) {
      return filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      try {
        await deleteJob(id);
        setJobs(jobs.filter(job => job.id !== id));
        toast.success("Job deleted successfully");
      } catch (error) {
        console.error("Failed to delete job:", error);
        toast.error("Failed to delete job");
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: Job["status"]) => {
    try {
      await updateJob(id, { status: newStatus });
      setJobs(jobs.map(job =>
        job.id === id ? { ...job, status: newStatus } : job
      ));
      toast.success(`Job marked as ${newStatus}`);
    } catch (error) {
      console.error("Failed to update job status:", error);
      toast.error("Failed to update job status");
    }
  };

  const getStatusCount = (status: string) => {
    return jobs.filter(job => job.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/recruiter" className="flex items-center gap-2 hover:text-blue-600">
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <span className="text-lg">AI Resume Classifier</span>
              </div>
            </div>
            <Button asChild>
              <Link href="/dashboard/recruiter/jobs/new">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Link>
            </Button>
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
          <h1 className="text-3xl mb-2">Manage Jobs</h1>
          <p className="text-gray-600">View and manage your job postings</p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="grid gap-4 md:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-1">{jobs.length}</div>
                <p className="text-sm text-gray-600">Total Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl text-green-600 mb-1">{getStatusCount("active")}</div>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl text-yellow-600 mb-1">{getStatusCount("draft")}</div>
                <p className="text-sm text-gray-600">Drafts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-1">
                  {jobs.reduce((sum, job) => sum + (job.applicants_count || 0), 0)}
                </div>
                <p className="text-sm text-gray-600">Total Applicants</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search job postings..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Jobs Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all">All ({jobs.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({getStatusCount("active")})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({getStatusCount("draft")})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({getStatusCount("closed")})</TabsTrigger>
          </TabsList>

          {["all", "active", "draft", "closed"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                <AnimatePresence>
                  {filterByStatus(tab === "all" ? undefined : tab).length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No jobs found</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    filterByStatus(tab === "all" ? undefined : tab).map((job) => (
                      <MotionCard
                        key={job.id}
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Job Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg">{job.title}</h3>
                                    <Badge className={getStatusBadge(job.status)}>
                                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                                    <span>{job.location}</span>
                                    <span>•</span>
                                    <span>{job.type}</span>
                                    <span>•</span>
                                    <span>{job.salary}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {job.skills.map((skill) => (
                                      <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {job.applicants_count || 0} applicants
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  Posted {new Date(job.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 lg:w-48">
                              {job.status === "active" && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/dashboard/recruiter/jobs/${job.id}/applications`}>
                                    <Users className="h-4 w-4 mr-2" />
                                    View Applicants
                                  </Link>
                                </Button>
                              )}
                              {job.status === "draft" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusChange(job.id, "active")}
                                >
                                  Publish Job
                                </Button>
                              )}
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                  <Link href={`/dashboard/recruiter/jobs/${job.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-red-600 hover:text-red-700"
                                  onClick={() => handleDelete(job.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {job.status === "active" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(job.id, "closed")}
                                >
                                  Close Job
                                </Button>
                              )}
                              {job.status === "closed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(job.id, "active")}
                                >
                                  Reopen Job
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </MotionCard>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </PageTransition>
  );
}
