import type { NextConfig } from "next";

// ============================================================
// دو حالت بیلد:
//  ۱) عادی (توسعه/سندباکس): خروجی standalone با API و Prisma
//  ۲) استاتیک (STATIC_EXPORT=1 در CI): خروجی export برای GitHub Pages
//     — API routes پیش از بیلد حذف می‌شوند (rm -rf src/app/api)
//     و درخواست‌های /api با شیم کلاینت (src/lib/staticApi.ts)
//     از روی localStorage پاسخ داده می‌شوند.
// ============================================================
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      basePath: "/Workout",
      // basePath در بیلد استاتیک فقط دارایی‌های _next را پیشوند می‌دهد؛
      // مسیرهای public دستی (عکس/ویدیو/فریم) در کد باید خودشان از این
      // پایه استفاده کنند — در بیلد عادی رشتهٔ خالی است (لوکال بی‌اثر).
      env: { NEXT_PUBLIC_ASSET_BASE: "/Workout" },
      // distDir جدا تا بیلد استاتیک لوکال با dev server در حال اجرا تداخل نکند
      distDir: ".next-static",
      images: { unoptimized: true },
      typescript: { ignoreBuildErrors: true },
      eslint: { ignoreDuringBuilds: true },
      reactStrictMode: false,
    }
  : {
      output: "standalone",
      /* config options here */
      typescript: {
        ignoreBuildErrors: true,
      },
      reactStrictMode: false,
    };

export default nextConfig;
