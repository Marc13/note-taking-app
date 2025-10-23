import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how My Notes App collects, uses, and protects your personal information. Your privacy and data security are our top priorities.",
};

export default function PrivacyPage() {
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
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-10 w-10 text-primary-blue" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Privacy Policy
              </h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="space-y-6">
            {/* Introduction */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  At My Notes App, we take your privacy seriously. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you use our application. Please read this
                  privacy policy carefully. If you do not agree with the terms of this privacy policy, please
                  do not access the application.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    We may collect personal information that you voluntarily provide to us when you register
                    on the application, including your name, email address, and profile information.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Usage Data</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    We automatically collect certain information when you visit, use, or navigate the application.
                    This information may include device information, log data, and usage patterns.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Content Data</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    We store the notes, tasks, projects, and other content you create within the application
                    to provide you with our services.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  We use the information we collect or receive:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>To provide, operate, and maintain our application</li>
                  <li>To improve, personalize, and expand our application</li>
                  <li>To understand and analyze how you use our application</li>
                  <li>To develop new products, services, features, and functionality</li>
                  <li>To communicate with you for customer service and support</li>
                  <li>To send you updates and marketing communications (with your consent)</li>
                  <li>To detect, prevent, and address technical issues</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect the
                  security of your personal information. However, please note that no method of transmission
                  over the Internet or method of electronic storage is 100% secure, and we cannot guarantee
                  absolute security.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Your notes and personal data are encrypted in transit and at rest. We use industry-standard
                  security practices to protect your information from unauthorized access, disclosure, alteration,
                  and destruction.
                </p>
              </CardContent>
            </Card>

            {/* Your Privacy Rights */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>The right to access your personal data</li>
                  <li>The right to rectify inaccurate personal data</li>
                  <li>The right to erase your personal data</li>
                  <li>The right to restrict processing of your personal data</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing of your personal data</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  We will retain your personal information only for as long as necessary to fulfill the purposes
                  outlined in this Privacy Policy. When you delete your account, we will delete your personal
                  information and content, unless we are required to retain it for legal or regulatory purposes.
                </p>
              </CardContent>
            </Card>

            {/* Contact Us */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-primary-blue/5 p-4 rounded-lg">
                  <p className="font-semibold mb-2">My Notes App</p>
                  <p className="text-muted-foreground">Email: parkermarcia615@gmail.com</p>
                  <Button
                    asChild
                    variant="link"
                    className="text-primary-blue hover:underline p-0 h-auto mt-2"
                  >
                    <Link href="/contact">Visit our Contact Page</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

