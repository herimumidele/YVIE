import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileOverview() {
  const { user } = useAuth();
  const { data: userStats, isLoading } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
            <div className="mt-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <Avatar className="w-16 h-16 mx-auto">
            <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
            <AvatarFallback className="text-lg">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <h3 className="mt-3 font-semibold text-gray-900">
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user?.firstName || user?.email || "User"}
          </h3>
          <p className="text-sm text-gray-500">AI App Creator</p>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Apps Created</span>
            <span className="text-sm font-medium text-gray-900">
              {userStats?.appsCreated || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Downloads</span>
            <span className="text-sm font-medium text-gray-900">
              {userStats?.totalDownloads?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Community Rank</span>
            <span className="text-sm font-medium text-primary">
              #{userStats?.rank || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Credits Balance</span>
            <span className="text-sm font-medium text-green-600">
              ${userStats?.credits?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>
        <div className="mt-6">
          <Button className="w-full gradient-primary hover:gradient-primary-hover">
            Upgrade to Pro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
