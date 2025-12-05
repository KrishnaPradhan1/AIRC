import { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, Search, Filter, MapPin, Briefcase, Clock, DollarSign, TrendingUp, Upload, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { getJobs, applyForJob } from "@/lib/api";
import { toast } from "sonner";
import { PageTransition, containerVariants, itemVariants } from "../ui/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  postedDate: string;
  matchScore: number;
  skills: string[];
  description: string;
  requirements: string;
}

const MotionCard = motion(Card);

export function BrowseJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      // Map API response to Job interface
      const mappedJobs = data.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company || "Unknown Company",
        location: job.location || "Remote",
        type: job.type || "Full-time",
        experience: job.experience || "Not specified",
        salary: job.salary || "Competitive",
        postedDate: job.created_at,
        matchScore: 0, // Placeholder, backend needs to calculate this
        skills: job.skills || [],
        description: job.description,
        requirements: job.requirements
      }));
      setJobs(mappedJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob || !resumeFile) {
      toast.error("Please select a resume file");
      return;
    }

    setIsSubmitting(true);
    try {
      await applyForJob(selectedJob.id, resumeFile);
      toast.success("Application submitted successfully!");
      setIsApplyModalOpen(false);
      setResumeFile(null);
    } catch (error: any) {
      console.error("Failed to submit application:", error);
      toast.error(error.response?.data?.error || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-gray-600";
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === "all" || job.type === filterType;

    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
          <h1 className="text-3xl mb-2">Browse Jobs</h1>
          <p className="text-gray-600">Find opportunities that match your skills and experience</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by job title, company, or skills..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found <span>{filteredJobs.length}</span> jobs matching your criteria
          </p>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filteredJobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10 text-gray-500"
                >
                  No jobs found matching your criteria.
                </motion.div>
              ) : (
                filteredJobs.map((job) => (
                  <MotionCard
                    key={job.id}
                    variants={itemVariants}
                    layout
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className={`cursor-pointer hover:shadow-lg transition-shadow ${selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="mb-1">{job.title}</CardTitle>
                          <CardDescription>{job.company}</CardDescription>
                        </div>
                        {/* Match score hidden for now as backend doesn't calculate it yet */}
                        {/* <div className={`text-right ${getMatchScoreColor(job.matchScore)}`}>
                          <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-xs">Match</span>
                          </div>
                          <div className="text-xl">{job.matchScore}%</div>
                          </div> */}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.experience}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>{job.salary}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.skills.length - 4} more
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex gap-2 pt-2">
                          <Button className="flex-1" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleApplyClick(job);
                          }}>
                            Apply Now
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </MotionCard>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Job Details Panel */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                {selectedJob ? (
                  <motion.div
                    key={selectedJob.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <CardTitle className="mb-2">{selectedJob.title}</CardTitle>
                            <CardDescription className="text-base">
                              {selectedJob.company}
                            </CardDescription>
                          </div>
                          {/* <div className={`text-center ${getMatchScoreColor(selectedJob.matchScore)}`}>
                            <div className="flex items-center gap-1 justify-center mb-1">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-xs">AI Match</span>
                            </div>
                            <div className="text-3xl">{selectedJob.matchScore}%</div>
                          </div> */}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{selectedJob.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-gray-500" />
                            <span>{selectedJob.type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{selectedJob.experience}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span>{selectedJob.salary}</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-3">Required Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-3">Job Description</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {selectedJob.description}
                          </p>
                        </div>

                        {/* <div>
                          <h3 className="mb-3">Why You're a Great Match</h3>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">
                              Based on your profile, our AI has identified strong alignment with this position. 
                              Your skills and experience closely match the requirements, giving you a {selectedJob.matchScore}% compatibility score.
                            </p>
                          </div>
                        </div> */}

                        <div className="space-y-2">
                          <Button className="w-full" onClick={() => handleApplyClick(selectedJob)}>Apply for This Position</Button>
                          <Button variant="outline" className="w-full">Save for Later</Button>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                          Posted {new Date(selectedJob.postedDate).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Card className="h-96 flex items-center justify-center">
                      <CardContent className="text-center">
                        <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Select a job to view details</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Upload your resume to apply for this position. Our AI will analyze your profile match.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="resume">Resume (PDF or DOCX)</Label>
              <Input id="resume" type="file" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
            </div>
            {resumeFile && (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {resumeFile.name}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitApplication} disabled={!resumeFile || isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
