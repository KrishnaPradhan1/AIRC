import { useState } from "react";
import { Sparkles, ArrowLeft, Search, Filter, MapPin, Briefcase, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp Inc.",
    location: "Remote",
    type: "Full-time",
    experience: "5-10 years",
    salary: "$120,000 - $160,000",
    postedDate: "2024-11-26",
    matchScore: 95,
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    description: "We are looking for a talented Senior Software Engineer to join our growing team...",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Data Solutions Ltd.",
    location: "Hybrid - New York",
    type: "Full-time",
    experience: "2-5 years",
    salary: "$80,000 - $110,000",
    postedDate: "2024-11-25",
    matchScore: 88,
    skills: ["Python", "SQL", "Tableau", "Statistics"],
    description: "Join our data analytics team and work on cutting-edge projects...",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "Design Studio Co.",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "3-5 years",
    salary: "$100,000 - $140,000",
    postedDate: "2024-11-24",
    matchScore: 82,
    skills: ["React", "CSS", "JavaScript", "UI/UX"],
    description: "Create beautiful and responsive user interfaces for our clients...",
  },
  {
    id: 4,
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Remote",
    type: "Full-time",
    experience: "3-7 years",
    salary: "$130,000 - $180,000",
    postedDate: "2024-11-23",
    matchScore: 78,
    skills: ["Python", "TensorFlow", "PyTorch", "ML"],
    description: "Build and deploy machine learning models at scale...",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Cloud Systems Inc.",
    location: "Austin, TX",
    type: "Full-time",
    experience: "4-8 years",
    salary: "$110,000 - $150,000",
    postedDate: "2024-11-22",
    matchScore: 75,
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    description: "Help us build and maintain robust cloud infrastructure...",
  },
  {
    id: 6,
    title: "Product Manager",
    company: "Startup Ventures",
    location: "Remote",
    type: "Full-time",
    experience: "5-8 years",
    salary: "$120,000 - $160,000",
    postedDate: "2024-11-21",
    matchScore: 70,
    skills: ["Product Strategy", "Agile", "Analytics", "Communication"],
    description: "Lead product development and strategy for our innovative platform...",
  },
];

export function BrowseJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-gray-600";
  };

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || job.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/student-dashboard" className="flex items-center gap-2 hover:text-blue-600">
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
          <h1 className="text-3xl mb-2">Browse Jobs</h1>
          <p className="text-gray-600">Find opportunities that match your skills and experience</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
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

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found <span>{filteredJobs.length}</span> jobs matching your criteria
          </p>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card 
                key={job.id} 
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="mb-1">{job.title}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </div>
                    <div className={`text-right ${getMatchScoreColor(job.matchScore)}`}>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs">Match</span>
                      </div>
                      <div className="text-xl">{job.matchScore}%</div>
                    </div>
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
                      <Button className="flex-1" size="sm">
                        Apply Now
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Job Details Panel */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {selectedJob ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="mb-2">{selectedJob.title}</CardTitle>
                        <CardDescription className="text-base">
                          {selectedJob.company}
                        </CardDescription>
                      </div>
                      <div className={`text-center ${getMatchScoreColor(selectedJob.matchScore)}`}>
                        <div className="flex items-center gap-1 justify-center mb-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs">AI Match</span>
                        </div>
                        <div className="text-3xl">{selectedJob.matchScore}%</div>
                      </div>
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

                    <div>
                      <h3 className="mb-3">Why You're a Great Match</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">
                          Based on your profile, our AI has identified strong alignment with this position. 
                          Your skills and experience closely match the requirements, giving you a {selectedJob.matchScore}% compatibility score.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full">Apply for This Position</Button>
                      <Button variant="outline" className="w-full">Save for Later</Button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                      Posted {new Date(selectedJob.postedDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <CardContent className="text-center">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a job to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
