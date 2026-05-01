import "./globals.css";
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata = {
  title: 'BAR_LAB.EXE',
  description: 'AI-powered Bar Exploration System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-[#0e1224] text-slate-50`}>
        {children}
      </body>
    </html>
  );
}
