import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CommunityHighlights() {
  const [, setLocation] = useLocation();
  const { data: highlights, isLoading } = useQuery({
    queryKey: ["/api/community/highlights"],
  });

  const getBorderColor = (index: number) => {
    const colors = ["border-primary", "border-green-500", "border-purple-500", "border-yellow-500"];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-l-4 border-gray-200 pl-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        {highlights?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No community highlights yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {highlights?.slice(0, 3).map((highlight: any, index: number) => (
              <div key={highlight.id} className={`border-l-4 ${getBorderColor(index)} pl-4 cursor-pointer hover:bg-gray-50 rounded-r-lg transition-colors`}>
                <h4 className="font-medium text-gray-900 text-sm">{highlight.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  by User • {highlight.replies || 0} replies
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 pt-4 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={() => setLocation("/community")}
          >
            Join discussions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
