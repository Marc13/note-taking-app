import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions for using My Notes App. Understand your rights and responsibilities when using our platform.",
};

export default function TermsPage() {
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
              <FileText className="h-10 w-10 text-primary-blue" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Terms of Service
              </h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="space-y-6">
            {/* Agreement */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Agreement to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  By accessing or using My Notes App, you agree to be bound by these Terms of Service and all
                  applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
                  from using or accessing this application.
                </p>
              </CardContent>
            </Card>

            {/* Use License */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Use License</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  Permission is granted to temporarily access and use My Notes App for personal, non-commercial
                  purposes. This license does not include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Modifying or copying the application materials</li>
                  <li>Using the materials for any commercial purpose or public display</li>
                  <li>Attempting to decompile or reverse engineer any software contained in the application</li>
                  <li>Removing any copyright or proprietary notations from the materials</li>
                  <li>Transferring the materials to another person or mirroring the materials on any other server</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  When you create an account with us, you must provide accurate, complete, and current information.
                  Failure to do so constitutes a breach of the Terms, which may result in immediate termination
                  of your account.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  You are responsible for safeguarding the password you use to access the application and for any
                  activities or actions under your password. You must notify us immediately upon becoming aware
                  of any breach of security or unauthorized use of your account.
                </p>
              </CardContent>
            </Card>

            {/* User Content */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">User Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  You retain all rights to the content you create, post, or store on My Notes App. By using our
                  application, you grant us a license to store, backup, and display your content solely for the
                  purpose of providing the service to you.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  You are responsible for the content you create and must ensure it does not violate any laws
                  or third-party rights. We reserve the right to remove any content that we deem inappropriate
                  or in violation of these Terms.
                </p>
              </CardContent>
            </Card>

            {/* Prohibited Uses */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Prohibited Uses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  You may not use My Notes App:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>In any way that violates any applicable law or regulation</li>
                  <li>To transmit or procure the sending of any advertising or promotional material without our consent</li>
                  <li>To impersonate or attempt to impersonate the company, an employee, another user, or any other person</li>
                  <li>To engage in any conduct that restricts or inhibits anyone&apos;s use or enjoyment of the application</li>
                  <li>To upload or transmit viruses, malware, or any other malicious code</li>
                  <li>To interfere with or circumvent the security features of the application</li>
                </ul>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  The application and its original content (excluding user-generated content), features, and
                  functionality are and will remain the exclusive property of My Notes App and its licensors.
                  The application is protected by copyright, trademark, and other laws.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  The application is provided on an &quot;as is&quot; and &quot;as available&quot; basis. My Notes App makes no
                  representations or warranties of any kind, express or implied, as to the operation of the
                  application or the information, content, or materials included therein.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  We do not warrant that the application will be uninterrupted, secure, or error-free, or that
                  defects will be corrected. You use the application at your own risk.
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  In no event shall My Notes App or its suppliers be liable for any damages (including, without
                  limitation, damages for loss of data or profit, or due to business interruption) arising out
                  of the use or inability to use the application, even if we have been notified of the possibility
                  of such damage.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time at our sole discretion.
                  We will provide notice of any changes by posting the new Terms on this page and updating
                  the &quot;Last updated&quot; date. Your continued use of the application after any changes constitutes
                  acceptance of those changes.
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
                  If you have any questions about these Terms of Service, please contact us:
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

