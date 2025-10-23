import { ReactNode } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { SidebarNav } from '@/components/sidebar-nav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <AppHeader />

      {/* Sidebar Container */}
      <nav className="fixed left-0 top-16 w-64 md:w-72 h-[calc(100vh-4rem)] bg-app-background border-r hidden lg:block overflow-y-auto">
        <SidebarNav />
      </nav>

      {/* Main Content Area */}
      <main 
        role="main" 
        className="ml-0 lg:ml-64 xl:ml-72 flex-1 bg-app-background"
      >
        {children}
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}

