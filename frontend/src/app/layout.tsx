import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "PropChain AI | Next-Gen RWA DeFi Platform",
  description: "Revolutionary Real World Asset DeFi platform powered by advanced AI agents and EIP-7715 permissions.",
  keywords: ["RWA", "DeFi", "Real Estate", "AI", "Blockchain", "PropChain"],
  authors: [{ name: "PropChain Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased font-sans" style={{
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 relative">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
