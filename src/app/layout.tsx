import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider, SettingsPanel } from "@/components/AccessibilityContext";
import { CustomCursor } from "@/components/CustomCursor";
import { AiAssistant } from "@/components/AiAssistant";
import { EditorProvider, EditorToolbar } from "@/components/editor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kloudera Technologies | Secure Enterprise AI Command Center",
  description: "Future-proof your enterprise with world-class Cyber Security, cognitive AI workflows, Microsoft solutions, and premium GPU systems.",
  metadataBase: new URL("https://kloudera.tech"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="h-full bg-black text-zinc-100 flex flex-col antialiased">
        <AccessibilityProvider>
          <EditorProvider>
            <CustomCursor />
            <div className="flex-1 flex flex-col">{children}</div>
            <AiAssistant />
            <SettingsPanel />
            <EditorToolbar />
          </EditorProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
