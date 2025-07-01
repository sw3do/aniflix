import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/components/Toast';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aniflix - Stream Your Favorite Anime",
  description: "Discover and stream the best anime series and movies. Watch trending, popular, and latest anime releases on Aniflix.",
  keywords: ["anime", "streaming", "manga", "japanese animation", "series", "movies"],
  authors: [{ name: "Aniflix Team" }],
  creator: "Aniflix",
  publisher: "Aniflix",
  metadataBase: new URL("https://aniflix.app"),
  openGraph: {
    title: "Aniflix - Stream Your Favorite Anime",
    description: "Discover and stream the best anime series and movies.",
    url: "https://aniflix.app",
    siteName: "Aniflix",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aniflix - Anime Streaming Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniflix - Stream Your Favorite Anime",
    description: "Discover and stream the best anime series and movies.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
