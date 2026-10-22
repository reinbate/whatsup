import type { Metadata, Viewport } from "next";
import { Shippori_Mincho } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { APP_NAME } from "@/lib/config";
import "./globals.css";

const mincho = Shippori_Mincho({
  variable: "--font-mincho",
  weight: ["500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Photos and updates, just for us. No ads.",
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf5" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1a19" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mincho.variable} h-full antialiased`}>
      <body className="min-h-full">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
