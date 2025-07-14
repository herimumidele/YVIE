import { useLocation } from "wouter";
import { Home, Plus, Store, Users, User } from "lucide-react";

export default function MobileNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Create", href: "/create", icon: Plus },
    { name: "Market", href: "/marketplace", icon: Store },
    { name: "Community", href: "/community", icon: Users },
    { name: "Profile", href: "/my-apps", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <button
              key={item.name}
              onClick={() => setLocation(item.href)}
              className={`flex flex-col items-center py-2 px-1 transition-colors ${
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
