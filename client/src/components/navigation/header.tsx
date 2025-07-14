import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import yvieLogoPath from "@assets/download (1)_1751149239584.png";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  const navItems = [
    { name: "Dashboard", href: "/", active: location === "/" },
    { name: "Create App", href: "/create-app", active: location === "/create-app" || location.startsWith("/create-app/") },
    { name: "Marketplace", href: "/marketplace", active: location === "/marketplace" },
    { name: "Community", href: "/community", active: location === "/community" },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center cursor-pointer" onClick={() => setLocation("/")}>
                <img src={yvieLogoPath} alt="YVIE AI" className="h-10 w-auto" />
              </div>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setLocation(item.href)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    item.active
                      ? "text-white border-b-2 border-blue-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative text-gray-300 hover:text-white">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-blue-600">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 text-gray-300 hover:text-white">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                    <AvatarFallback className="bg-gray-700 text-white">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-300 hidden sm:block">
                    {user?.firstName || user?.email || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                <DropdownMenuItem onClick={() => setLocation("/my-apps")} className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <User className="w-4 h-4 mr-2" />
                  My Apps
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/settings")} className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={handleLogout} className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
