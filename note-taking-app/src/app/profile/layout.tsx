import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - My Notes App",
  description: "Manage your profile and account settings",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

