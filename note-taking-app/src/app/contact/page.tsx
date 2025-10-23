"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Message sent successfully!");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }, 3000);
    }, 1500);
  };

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
              <Mail className="h-10 w-10 text-primary-blue" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Contact Us
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Have a question or feedback? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Contact Form */}
            <Card className="md:col-span-2 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary-blue" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="rounded-full bg-green-100 p-3">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
                    <p className="text-muted-foreground text-center">
                      Thank you for contacting us. We&apos;ll respond to your message shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="transition-all duration-200"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="transition-all duration-200"
                      />
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">
                        Subject <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="What is this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="transition-all duration-200"
                      />
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        rows={6}
                        className="transition-all duration-200 resize-y"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-blue hover:bg-primary-blue/90 text-white transition-all duration-200 active:scale-95"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Email Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Mail className="h-5 w-5 text-primary-blue mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">General Inquiries</p>
                        <a
                          href="mailto:parkermarcia615@gmail.com"
                          className="text-sm text-primary-blue hover:underline"
                        >
                          parkermarcia615@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Support Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      * Times are in EST (Eastern Standard Time)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md bg-primary-blue/10 border-primary-blue/20">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild variant="link" className="w-full justify-start p-0 h-auto text-primary-blue">
                      <Link href="/about">About Us</Link>
                    </Button>
                    <Button asChild variant="link" className="w-full justify-start p-0 h-auto text-primary-blue">
                      <Link href="/privacy">Privacy Policy</Link>
                    </Button>
                    <Button asChild variant="link" className="w-full justify-start p-0 h-auto text-primary-blue">
                      <Link href="/terms">Terms of Service</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

