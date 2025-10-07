'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutTemplate,
  BookOpen,
  Home,
  Calendar,
  CheckSquare,
  FolderKanban,
  FileText,
  Tags,
  Archive,
  Palette,
  CloudUpload,
  Settings,
  type LucideIcon,
} from 'lucide-react';

interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavigationSection {
  title: string;
  emoji: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    title: 'KNOWLEDGE & REFERENCE',
    emoji: '📚',
    items: [
      { href: '/templates', label: 'Templates Gallery', icon: LayoutTemplate },
      { href: '/knowledge-hub', label: 'Knowledge Hub', icon: BookOpen },
    ],
  },
  {
    title: 'PRODUCTIVITY & ORGANIZATION',
    emoji: '🔎',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
      { href: '/daily-notes', label: 'Daily Notes', icon: Calendar },
      { href: '/tasks', label: 'Tasks', icon: CheckSquare },
      { href: '/projects', label: 'Projects', icon: FolderKanban },
      { href: '/notes', label: 'Notes', icon: FileText },
      { href: '/categories', label: 'Categories', icon: Tags },
      { href: '/archive', label: 'Archive', icon: Archive },
    ],
  },
  {
    title: 'SETTINGS & UTILITIES',
    emoji: '⚙️',
    items: [
      { href: '/customization', label: 'Customization', icon: Palette },
      { href: '/backup-sync', label: 'Backup & Sync', icon: CloudUpload },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav role="navigation" id="sidebar-navigation" aria-label="Main navigation" className="h-full">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6">
          {navigationSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h2
                className={`text-xs font-bold text-primary-blue uppercase tracking-wide mb-3 ${
                  sectionIndex === 0 ? 'mt-0' : 'mt-8'
                }`}
              >
                {section.emoji} {section.title}
              </h2>
              <Separator className="mb-3 bg-gray-200" />
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-auto py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-accent-cyan/15 hover:text-primary-blue hover:translate-x-1 transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-blue/10 text-primary-blue font-semibold border-l-4 border-primary-blue pl-2'
                            : ''
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon
                          className="h-[18px] w-[18px]"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </nav>
  );
}

