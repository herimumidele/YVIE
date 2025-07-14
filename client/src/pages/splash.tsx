import { useEffect } from "react";
import yvieLogoPath from "@assets/IMG-20250627-WA0001_1751026408893.jpg";

export default function Splash() {
  useEffect(() => {
    // Auto-redirect to main app after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8 animate-pulse">
          <img 
            src={yvieLogoPath} 
            alt="YVIE AI Welcome Screen" 
            className="w-80 h-auto mx-auto mb-4 rounded-lg" 
          />
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>

        {/* Version Info */}
        <div className="mt-12 text-gray-600 text-sm">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}