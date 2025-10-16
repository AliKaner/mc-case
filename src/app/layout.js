import "./globals.scss";
import ToastProvider from "../components/providers/ToastProvider";
import QueryProvider from "../components/providers/QueryProvider";
import ModalProvider from "../components/providers/ModalProvider";
import { Header, Body, LayoutWrapper } from "../components/layout";
import { HeaderContent } from "../components/layout/HeaderContent";

export const metadata = {
  title: "Minticity Case - User Management System",
  description:
    "Modern user management system built with Next.js - Minticity Case by Ali Kaner",
  keywords: ["user management", "nextjs", "minticity", "case study"],
  authors: [{ name: "Ali Kaner" }],
  creator: "Ali Kaner",
  publisher: "Ali Kaner",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    title: "Minticity Case - User Management System",
    description:
      "Modern user management system built with Next.js - Minticity Case by Ali Kaner",
    siteName: "Minticity Case",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Minticity Case Logo",
        type: "image/webp",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@minticity",
    creator: "@alikaner",
    title: "Minticity Case - User Management System",
    description:
      "Modern user management system built with Next.js - Minticity Case by Ali Kaner",
    images: ["/logo.webp"],
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

  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },

  applicationName: "Minticity Case",
  referrer: "origin-when-cross-origin",
  category: "technology",

  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <QueryProvider>
          <ToastProvider>
            <ModalProvider>
              <LayoutWrapper>
                <Header>
                  <HeaderContent logo={"/logo.webp"} />
                </Header>
                <Body>{children}</Body>
              </LayoutWrapper>
            </ModalProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
