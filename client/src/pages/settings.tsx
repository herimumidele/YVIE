import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Eye, 
  EyeOff, 
  Save, 
  Upload,
  Trash2,
  Shield,
  Globe,
  Moon,
  Sun,
  Palette,
  Settings as SettingsIcon
} from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  weeklyDigest: z.boolean(),
  appUpdates: z.boolean(),
  communityActivity: z.boolean(),
});

const privacySchema = z.object({
  profileVisibility: z.enum(["public", "private", "friends"]),
  showEmail: z.boolean(),
  showApps: z.boolean(),
  allowMessages: z.boolean(),
  dataSharing: z.boolean(),
});

const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.enum(["en", "es", "fr", "de", "ja", "zh"]),
  timezone: z.string(),
  compactMode: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;
type PrivacyFormData = z.infer<typeof privacySchema>;
type AppearanceFormData = z.infer<typeof appearanceSchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Forms
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: "",
      website: "",
      location: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      weeklyDigest: true,
      appUpdates: true,
      communityActivity: false,
    },
  });

  const privacyForm = useForm<PrivacyFormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      profileVisibility: "public",
      showEmail: false,
      showApps: true,
      allowMessages: true,
      dataSharing: false,
    },
  });

  const appearanceForm = useForm<AppearanceFormData>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: "dark",
      language: "en",
      timezone: "UTC",
      compactMode: false,
    },
  });

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await apiRequest("PUT", "/api/users/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Profile updated successfully!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      const res = await apiRequest("PUT", "/api/users/password", data);
      return await res.json();
    },
    onSuccess: () => {
      passwordForm.reset();
      toast({ title: "Password updated successfully!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: NotificationFormData) => {
      const res = await apiRequest("PUT", "/api/users/notifications", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Notification preferences updated!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update notifications",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePrivacyMutation = useMutation({
    mutationFn: async (data: PrivacyFormData) => {
      const res = await apiRequest("PUT", "/api/users/privacy", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Privacy settings updated!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update privacy settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAppearanceMutation = useMutation({
    mutationFn: async (data: AppearanceFormData) => {
      const res = await apiRequest("PUT", "/api/users/appearance", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Appearance settings updated!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update appearance",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/users/account");
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Account deleted successfully" });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const renderProfileTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={profileForm.handleSubmit((data) => updateProfileMutation.mutate(data))} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-slate-500" />
              )}
            </div>
            <div className="space-y-2">
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-sm text-slate-500">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...profileForm.register("firstName")}
                className="bg-slate-50 dark:bg-slate-800"
              />
              {profileForm.formState.errors.firstName && (
                <p className="text-sm text-red-500">{profileForm.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...profileForm.register("lastName")}
                className="bg-slate-50 dark:bg-slate-800"
              />
              {profileForm.formState.errors.lastName && (
                <p className="text-sm text-red-500">{profileForm.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                {...profileForm.register("email")}
                className="pl-10 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            {profileForm.formState.errors.email && (
              <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              {...profileForm.register("bio")}
              className="bg-slate-50 dark:bg-slate-800"
              rows={4}
            />
            {profileForm.formState.errors.bio && (
              <p className="text-sm text-red-500">{profileForm.formState.errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://your-website.com"
              {...profileForm.register("website")}
              className="bg-slate-50 dark:bg-slate-800"
            />
            {profileForm.formState.errors.website && (
              <p className="text-sm text-red-500">{profileForm.formState.errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, Country"
              {...profileForm.register("location")}
              className="bg-slate-50 dark:bg-slate-800"
            />
            {profileForm.formState.errors.location && (
              <p className="text-sm text-red-500">{profileForm.formState.errors.location.message}</p>
            )}
          </div>

          <Button type="submit" disabled={updateProfileMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit((data) => updatePasswordMutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  {...passwordForm.register("currentPassword")}
                  className="pl-10 pr-10 bg-slate-50 dark:bg-slate-800"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  {...passwordForm.register("newPassword")}
                  className="pl-10 pr-10 bg-slate-50 dark:bg-slate-800"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...passwordForm.register("confirmPassword")}
                  className="pl-10 pr-10 bg-slate-50 dark:bg-slate-800"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={updatePasswordMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Delete Account</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  deleteAccountMutation.mutate();
                }
              }}
              disabled={deleteAccountMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={notificationForm.handleSubmit((data) => updateNotificationsMutation.mutate(data))} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Receive notifications via email
                </p>
              </div>
              <Switch {...notificationForm.register("emailNotifications")} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch {...notificationForm.register("pushNotifications")} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Receive updates about new features and promotions
                </p>
              </div>
              <Switch {...notificationForm.register("marketingEmails")} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Digest</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get a weekly summary of your activity
                </p>
              </div>
              <Switch {...notificationForm.register("weeklyDigest")} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>App Updates</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Notifications when your apps are updated or deployed
                </p>
              </div>
              <Switch {...notificationForm.register("appUpdates")} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Community Activity</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Notifications about community posts and comments
                </p>
              </div>
              <Switch {...notificationForm.register("communityActivity")} />
            </div>
          </div>

          <Button type="submit" disabled={updateNotificationsMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateNotificationsMutation.isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderPrivacyTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={privacyForm.handleSubmit((data) => updatePrivacyMutation.mutate(data))} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Visibility</Label>
              <Select {...privacyForm.register("profileVisibility")}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                  <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                  <SelectItem value="friends">Friends - Only people you follow can see</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Email Address</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Display your email address on your public profile
                </p>
              </div>
              <Switch {...privacyForm.register("showEmail")} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Created Apps</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Display your created apps on your profile
                </p>
              </div>
              <Switch {...privacyForm.register("showApps")} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Messages</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Allow other users to send you direct messages
                </p>
              </div>
              <Switch {...privacyForm.register("allowMessages")} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Data Sharing</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Share anonymized usage data to help improve YVIE AI
                </p>
              </div>
              <Switch {...privacyForm.register("dataSharing")} />
            </div>
          </div>

          <Button type="submit" disabled={updatePrivacyMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updatePrivacyMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderAppearanceTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance & Language
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={appearanceForm.handleSubmit((data) => updateAppearanceMutation.mutate(data))} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select {...appearanceForm.register("theme")}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <SettingsIcon className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select {...appearanceForm.register("language")}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select {...appearanceForm.register("timezone")}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Use a more compact layout with less spacing
                </p>
              </div>
              <Switch {...appearanceForm.register("compactMode")} />
            </div>
          </div>

          <Button type="submit" disabled={updateAppearanceMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateAppearanceMutation.isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "privacy" && renderPrivacyTab()}
            {activeTab === "appearance" && renderAppearanceTab()}
          </div>
        </div>
      </div>
    </div>
  );
}