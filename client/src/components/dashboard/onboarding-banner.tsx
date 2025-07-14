import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function OnboardingBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleStartTutorial = () => {
    // Here you would implement the tutorial logic
    console.log("Starting tutorial...");
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="mt-8 gradient-primary rounded-xl p-6 text-white relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={handleDismiss}
      >
        <X className="w-4 h-4" />
      </Button>
      <div className="flex items-center justify-between pr-8">
        <div>
          <h3 className="text-lg font-semibold">Ready to create your first AI app?</h3>
          <p className="text-indigo-100 mt-1">
            Follow our interactive tutorial to build and deploy your first application in minutes.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={handleDismiss}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            Maybe later
          </Button>
          <Button
            onClick={handleStartTutorial}
            className="bg-white text-primary hover:bg-gray-50"
          >
            Start Tutorial
          </Button>
        </div>
      </div>
    </div>
  );
}
