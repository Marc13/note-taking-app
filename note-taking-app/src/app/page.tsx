'use client'

import AuthButton from '@/components/auth/AuthButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Note Taking App
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Main Icon/Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Note Taking App
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your thoughts, organized beautifully
          </p>
        </div>

        {/* Status Message */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              SYSTEM READY
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            It Works! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your note-taking app is successfully running with Next.js, Tailwind CSS, and Turbopack.
          </p>
        </div>

        {/* Tech Stack Info */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            Next.js 15
          </span>
          <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded-full text-sm font-medium">
            Tailwind CSS v4
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
            Turbopack
          </span>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
            TypeScript
          </span>
        </div>

        {/* Next Steps */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Ready to start building your note-taking features!
        </div>
      </div>
    </div>
  );
}
