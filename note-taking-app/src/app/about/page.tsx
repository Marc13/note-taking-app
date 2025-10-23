import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { ArrowLeft, Target, Users, Zap, Shield } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "Learn more about My Notes App and our mission to help you organize your thoughts and boost productivity. Discover our story, features, and commitment to your success.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-app-background">
      <AppHeader />
      
      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            asChild
            variant="ghost"
            className="mb-6 hover:bg-accent-cyan/15 transition-colors duration-200"
          >
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About My Notes App
            </h1>
            <p className="text-lg text-muted-foreground">
              Your personal productivity companion for organizing notes, tasks, and projects.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-6 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="h-6 w-6 text-primary-blue" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-relaxed">
                At My Notes App, we believe that great ideas deserve a great home. Our mission is to provide
                you with a simple, intuitive, and powerful platform to capture your thoughts, organize your
                tasks, and manage your projects—all in one place.
              </p>
              <p className="text-base leading-relaxed">
                We understand that everyone has their own way of thinking and organizing. That&apos;s why we&apos;ve
                built a flexible system that adapts to your workflow, not the other way around.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary-blue" />
                  Fast & Intuitive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built with modern technology to ensure lightning-fast performance and a smooth user
                  experience. Your notes are always just a click away.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary-blue" />
                  Secure & Private
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your data is yours. We take security and privacy seriously, ensuring your notes remain
                  confidential and protected at all times.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary-blue" />
                  User-Focused
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every feature is designed with you in mind. We listen to feedback and continuously improve
                  the app to meet your needs.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary-blue" />
                  Goal-Oriented
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  From daily notes to long-term projects, our tools help you stay focused on what matters
                  most and achieve your goals.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story Section */}
          <Card className="mb-6 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-relaxed">
                My Notes App was born out of a simple frustration: existing note-taking apps were either
                too complex or too limited. We wanted something that was powerful enough for professionals
                but simple enough for anyone to use.
              </p>
              <p className="text-base leading-relaxed">
                After months of development and countless iterations, we created an app that we&apos;re proud of—one
                that we use ourselves every single day. Now, we&apos;re excited to share it with you.
              </p>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="bg-primary-blue/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get organized?</h2>
            <p className="text-muted-foreground mb-6">
              Start creating notes, managing tasks, and boosting your productivity today.
            </p>
            <Button
              asChild
              className="bg-primary-blue hover:bg-primary-blue/90 text-white transition-all duration-200 active:scale-95"
              size="lg"
            >
              <Link href="/notes/new">Create Your First Note</Link>
            </Button>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

