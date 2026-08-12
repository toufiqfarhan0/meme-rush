import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Meme Rush — Interactive 3D Meme Battles & Generator',
  description: 'Create, battle, and discover viral memes in real time with dynamic 3D scenes, audio soundscapes, and community voting.',
  keywords: ['meme generator', '3d memes', 'meme battles', 'viral feed', 'three.js meme app'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-cyan-500 selection:text-black">
        <div className="fixed inset-0 pointer-events-none bg-radial-glow z-0" />
        <Navbar />
        <main className="flex-1 relative z-10 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
