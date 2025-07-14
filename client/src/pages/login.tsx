import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import yvieLogoPath from "@assets/download (1)_1751149239584.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to Replit auth since we're using that system
    window.location.href = "/api/login";
  };

  const handleSignUpRedirect = () => {
    // Navigate to sign up page
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

          {/* Welcome Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome</h1>
            <p className="text-gray-400 text-sm">Log in to continue</p>
          </div>

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full mb-6 bg-white text-black border-gray-300 hover:bg-gray-100 py-3"
          >
            <FaGoogle className="mr-3 w-4 h-4" />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <Separator className="bg-gray-600" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-3">
              <span className="text-gray-400 text-sm">OR</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 py-3"
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 py-3 pr-12"
                required
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

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-gray-400 text-sm">Don't have an account? </span>
            <button
              onClick={handleSignUpRedirect}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}