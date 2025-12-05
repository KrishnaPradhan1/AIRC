import { Sparkles, Home } from "lucide-react";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-12 w-12 text-blue-600" />
        </div>
        <h1 className="text-6xl mb-4 text-gray-900">404</h1>
        <p className="text-xl mb-2 text-gray-700">Page Not Found</p>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <a href="/" className="inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </a>
        </Button>
      </div>
    </div>
  );
}
