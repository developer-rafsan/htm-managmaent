import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import "@/globals.css";

export const metadata: Metadata = {
  title: "Project and HR management System",
  description: "Project and HR management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
