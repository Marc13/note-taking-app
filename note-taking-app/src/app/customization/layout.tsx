import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customization - My Notes App",
  description: "Customize your app appearance and preferences",
};

export default function CustomizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

