'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MobileNav } from '@/components/mobile-nav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';

// Define notification type
interface Notification {
  id: string;
  title: string;
  time: string;
  link: string;
  type: 'task' | 'note' | 'project';
}

// All available notifications
const ALL_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New task assigned', time: '2 hours ago', link: '/tasks', type: 'task' },
  { id: '2', title: 'Note updated', time: '5 hours ago', link: '/notes', type: 'note' },
  { id: '3', title: 'Project deadline approaching', time: '1 day ago', link: '/projects', type: 'project' },
];

export function AppHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const router = useRouter();

  // Load read notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('readNotifications');
    if (stored) {
      try {
        setReadNotifications(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Filter out read notifications to get unread ones
  const unreadNotifications = ALL_NOTIFICATIONS.filter(
    notification => !readNotifications.includes(notification.id)
  );

  // Count of unread notifications
  const notificationCount = unreadNotifications.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to notes page with search query
      router.push(`/notes?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read
    const updatedReadNotifications = [...readNotifications, notification.id];
    setReadNotifications(updatedReadNotifications);
    
    // Persist to localStorage
    localStorage.setItem('readNotifications', JSON.stringify(updatedReadNotifications));
    
    // Navigate to the related page
    router.push(notification.link);
    
    // Close the dropdown
    setNotificationsOpen(false);
  };

  return (
    <header role="banner" className="sticky top-0 z-50 h-16 bg-white border-b shadow-sm px-4 md:px-6">
      <div className="flex items-center justify-between h-full gap-4">
        {/* Left: Mobile Nav + Logo + App Name */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <Image 
              src="/3D_Small3.jpg"
              alt="My Notes App Logo"
              width={40}
              height={40}
              className="rounded-lg object-cover"
              priority
            />
            <span className="text-lg md:text-xl font-bold text-primary-blue">
              My Notes App
            </span>
          </Link>
        </div>

        {/* Center: Search Bar (hidden on very small mobile) */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full transition-all duration-200 focus:ring-2 focus:ring-primary-blue"
            />
          </div>
        </form>

        {/* Right: Notification Bell + User Menu */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Notification Bell */}
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-accent-cyan/15 transition-colors duration-200"
                aria-label="Notifications"
              >
                    <Bell className="h-5 w-5 text-gray-700" />
                {notificationCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary-blue text-white text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-64"
              onMouseLeave={() => setNotificationsOpen(false)}
            >
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className="cursor-pointer transition-colors duration-200 hover:bg-accent-cyan/15"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-4 text-center text-sm text-gray-500">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-accent-cyan/15 transition-colors duration-200"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-primary-blue/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-blue" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                asChild 
                className="cursor-pointer transition-colors duration-200"
                onClick={() => setUserMenuOpen(false)}
              >
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                asChild 
                className="cursor-pointer transition-colors duration-200"
                onClick={() => setUserMenuOpen(false)}
              >
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer transition-colors duration-200"
                onClick={() => setUserMenuOpen(false)}
              >
                <div className="flex items-center gap-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  Logout
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

