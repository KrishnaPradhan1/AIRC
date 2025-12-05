import { useState, useRef } from "react";
import { Sparkles, ArrowLeft, Upload, FileText, CheckCircle, TrendingUp, Briefcase, Award, Target } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

interface AnalysisResult {
  category: string;
  confidence: number;
  skills: string[];
  experience: string;
  education: string;
  strengths: string[];
  suggestions: string[];
  matchedJobs: Array<{
    title: string;
    company: string;
    matchScore: number;
  }>;
}

export function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === "application/pdf" || 
        file.type === "application/msword" || 
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      setFile(file);
    } else {
      alert("Please upload a PDF or Word document");
    }
  };

  const analyzeResume = () => {
    if (!file) return;

    setIsAnalyzing(true);

    // Simulate AI analysis (replace with actual API call to Flask backend)
    setTimeout(() => {
      setAnalysisResult({
        category: "Software Engineering",
        confidence: 92,
        skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "MongoDB", "Git"],
        experience: "5 years",
        education: "Bachelor's in Computer Science",
        strengths: [
          "Strong technical skills in modern web frameworks",
          "Experience with cloud infrastructure and DevOps",
          "Full-stack development capabilities",
          "Good educational background in CS"
        ],
        suggestions: [
          "Consider adding certifications in cloud platforms (AWS/Azure)",
          "Highlight specific project outcomes and metrics",
          "Add more details about leadership and team collaboration",
          "Include links to portfolio or GitHub projects"
        ],
        matchedJobs: [
          { title: "Senior Software Engineer", company: "Tech Corp Inc.", matchScore: 95 },
          { title: "Full Stack Developer", company: "Startup Ventures", matchScore: 88 },
          { title: "Cloud Engineer", company: "Cloud Systems Inc.", matchScore: 82 }
        ]
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const resetUpload = () => {
    setFile(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Resume Analysis</h1>
            <p className="text-gray-600">Upload your resume and get AI-powered insights and job matches</p>
          </div>

          {!analysisResult ? (
            <>
              {/* Upload Section */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Upload Your Resume</CardTitle>
                  <CardDescription>
                    Upload a PDF or Word document (Max 5MB). Our AI will analyze your skills, experience, and match you with relevant jobs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      className="hidden"
                    />

                    {!file ? (
                      <div className="space-y-4">
                        <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg mb-2">
                            Drag and drop your resume here, or{" "}
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="text-blue-600 hover:underline"
                            >
                              browse
                            </button>
                          </p>
                          <p className="text-sm text-gray-500">
                            Supported formats: PDF, DOC, DOCX
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                        <div>
                          <p className="text-lg mb-1">File Selected</p>
                          <p className="text-sm text-gray-600">{file.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Button onClick={resetUpload} variant="outline">
                            Change File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {file && (
                    <div className="mt-6">
                      <Button
                        onClick={analyzeResume}
                        disabled={isAnalyzing}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing Resume...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Analyze with AI
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* What We Analyze */}
              <Card>
                <CardHeader>
                  <CardTitle>What We Analyze</CardTitle>
                  <CardDescription>Our AI examines multiple aspects of your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Award className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1">Skills & Expertise</h3>
                        <p className="text-sm text-gray-600">
                          Identifies your technical and soft skills
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1">Experience Level</h3>
                        <p className="text-sm text-gray-600">
                          Analyzes your work history and expertise
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Target className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1">Job Matching</h3>
                        <p className="text-sm text-gray-600">
                          Finds jobs that match your profile
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-yellow-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1">Improvement Tips</h3>
                        <p className="text-sm text-gray-600">
                          Provides suggestions to enhance your resume
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Analysis Results */
            <div className="space-y-6">
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Analysis Complete!</CardTitle>
                      <CardDescription>Your resume has been successfully analyzed</CardDescription>
                    </div>
                    <Button onClick={resetUpload} variant="outline">
                      Upload New Resume
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Classification</p>
                      <p className="text-2xl mb-1">{analysisResult.category}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={analysisResult.confidence} className="flex-1" />
                        <span className="text-sm">{analysisResult.confidence}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Confidence Score</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Experience</p>
                        <p>{analysisResult.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Education</p>
                        <p className="text-sm">{analysisResult.education}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Identified Skills</CardTitle>
                  <CardDescription>Skills extracted from your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Suggestions */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <span className="text-green-600 flex-shrink-0">✓</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <span className="text-blue-600 flex-shrink-0">→</span>
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Matched Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Job Matches</CardTitle>
                  <CardDescription>Jobs that align with your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.matchedJobs.map((job, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <p className="mb-1">{job.title}</p>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-2xl text-green-600">{job.matchScore}%</p>
                          <p className="text-xs text-gray-500">Match</p>
                        </div>
                        <Button size="sm">View Job</Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/browse-jobs">Browse All Jobs</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
