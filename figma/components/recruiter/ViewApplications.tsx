import { useState } from "react";
import { Sparkles, ArrowLeft, Search, Filter, Download, Star, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface Application {
  id: number;
  name: string;
  email: string;
  jobTitle: string;
  appliedDate: string;
  matchScore: number;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  skills: string[];
  experience: string;
}

const mockApplications: Application[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    jobTitle: "Senior Software Engineer",
    appliedDate: "2024-11-25",
    matchScore: 92,
    status: "pending",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    experience: "5 years",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    jobTitle: "Senior Software Engineer",
    appliedDate: "2024-11-24",
    matchScore: 88,
    status: "shortlisted",
    skills: ["React", "Python", "Docker", "MongoDB"],
    experience: "6 years",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@email.com",
    jobTitle: "Data Analyst",
    appliedDate: "2024-11-23",
    matchScore: 85,
    status: "reviewed",
    skills: ["Python", "SQL", "Tableau", "Statistics"],
    experience: "3 years",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    jobTitle: "Senior Software Engineer",
    appliedDate: "2024-11-22",
    matchScore: 78,
    status: "pending",
    skills: ["Java", "Spring Boot", "MySQL"],
    experience: "4 years",
  },
];

export function ViewApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

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

  const updateStatus = (id: number, status: Application["status"]) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  };

  const filterByStatus = (status?: string) => {
    if (!status) return applications;
    return applications.filter(app => app.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/recruiter-dashboard" className="flex items-center gap-2 hover:text-blue-600">
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </a>
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
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Applications & Candidates</h1>
          <p className="text-gray-600">Review and manage candidate applications</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or job title..."
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
              {(tab === "all" ? applications : filterByStatus(tab)).map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
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
                            <div className="flex flex-wrap gap-2 mb-3">
                              {app.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">
                              Experience: {app.experience} • Applied on {new Date(app.appliedDate).toLocaleDateString()}
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
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Detailed View Modal Placeholder */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{selectedApp.name}</CardTitle>
                <CardDescription>{selectedApp.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2">AI Analysis</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm mb-2">
                        <strong>Match Score: {selectedApp.matchScore}%</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        This candidate shows strong alignment with the job requirements based on skills, 
                        experience, and qualifications.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => setSelectedApp(null)}>Close</Button>
                    <Button className="flex-1" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
