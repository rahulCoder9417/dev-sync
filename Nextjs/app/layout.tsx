// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReduxProvider from "@/components/main/ReduxProvider";
import { ClientApp } from "./ClientApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: 'DevSync AI',
  description: 'Collaborative cloud-based development platform',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      
            <ReduxProvider>
              <ClientApp>
              {children}
              </ClientApp>
              </ReduxProvider>
 
        </body>
      </html>
    </ClerkProvider>
  );
}
