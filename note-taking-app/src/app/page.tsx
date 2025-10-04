import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      {/* Header */}
      <header role="banner" className="sticky top-0 z-50 h-16 bg-white border-b shadow-sm px-4 md:px-6">
        <div className="flex items-center justify-between h-full">
          <div className="flex-shrink-0">
            <h1 className="text-lg md:text-xl font-bold text-primary-blue">
              My Notes App
            </h1>
          </div>
          <div className="flex items-center">
            {/* Placeholder for future user menu */}
          </div>
        </div>
      </header>

      {/* Sidebar Container */}
      <aside className="fixed left-0 top-16 w-64 md:w-72 h-[calc(100vh-4rem)] bg-app-background border-r hidden lg:block overflow-y-auto p-4 md:p-6">
        <div className="text-muted-foreground">
          Navigation will appear here
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        role="main" 
        className="ml-0 lg:ml-64 xl:ml-72 p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem-5rem)] bg-app-background"
      >
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to My Notes App</CardTitle>
              <CardDescription>
                Your note-taking workspace is ready
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Welcome to your personal note-taking workspace. This is where you&apos;ll be able to create, organize, and manage all your notes efficiently.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer 
        role="contentinfo" 
        className="h-20 bg-white border-t px-6 py-4"
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-gray-600">
            © 2025 My Notes App. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
