'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SidebarNav } from './sidebar-nav';

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-6 w-6 text-primary-blue" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-app-background">
        <SidebarNav />
      </SheetContent>
    </Sheet>
  );
}

