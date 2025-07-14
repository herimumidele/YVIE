import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, FileText, Image, TrendingUp, Star } from "lucide-react";

export default function AITemplates() {
  const [, setLocation] = useLocation();
  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates/popular"],
  });

  const getTemplateIcon = (category: string) => {
    switch (category) {
      case "chatbot":
        return Bot;
      case "text":
        return FileText;
      case "image":
        return Image;
      case "analytics":
        return TrendingUp;
      default:
        return Bot;
    }
  };

  const getIconColor = (category: string) => {
    switch (category) {
      case "chatbot":
        return "text-gray-700 bg-gray-100/80 border-gray-200/50";
      case "text":
        return "text-gray-700 bg-gray-100/80 border-gray-200/50";
      case "image":
        return "text-gray-700 bg-gray-100/80 border-gray-200/50";
      case "analytics":
        return "text-gray-700 bg-gray-100/80 border-gray-200/50";
      default:
        return "text-gray-700 bg-gray-100/80 border-gray-200/50";
    }
  };

  const handleUseTemplate = (templateId: number) => {
    setLocation(`/create-app?template=${templateId}`);
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/40 to-black/40 border border-gray-700/50 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white font-poppins bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Popular AI Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-700/30 rounded-lg p-4 animate-pulse bg-gray-800/30 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-700/50 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700/50 rounded w-full"></div>
                    <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-lg hover:border-slate-600/50 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-200 font-poppins">
            Popular AI Templates
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/marketplace")}
            className="text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 border border-slate-600/50"
          >
            Browse all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates?.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-400">No templates available</p>
            </div>
          ) : (
            templates?.map((template: any) => {
              const Icon = getTemplateIcon(template.category);
              const iconClasses = getIconColor(template.category);
              
              return (
                <div
                  key={template.id}
                  className="border border-gray-200/50 rounded-lg p-4 hover:border-gray-300/70 hover:shadow-lg hover:shadow-gray-200/25 transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm hover:scale-102 transform"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 ${iconClasses} rounded-lg flex items-center justify-center flex-shrink-0 border backdrop-blur-sm group-hover:shadow-lg transition-all duration-300`}>
                      <Icon className={`${iconClasses.split(' ')[0]} w-5 h-5 group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm font-poppins group-hover:text-cyan-300 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 font-roboto">
                        {template.description}
                      </p>
                      <div className="flex items-center mt-2 space-x-3">
                        <span className="text-xs text-gray-500">
                          Used {template.usage || 0} times
                        </span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500 ml-1">
                            {template.rating?.toFixed(1) || "New"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
