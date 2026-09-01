import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Vouchy — Playful Personal Profile & Vouch Wall',
  description: 'Your profile. Your people. Their words. Let people vouch for you with messages, memories, compliments, and testimonials.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between antialiased selection:bg-vouchy-purple-200 selection:text-vouchy-purple-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
