import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function WelcomeSection() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mb-8 relative">
      {/* Futuristic background glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-purple-500/10 rounded-2xl blur-xl"></div>
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-gradient-to-br from-gray-900/30 to-black/30 border border-gray-700/30 backdrop-blur-xl rounded-2xl">
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent font-poppins tracking-wide">
            {getGreeting()}, {user?.firstName || "there"}!
          </h1>
          <div className="mt-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <p className="text-gray-300 font-roboto">Ready to build something amazing today?</p>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          </div>
          
          {/* Holographic scan line effect */}
          <div className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full animate-pulse"></div>
        </div>
        
        <div className="mt-6 md:mt-0 relative">
          <Button 
            onClick={() => setLocation("/create-app")}
            className="bg-gray-900 hover:bg-gray-800 text-white flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-700 relative overflow-hidden group"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10 font-medium">Create New App</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
