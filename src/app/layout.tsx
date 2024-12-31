// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles Admin',
  description: 'Admin tool for editing articles in local DB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* You could add a navbar or side menu here */}
        {children}
      </body>
    </html>
  );
}
