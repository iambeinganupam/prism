import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "PRISM — AI-Powered Integrated Institution Complaint Monitoring | AICTE",
  description: "AI-powered Integrated Institution Complaint Monitoring & Status Platform for AICTE (All India Council for Technical Education). An independent personal platform launch.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans bg-[#080B14] text-white selection:bg-coral selection:text-white">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
