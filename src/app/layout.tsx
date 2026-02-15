import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Owner App",
  description: "Owner web for hackathon nail project"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
