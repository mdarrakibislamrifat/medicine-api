import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MediData API | Comprehensive Medicine Database Bangladesh",
    template: "%s | MediData API"
  },
  description: "Access over 25,000+ authentic pharmaceutical records in Bangladesh. Search by brand name, generic, or company with our lightning-fast Medicine Explorer API.",
  keywords: ["medicine api", "bangladesh pharmaceutical database", "generic medicine search", "napa generic name", "beximco pharma list"],
  authors: [{ name: "Rakib Islam Rifat" }],
  openGraph: {
    title: "MediData API - 25k+ Pharmaceutical Records",
    description: "The most comprehensive and reliable medicine database API for developers and healthcare professionals.",
    url: "https://medex-medicine-api.vercel.app/", 
    siteName: "MediData API",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediData API | Medicine Database Explorer",
    description: "Search 25,000+ medicines instantly with our pro-grade API explorer.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
