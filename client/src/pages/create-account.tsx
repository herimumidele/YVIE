import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import yvieLogoPath from "@assets/download (1)_1751149239584.png";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Get email from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to main auth since we're using Replit Auth
    // In a real implementation, this would create the account
    window.location.href = "/api/login";
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  const handleEditEmail = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <img src={yvieLogoPath} alt="YVIE AI Logo" className="h-16 w-auto" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-gray-400 text-sm">Set your password for to continue</p>
          </div>

          {/* Create Account Form */}
          <form onSubmit={handleCreateAccount} className="space-y-4">
            {/* Email Display */}
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 py-3 pr-16"
                placeholder="abcdefghij@xyz.com"
                required
              />
              <button
                type="button"
                onClick={handleEditEmail}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 text-sm"
              >
                Edit
              </button>
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 py-3 pr-12"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 mt-6"
            >
              Continue
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-gray-400 text-sm">Already have an account? </span>
            <button
              onClick={handleLoginRedirect}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Log in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}