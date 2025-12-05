import { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, Search, Filter, Download, Star, Eye, CheckCircle, XCircle, Briefcase } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getJobs, getJobApplications, updateApplicationStatus } from "@/lib/api";
import { toast } from "sonner";
import { PageTransition, containerVariants, itemVariants } from "../ui/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Application {
  id: number;
  name: string;
  email: string;
  jobTitle: string; // Derived from selected job
  appliedDate: string;
  matchScore: number;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  skills: string[]; // Parsed from analysis_summary or mock
  experience: string; // Parsed from analysis_summary or mock
  analysis_summary: string;
  resume_path: string;
}

interface Job {
  id: number;
  title: string;
}

const MotionCard = motion(Card);

export function ViewApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplications(parseInt(selectedJobId));
    } else {
      setApplications([]);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
      if (data.length > 0) {
        setSelectedJobId(data[0].id.toString());
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load jobs.");
    }
  };

  const fetchApplications = async (jobId: number) => {
    setIsLoading(true);
    try {
      const data = await getJobApplications(jobId);
      // Map backend data to frontend interface
      const mappedApps: Application[] = data.map((app: any) => ({
        id: app.id,
        name: app.name,
        email: app.email,
        jobTitle: jobs.find(j => j.id === jobId)?.title || "Unknown Job",
        appliedDate: app.created_at,
        matchScore: Math.round(app.score || 0), // Assuming score is 0-100 or 0-1
        status: app.status || "pending",
        skills: [], // TODO: Parse from analysis_summary
        experience: "N/A", // TODO: Parse from analysis_summary
        analysis_summary: app.analysis_summary,
        resume_path: app.resume_path
      }));
      setApplications(mappedApps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load applications.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-gray-100 text-gray-700",
      reviewed: "bg-blue-100 text-blue-700",
      shortlisted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return variants[status] || variants.pending;
  };

  const updateStatus = async (id: number, status: Application["status"]) => {
    try {
      await updateApplicationStatus(id, status);
      setApplications(applications.map(app =>
        app.id === id ? { ...app, status } : app
      ));
      toast.success(`Application marked as ${status}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const filterByStatus = (status?: string) => {
    let filtered = applications;
    if (status) {
      filtered = filtered.filter(app => app.status === status);
    }
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(lowerTerm) ||
        app.email.toLowerCase().includes(lowerTerm)
      );
    }
    return filtered;
  };

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
          <h1 className="text-3xl mb-2">Applications & Candidates</h1>
          <p className="text-gray-600">Review and manage candidate applications</p>
        </motion.div>

        {/* Job Selection and Search */}
        <motion.div
          className="grid gap-6 md:grid-cols-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Job</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job..." />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id.toString()}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filter Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Different Views */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({filterByStatus("pending").length})</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed ({filterByStatus("reviewed").length})</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted ({filterByStatus("shortlisted").length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({filterByStatus("rejected").length})</TabsTrigger>
          </TabsList>

          {["all", "pending", "reviewed", "shortlisted", "rejected"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                <AnimatePresence>
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10"
                    >
                      Loading applications...
                    </motion.div>
                  ) : filterByStatus(tab === "all" ? undefined : tab).length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10 text-gray-500"
                    >
                      No applications found.
                    </motion.div>
                  ) : (
                    filterByStatus(tab === "all" ? undefined : tab).map((app) => (
                      <MotionCard
                        key={app.id}
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Candidate Info */}
                            <div className="flex-1">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback>
                                    {app.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h3 className="text-lg">{app.name}</h3>
                                    <Badge className={getStatusBadge(app.status)}>
                                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{app.email}</p>
                                  <p className="text-sm mb-3">
                                    <span className="text-gray-600">Applied for: </span>
                                    <span>{app.jobTitle}</span>
                                  </p>
                                  {/* Skills - Placeholder if empty */}
                                  {app.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {app.skills.map((skill, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  <p className="text-sm text-gray-600">
                                    Applied on {new Date(app.appliedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* AI Match Score & Actions */}
                            <div className="flex flex-col items-center lg:items-end gap-4 lg:w-48">
                              <div className={`rounded-lg p-4 text-center w-full ${getMatchScoreColor(app.matchScore)}`}>
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm">AI Match</span>
                                </div>
                                <div className="text-3xl">{app.matchScore}%</div>
                              </div>

                              <div className="flex flex-wrap gap-2 w-full">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => setSelectedApp(app)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => window.open(`http://localhost:5000/${app.resume_path}`, '_blank')}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  CV
                                </Button>
                              </div>

                              <div className="flex gap-2 w-full">
                                {app.status !== "shortlisted" && (
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => updateStatus(app.id, "shortlisted")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Shortlist
                                  </Button>
                                )}
                                {app.status !== "rejected" && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => updateStatus(app.id, "rejected")}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                )}
                              </div>
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

        {/* Detailed View Modal */}
        <AnimatePresence>
          {selectedApp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-3xl"
              >
                <Card className="max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedApp.name}</CardTitle>
                        <CardDescription>{selectedApp.email}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedApp(null)}>
                        <XCircle className="h-6 w-6" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 font-semibold">AI Analysis</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm mb-2">
                            <strong>Match Score: {selectedApp.matchScore}%</strong>
                          </p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {selectedApp.analysis_summary || "No analysis summary available."}
                          </p>
                        </div>
                      </div>

                      {selectedApp.skills.length > 0 && (
                        <div>
                          <h3 className="mb-2 font-semibold">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedApp.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => setSelectedApp(null)}>Close</Button>
                        <Button className="flex-1" variant="outline" onClick={() => window.open(`http://localhost:5000/${selectedApp.resume_path}`, '_blank')}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Resume
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}
