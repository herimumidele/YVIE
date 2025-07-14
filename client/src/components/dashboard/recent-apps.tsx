import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Bot, FileText, BarChart3, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function RecentApps() {
  const [, setLocation] = useLocation();
  const { data: apps, isLoading } = useQuery({
    queryKey: ["/api/apps"],
  });

  const getAppIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("bot") || lowerName.includes("chat")) return Bot;
    if (lowerName.includes("text") || lowerName.includes("summary")) return FileText;
    if (lowerName.includes("analytics") || lowerName.includes("chart")) return BarChart3;
    return Zap;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/40 to-black/40 border border-gray-700/50 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white font-poppins">Recent Apps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-4">
                <div className="w-12 h-12 bg-gray-700/50 rounded-lg backdrop-blur-sm"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded w-1/3 backdrop-blur-sm"></div>
                  <div className="h-3 bg-gray-700/50 rounded w-1/2 backdrop-blur-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentApps = apps?.slice(0, 3) || [];

  return (
    <Card className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-lg hover:border-slate-600/50 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-200 font-poppins">
            Recent Apps
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/my-apps")}
            className="text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 border border-slate-600/50"
          >
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentApps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No apps created yet</p>
            <Button 
              onClick={() => setLocation("/create-app")} 
              className="mt-4 bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
            >
              Create Your First App
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentApps.map((app: any) => {
              const Icon = getAppIcon(app.name);
              return (
                <div 
                  key={app.id} 
                  className="flex items-center justify-between py-4 border-b border-slate-700/30 last:border-b-0 group hover:bg-slate-700/20 rounded-lg px-2 transition-all duration-300 cursor-pointer"
                  onClick={() => setLocation(`/create-app/${app.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-700/30 border border-slate-600/50 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-slate-500/25 transition-all duration-300">
                      <Icon className="w-6 h-6 text-slate-300 group-hover:text-slate-100" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200 font-poppins group-hover:text-slate-100 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Updated {new Date(app.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(app.status)} backdrop-blur-sm`}>
                      {app.status}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(`/create-app/${app.id}`);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
