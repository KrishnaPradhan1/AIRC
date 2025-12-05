import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { RecruiterLogin } from "./components/auth/RecruiterLogin";
import { RecruiterSignup } from "./components/auth/RecruiterSignup";
import { StudentLogin } from "./components/auth/StudentLogin";
import { StudentSignup } from "./components/auth/StudentSignup";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { RecruiterDashboard } from "./components/dashboards/RecruiterDashboard";
import { StudentDashboard } from "./components/dashboards/StudentDashboard";
import { PostJob } from "./components/recruiter/PostJob";
import { ViewApplications } from "./components/recruiter/ViewApplications";
import { ManageJobs } from "./components/recruiter/ManageJobs";
import { BrowseJobs } from "./components/student/BrowseJobs";
import { UploadResume } from "./components/student/UploadResume";
import { MyApplications } from "./components/student/MyApplications";
import { Profile } from "./components/shared/Profile";
import { Settings } from "./components/shared/Settings";
import { NotFound } from "./components/NotFound";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Simple router - listen for popstate (back/forward browser buttons)
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor && anchor.href) {
        const url = new URL(anchor.href);
        // Only handle internal links
        if (url.origin === window.location.origin && !anchor.target) {
          e.preventDefault();
          const path = url.pathname;
          window.history.pushState({}, "", path);
          setCurrentPath(path);
          window.scrollTo(0, 0);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Route matching
  const routes: Record<string, JSX.Element> = {
    "/": <LandingPage />,
    "/recruiter-login": <RecruiterLogin />,
    "/recruiter-signup": <RecruiterSignup />,
    "/recruiter-dashboard": <RecruiterDashboard />,
    "/post-job": <PostJob />,
    "/view-applications": <ViewApplications />,
    "/manage-jobs": <ManageJobs />,
    "/recruiter-profile": <Profile userType="recruiter" />,
    "/recruiter-settings": <Settings userType="recruiter" />,
    "/student-login": <StudentLogin />,
    "/student-signup": <StudentSignup />,
    "/student-dashboard": <StudentDashboard />,
    "/browse-jobs": <BrowseJobs />,
    "/upload-resume": <UploadResume />,
    "/my-applications": <MyApplications />,
    "/student-profile": <Profile userType="student" />,
    "/student-settings": <Settings userType="student" />,
    "/forgot-password": <ForgotPassword />,
  };

  return routes[currentPath] || <NotFound />;
}
