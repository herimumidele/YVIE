import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPanel() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "app_review":
        return "bg-blue-500";
      case "community_follow":
        return "bg-green-500";
      case "revenue":
        return "bg-yellow-500";
      case "system":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-slate-200">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-2 h-2 bg-slate-700/50 rounded-full mt-2"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700/50 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentNotifications = notifications?.slice(0, 4) || [];

  return (
    <Card className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-200">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentNotifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentNotifications.map((notification: any) => (
              <div key={notification.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 ${getNotificationColor(notification.type)} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">{notification.message}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">New</Badge>
                )}
              </div>
            ))}
          </div>
        )}
        {recentNotifications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <Button variant="ghost" size="sm" className="w-full text-slate-400 hover:text-slate-300 hover:bg-slate-700/50">
              View all notifications
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
