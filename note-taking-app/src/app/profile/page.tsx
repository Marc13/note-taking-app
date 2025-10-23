"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save,
  X,
  Camera,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  // const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Dialog states
  const [emailNotificationsOpen, setEmailNotificationsOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [disableTwoFactorOpen, setDisableTwoFactorOpen] = useState(false);
  
  // Email notification preferences
  const [emailPreferences, setEmailPreferences] = useState({
    taskUpdates: true,
    noteUpdates: true,
    projectDeadlines: true,
    weeklyDigest: false,
  });
  
  // Password change fields
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // 2FA state and code
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");

  // User profile data (in a real app, this would come from a database/API)
  const [profile, setProfile] = useState({
    name: "Marcia Parker",
    email: "parkermarcia615@gmail.com",
    bio: "Trainer, passionate learner. Spreading value and inspiring people to achieve their dream.",
    role: "Content Creator",
    joinDate: "October 2024",
    location: "United States",
    website: "https://teaching4joy.com",
    twitter: "@Teaching4Joy",
    github: "Marc13",
    linkedin: "marciamparker",
  });

  // Load profile image and 2FA status from localStorage on mount
  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    }
    
    const twoFAStatus = localStorage.getItem('twoFactorEnabled');
    if (twoFAStatus === 'true') {
      setTwoFactorEnabled(true);
    }
  }, []);

  // Stats
  const stats = [
    { label: "Notes Created", value: "24", color: "text-[#0046FF]" },
    { label: "Tasks Completed", value: "18", color: "text-[#73C8D2]" },
    { label: "Active Projects", value: "5", color: "text-[#FF9013]" },
    { label: "Days Active", value: "30", color: "text-[#0046FF]" },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    // Save profile image to localStorage
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage);
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem('profileImage');
    toast.success('Profile picture removed');
  };

  const handleSaveEmailPreferences = () => {
    // Save email preferences (in real app, would call API)
    localStorage.setItem('emailPreferences', JSON.stringify(emailPreferences));
    toast.success('Email preferences saved!');
    setEmailNotificationsOpen(false);
  };

  const handleChangePassword = () => {
    // Validate passwords
    if (!passwordFields.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (!passwordFields.newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (passwordFields.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // In real app, would call API
    toast.success('Password changed successfully!');
    setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setChangePasswordOpen(false);
  };

  const handleEnable2FA = () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    // In real app, would verify code with API
    setTwoFactorEnabled(true);
    localStorage.setItem('twoFactorEnabled', 'true');
    toast.success('Two-factor authentication enabled!');
    setTwoFactorCode("");
    setTwoFactorOpen(false);
  };

  const handleDisable2FA = () => {
    if (!disablePassword) {
      toast.error('Please enter your password to disable 2FA');
      return;
    }

    // In real app, would verify password with API
    setTwoFactorEnabled(false);
    localStorage.setItem('twoFactorEnabled', 'false');
    toast.success('Two-factor authentication disabled!');
    setDisablePassword("");
    setDisableTwoFactorOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            My Profile
          </h1>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white transition-all duration-200 active:scale-95"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-300 transition-all duration-200 active:scale-95"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white transition-all duration-200 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-primary-blue/10 flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <Image 
                        src={profileImage} 
                        alt="Profile" 
                        width={128} 
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-primary-blue" />
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="profile-image">
                        <Button
                          type="button"
                          size="icon"
                          className="absolute bottom-0 right-0 rounded-full bg-[#0046FF] hover:bg-[#0046FF]/90 text-white h-10 w-10 cursor-pointer"
                          onClick={() => document.getElementById('profile-image')?.click()}
                        >
                          <Camera className="h-5 w-5" />
                        </Button>
                      </label>
                      {profileImage && (
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-0 right-0 rounded-full h-8 w-8"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1">
                <Badge className="bg-[#73C8D2] text-white hover:bg-[#73C8D2]/90">
                  {profile.role}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {profile.joinDate}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and how others see you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="transition-all duration-200"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 py-2">{profile.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="transition-all duration-200"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 py-2">{profile.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="transition-all duration-200"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 py-2">{profile.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="transition-all duration-200"
                    />
                  ) : (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0046FF] hover:underline py-2 block">
                      {profile.website}
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="transition-all duration-200"
                  />
                ) : (
                  <p className="text-sm text-gray-700 py-2">{profile.bio}</p>
                )}
                {isEditing && (
                  <p className="text-xs text-gray-500">
                    Write a brief description about yourself (max 500 characters)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Connect your social media accounts and make it easy for others to find you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <span className="text-[#1DA1F2]">🐦</span> Twitter / X
                  </Label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <span className="flex items-center text-gray-500 text-sm">@</span>
                      <Input
                        id="twitter"
                        value={profile.twitter.replace('@', '')}
                        onChange={(e) => setProfile({ ...profile, twitter: '@' + e.target.value.replace('@', '') })}
                        placeholder="username"
                        className="transition-all duration-200"
                      />
                    </div>
                  ) : (
                    <a 
                      href={`https://x.com/${profile.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#0046FF] hover:underline py-2 block"
                    >
                      {profile.twitter}
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github" className="flex items-center gap-2">
                    <span>🐙</span> GitHub
                  </Label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <span className="flex items-center text-gray-500 text-sm">github.com/</span>
                      <Input
                        id="github"
                        value={profile.github}
                        onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                        placeholder="username"
                        className="transition-all duration-200"
                      />
                    </div>
                  ) : (
                    <a 
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#0046FF] hover:underline py-2 block"
                    >
                      github.com/{profile.github}
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <span className="text-[#0A66C2]">💼</span> LinkedIn
                  </Label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <span className="flex items-center text-gray-500 text-sm">linkedin.com/in/</span>
                      <Input
                        id="linkedin"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                        placeholder="username"
                        className="transition-all duration-200"
                      />
                    </div>
                  ) : (
                    <a 
                      href={`https://www.linkedin.com/in/${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#0046FF] hover:underline py-2 block"
                    >
                      linkedin.com/in/{profile.linkedin}
                    </a>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <Alert className="border-[#0046FF]/20 bg-[#0046FF]/5">
                  <AlertDescription className="text-sm">
                    💡 <strong>Tip:</strong> Enter just your username, not the full URL. Your profile links will be automatically formatted and clickable.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-app-background rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about your activity</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200 active:scale-95"
                  onClick={() => setEmailNotificationsOpen(true)}
                >
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-app-background rounded-lg">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password regularly for security</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200 active:scale-95"
                  onClick={() => setChangePasswordOpen(true)}
                >
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-app-background rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Two-Factor Authentication</p>
                    {twoFactorEnabled && (
                      <Badge className="bg-green-500 text-white hover:bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {twoFactorEnabled 
                      ? 'Your account is protected with 2FA' 
                      : 'Add an extra layer of security'}
                  </p>
                </div>
                {twoFactorEnabled ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-200 active:scale-95 border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => setDisableTwoFactorOpen(true)}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-200 active:scale-95"
                    onClick={() => setTwoFactorOpen(true)}
                  >
                    Enable
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-white shadow-md border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  Deleting your account is permanent and cannot be undone. All your data will be lost.
                </AlertDescription>
              </Alert>
              <Button
                variant="destructive"
                className="transition-all duration-200 active:scale-95"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Notifications Dialog */}
      <Dialog open={emailNotificationsOpen} onOpenChange={setEmailNotificationsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Notifications</DialogTitle>
            <DialogDescription>
              Choose which email notifications you want to receive
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="task-updates">Task Updates</Label>
                <p className="text-sm text-gray-500">Get notified when tasks are assigned or completed</p>
              </div>
              <Switch
                id="task-updates"
                checked={emailPreferences.taskUpdates}
                onCheckedChange={(checked) => 
                  setEmailPreferences({ ...emailPreferences, taskUpdates: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="note-updates">Note Updates</Label>
                <p className="text-sm text-gray-500">Get notified when notes are created or modified</p>
              </div>
              <Switch
                id="note-updates"
                checked={emailPreferences.noteUpdates}
                onCheckedChange={(checked) => 
                  setEmailPreferences({ ...emailPreferences, noteUpdates: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="project-deadlines">Project Deadlines</Label>
                <p className="text-sm text-gray-500">Get reminders about upcoming project deadlines</p>
              </div>
              <Switch
                id="project-deadlines"
                checked={emailPreferences.projectDeadlines}
                onCheckedChange={(checked) => 
                  setEmailPreferences({ ...emailPreferences, projectDeadlines: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-digest">Weekly Digest</Label>
                <p className="text-sm text-gray-500">Receive a weekly summary of your activity</p>
              </div>
              <Switch
                id="weekly-digest"
                checked={emailPreferences.weeklyDigest}
                onCheckedChange={(checked) => 
                  setEmailPreferences({ ...emailPreferences, weeklyDigest: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEmailNotificationsOpen(false)}
              className="transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEmailPreferences}
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white transition-all duration-200 active:scale-95"
            >
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordFields.currentPassword}
                onChange={(e) => setPasswordFields({ ...passwordFields, currentPassword: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleChangePassword();
                  }
                }}
                placeholder="Enter your current password"
                className="transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordFields.newPassword}
                onChange={(e) => setPasswordFields({ ...passwordFields, newPassword: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleChangePassword();
                  }
                }}
                placeholder="Enter your new password"
                className="transition-all duration-200"
              />
              <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordFields.confirmPassword}
                onChange={(e) => setPasswordFields({ ...passwordFields, confirmPassword: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleChangePassword();
                  }
                }}
                placeholder="Confirm your new password"
                className="transition-all duration-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setChangePasswordOpen(false);
                setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}
              className="transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleChangePassword}
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white transition-all duration-200 active:scale-95"
            >
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Two-Factor Authentication Dialog */}
      <Dialog open={twoFactorOpen} onOpenChange={setTwoFactorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Add an extra layer of security to your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert className="border-[#0046FF]/20 bg-[#0046FF]/5">
              <AlertDescription>
                <strong>How it works:</strong> After entering your password, you&apos;ll need to enter a 6-digit code from your authenticator app.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label>1. Download an authenticator app</Label>
              <p className="text-sm text-gray-500">
                We recommend Google Authenticator, Authy, or Microsoft Authenticator
              </p>
            </div>

            <div className="space-y-2">
              <Label>2. Scan this QR code</Label>
              <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
                <div className="w-40 h-40 bg-white flex items-center justify-center border-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 text-center">QR Code<br/>Placeholder</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Or enter this code manually: <strong className="text-[#0046FF]">ABCD-EFGH-IJKL</strong>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="2fa-code">3. Enter the 6-digit code</Label>
              <Input
                id="2fa-code"
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEnable2FA();
                  }
                }}
                placeholder="000000"
                className="text-center text-2xl tracking-widest transition-all duration-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTwoFactorOpen(false);
                setTwoFactorCode("");
              }}
              className="transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleEnable2FA}
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white transition-all duration-200 active:scale-95"
            >
              Enable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Two-Factor Authentication Dialog */}
      <Dialog open={disableTwoFactorOpen} onOpenChange={setDisableTwoFactorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Are you sure you want to disable 2FA?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Warning:</strong> Disabling two-factor authentication will make your account less secure. You&apos;ll only need your password to log in.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="disable-password">Enter your Note-Taking App password or 2FA code</Label>
              <Input
                id="disable-password"
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDisable2FA();
                  }
                }}
                placeholder="Enter your password or 2FA code"
                className="transition-all duration-200"
              />
              <p className="text-xs text-gray-500">
                This action requires your password or 2FA code for security purposes.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDisableTwoFactorOpen(false);
                setDisablePassword("");
              }}
              className="transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDisable2FA}
              className="transition-all duration-200 active:scale-95"
            >
              Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

