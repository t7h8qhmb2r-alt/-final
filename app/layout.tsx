import "./globals.css";
export const metadata = { title: "Niken-me", description: "2軒目探しアプリ" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/></head>
      <body>{children}</body>
    </html>
  );
}
