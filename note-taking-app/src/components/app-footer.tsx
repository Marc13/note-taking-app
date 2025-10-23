import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Twitter, Github, Linkedin } from 'lucide-react';

export function AppFooter() {
  return (
    <>
      <Separator className="mt-auto" />
      <footer 
        role="contentinfo" 
        className="bg-white border-t px-4 md:px-6 py-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
                <p className="text-sm text-gray-700 order-2 md:order-1">
                  © 2025 My Notes App. All rights reserved.
                </p>

            {/* Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 order-1 md:order-2">
              <Link
                href="/about"
                className="text-sm text-gray-700 hover:text-primary-blue transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-700 hover:text-primary-blue transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-700 hover:text-primary-blue transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-700 hover:text-primary-blue transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 order-3">
              <Link
                href="https://x.com/T4JSolutions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary-blue transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/Marc13"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary-blue transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/marciamparker/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary-blue transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

