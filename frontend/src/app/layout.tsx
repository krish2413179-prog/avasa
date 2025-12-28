import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Veda | Next-Gen RWA DeFi Platform",
  description: "Revolutionary Real World Asset DeFi platform powered by advanced AI agents and EIP-7715 permissions.",
  keywords: ["RWA", "DeFi", "Real Estate", "AI", "Blockchain", "Veda"],
  authors: [{ name: "Veda Team" }],
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
        width: '100vw', // Full viewport width
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)', // Darker theme
        fontFamily: 'Inter, system-ui, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden' // Prevent any scrollbars
      }}>
        <Providers>
          <div style={{ 
            minHeight: '100vh', 
            width: '100vw',
            display: 'flex', 
            flexDirection: 'column',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box'
          }}>
            <main style={{ 
              flex: 1, 
              position: 'relative',
              width: '100%',
              margin: 0,
              padding: 0
            }}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
