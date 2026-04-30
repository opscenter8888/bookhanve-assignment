import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { ToastProvider } from "@/components/ui/Toast";
import { APP_COPY } from "@/constants/copy";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_COPY.name,
  description: APP_COPY.tagline
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ToastProvider>
          <Header />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
