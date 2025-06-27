import ClientLayout from "@/components/ClientLayout";
import { Geist, Geist_Mono } from "next/font/google";
import { metadata } from "./metadata";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export { metadata };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className="bg-dark text-white font-['Inter'] antialiased overflow-x-hidden">
        <ClientLayout>
          <div className="relative z-0">{children}</div>
        </ClientLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
