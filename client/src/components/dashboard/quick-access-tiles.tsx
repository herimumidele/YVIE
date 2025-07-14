import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Rocket, Store, Users, TrendingUp, Plus } from "lucide-react";

export default function QuickAccessTiles() {
  const [, setLocation] = useLocation();

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const { data: communityPosts } = useQuery({
    queryKey: ["/api/community/posts"],
  });

  const tiles = [
    {
      title: "Create App",
      subtitle: "Build new AI app",
      icon: Plus,
      bgColor: "bg-slate-700/30 border border-slate-600/50 backdrop-blur-lg",
      iconColor: "text-slate-300",
      glowColor: "shadow-slate-500/20",
      onClick: () => setLocation("/create-app"),
    },
    {
      title: "My Apps",
      subtitle: `${userStats?.appsCreated || 0} apps`,
      icon: Rocket,
      bgColor: "bg-slate-700/30 border border-slate-600/50 backdrop-blur-lg",
      iconColor: "text-slate-300",
      glowColor: "shadow-slate-500/20",
      onClick: () => setLocation("/my-apps"),
    },
    {
      title: "Marketplace",
      subtitle: "Explore apps",
      icon: Store,
      bgColor: "bg-slate-700/30 border border-slate-600/50 backdrop-blur-lg",
      iconColor: "text-slate-300",
      glowColor: "shadow-slate-500/20",
      onClick: () => setLocation("/marketplace"),
    },
    {
      title: "Community",
      subtitle: `${communityPosts?.length || 0} discussions`,
      icon: Users,
      bgColor: "bg-slate-700/30 border border-slate-600/50 backdrop-blur-lg",
      iconColor: "text-slate-300",
      glowColor: "shadow-slate-500/20",
      onClick: () => setLocation("/community"),
    },
    {
      title: "Analytics",
      subtitle: `${userStats?.totalDownloads || 0} downloads`,
      icon: TrendingUp,
      bgColor: "bg-slate-700/30 border border-slate-600/50 backdrop-blur-lg",
      iconColor: "text-slate-300",
      glowColor: "shadow-slate-500/20",
      onClick: () => {},
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <div
            key={tile.title}
            className={`${tile.bgColor} rounded-xl p-6 hover:shadow-xl hover:shadow-lg ${tile.glowColor} transition-all duration-300 cursor-pointer transform hover:scale-105 hover:rotate-1 group relative overflow-hidden`}
            onClick={tile.onClick}
          >
            {/* Futuristic glowing border animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="flex items-center relative z-10">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-black/20 backdrop-blur-sm border border-white/10`}>
                <Icon className={`${tile.iconColor} w-6 h-6 drop-shadow-lg`} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white font-poppins tracking-wide">{tile.title}</h3>
                <p className="text-sm text-gray-300 font-roboto">{tile.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
