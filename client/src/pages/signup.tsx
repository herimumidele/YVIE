import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaGoogle } from "react-icons/fa";
import yvieLogoPath from "@assets/download (1)_1751149239584.png";

export default function SignUp() {
  const [email, setEmail] = useState("");

  const handleGoogleSignUp = () => {
    window.location.href = "/api/login";
  };

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to create account page with email
    // In a real implementation, this would send verification email
    window.location.href = `/create-account?email=${encodeURIComponent(email)}`;
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login";
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
            <p className="text-gray-400 text-sm">Sign up to continue</p>
          </div>

          {/* Google Sign Up Button */}
          <Button
            onClick={handleGoogleSignUp}
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

          {/* Email Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
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