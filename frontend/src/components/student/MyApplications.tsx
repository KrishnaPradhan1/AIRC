import { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, FileText, Clock, CheckCircle, XCircle, Eye, Building, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getMyApplications } from "@/lib/api";
import { toast } from "sonner";
import { PageTransition, containerVariants, itemVariants } from "../ui/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: "pending" | "in-review" | "interview" | "accepted" | "rejected";
  matchScore: number;
  lastUpdate: string;
}

const MotionCard = motion(Card);

export function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getMyApplications();
      const mappedApps = data.map((app: any) => ({
        id: app.id,
        jobTitle: app.job_title,
        company: "Unknown Company", // Backend doesn't return company yet
        location: "Remote", // Backend doesn't return location yet
        appliedDate: app.applied_at,
        status: (app.status || "pending").toLowerCase(),
        matchScore: 0, // Backend doesn't return score yet
        lastUpdate: "Application received", // Placeholder
      }));
      setApplications(mappedApps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string }> = {
      pending: {
        icon: Clock,
        color: "bg-gray-100 text-gray-700",
        label: "Pending",
      },
      "in-review": {
        icon: FileText,
        color: "bg-blue-100 text-blue-700",
        label: "In Review",
      },
      interview: {
        icon: CheckCircle,
        color: "bg-purple-100 text-purple-700",
        label: "Interview",
      },
      accepted: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-700",
        label: "Accepted",
      },
      rejected: {
        icon: XCircle,
        color: "bg-red-100 text-red-700",
        label: "Rejected",
      },
    };
    return configs[status] || configs.pending;
  };

  const filterByStatus = (status?: string) => {
    if (!status) return applications;
    return applications.filter(app => app.status === status);
  };

  const getStatusCount = (status: string) => {
    return applications.filter(app => app.status === status).length;
  };

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/student" className="flex items-center gap-2 hover:text-blue-600">
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
          <h1 className="text-3xl mb-2">My Applications</h1>
          <p className="text-gray-600">Track the status of your job applications</p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="grid gap-4 md:grid-cols-5 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <MotionCard variants={itemVariants}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-1">{applications.length}</div>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </CardContent>
          </MotionCard>
          <MotionCard variants={itemVariants}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl text-gray-600 mb-1">{getStatusCount("pending")}</div>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </MotionCard>
          <MotionCard variants={itemVariants}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl text-blue-600 mb-1">{getStatusCount("in-review")}</div>
                <p className="text-sm text-gray-600">In Review</p>
              </div>
            </CardContent>
          </MotionCard>
          <MotionCard variants={itemVariants}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl text-purple-600 mb-1">{getStatusCount("interview")}</div>
                <p className="text-sm text-gray-600">Interview</p>
              </div>
            </CardContent>
          </MotionCard>
          <MotionCard variants={itemVariants}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl text-green-600 mb-1">{getStatusCount("accepted")}</div>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
            </CardContent>
          </MotionCard>
        </motion.div>

        {/* Applications Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-review">In Review</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {["all", "pending", "in-review", "interview", "accepted", "rejected"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                <AnimatePresence>
                  {(tab === "all" ? applications : filterByStatus(tab)).length === 0 ? (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card>
                        <CardContent className="py-12 text-center">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No applications found</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    (tab === "all" ? applications : filterByStatus(tab)).map((app) => {
                      const statusConfig = getStatusConfig(app.status);
                      const StatusIcon = statusConfig.icon;

                      return (
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
                              {/* Job Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <div className="flex-1">
                                    <h3 className="text-lg mb-1">{app.jobTitle}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <Building className="h-4 w-4" />
                                        {app.company}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {app.location}
                                      </span>
                                    </div>
                                  </div>
                                  <Badge className={statusConfig.color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig.label}
                                  </Badge>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>Match Score: {app.matchScore}%</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <span className="text-gray-700">{app.lastUpdate}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-2 lg:w-48">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Job
                                </Button>
                                {app.status === "interview" && (
                                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                                    View Details
                                  </Button>
                                )}
                                {app.status === "accepted" && (
                                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                                    View Offer
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </MotionCard>
                      );
                    })
                  )}
                </AnimatePresence>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Browse More Jobs CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl mb-2">Looking for More Opportunities?</h3>
              <p className="text-gray-600 mb-4">
                Browse our job listings and find positions that match your skills
              </p>
              <Button asChild>
                <Link href="/browse-jobs">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </PageTransition>
  );
}
