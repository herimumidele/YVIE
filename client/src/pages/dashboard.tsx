import Header from "@/components/navigation/header";
import MobileNav from "@/components/navigation/mobile-nav";
import WelcomeSection from "@/components/dashboard/welcome-section";
import QuickAccessTiles from "@/components/dashboard/quick-access-tiles";
import RecentApps from "@/components/dashboard/recent-apps";
import AITemplates from "@/components/dashboard/ai-templates";
import NotificationsPanel from "@/components/dashboard/notifications-panel";
import ProfileOverview from "@/components/dashboard/profile-overview";
import CommunityHighlights from "@/components/dashboard/community-highlights";
import OnboardingBanner from "@/components/dashboard/onboarding-banner";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header />
      
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="px-4 py-6 space-y-6">
          <WelcomeSection />
          <QuickAccessTiles />
          <div className="space-y-6">
            <RecentApps />
            <AITemplates />
            <NotificationsPanel />
            <ProfileOverview />
            <CommunityHighlights />
          </div>
          <OnboardingBanner />
        </div>
        <MobileNav />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <WelcomeSection />
          <QuickAccessTiles />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <RecentApps />
              <AITemplates />
            </div>
            
            <div className="space-y-6">
              <NotificationsPanel />
              <ProfileOverview />
              <CommunityHighlights />
            </div>
          </div>
          
          <OnboardingBanner />
        </div>
      </div>
    </div>
  );
}
