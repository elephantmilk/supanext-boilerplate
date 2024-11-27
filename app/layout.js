import {
  Inter as fontSans,
  Share_Tech_Mono as fontMono,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";

const sans = fontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = fontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
});

export const metadata = {
  title: "Heritaxa",
  description: "Heritaxa Prototype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          sans.variable,
          mono.variable
        )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <main className="mx-auto">
            <Header />
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
