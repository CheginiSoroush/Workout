import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import StaticApiShim from "@/components/StaticApiShim";

export const metadata: Metadata = {
  title: "داشبورد فیتنس من | برنامه شناگر FST-7",
  description:
    "داشبورد شخصی تمرین و تغذیه — برنامه ۳ روزه بر پایه اصول هانی رامبد (FST-7) با هدف فرم شناگری و کاهش وزن",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* فونت وزیرمتن به‌صورت لوکال از /fonts سرو می‌شود — آفلاین کامل */}
        <link rel="preload" href="/fonts/Vazirmatn-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Vazirmatn-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-background text-foreground font-vazir">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* شیم API استاتیک — فقط در بیلد GitHub Pages فعال می‌شود */}
          <StaticApiShim />
          {children}
          <Toaster />
          {/* توست‌های sonner — LiftosaurGuide/AppExports/HomeView از این سیستم استفاده می‌کنند */}
          <SonnerToaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
