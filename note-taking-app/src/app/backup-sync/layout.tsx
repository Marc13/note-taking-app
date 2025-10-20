import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backup & Sync - My Notes App",
  description: "Manage your data backups and sync",
};

export default function BackupSyncLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

