<div align="center">

<img src="docs/assets/banner.svg" width="100%" alt="داشبورد فیتنس من — برنامهٔ شناگر FST-7"/>

[![Live Site](https://img.shields.io/badge/🌐_سایت_زنده-GitHub_Pages-25c281?style=for-the-badge)](https://cheginisoroush.github.io/Workout/)
[![Deploy](https://github.com/CheginiSoroush/Workout/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/CheginiSoroush/Workout/actions/workflows/deploy-pages.yml)
[![Author](https://img.shields.io/badge/سازنده-Soroush_Chegini-0f1512?style=for-the-badge&logo=github)](https://github.com/CheginiSoroush)
[![Email](https://img.shields.io/badge/ایمیل-imsorouschegini@gmail.com-25c281?style=for-the-badge&logo=gmail&logoColor=white)](mailto:imsorouschegini@gmail.com)

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-New_York-000000?logo=shadcnui&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-⚡_runtime-F472B6)

**ساختهٔ [سروش چگینی (Soroush)](https://github.com/CheginiSoroush) — برای خودش، بر پایهٔ اصول هانی رامبد (FST-7)**

[🌐 سایت زنده](https://cheginisoroush.github.io/Workout/) · [imsoroush.ir](https://imsoroush.ir) · [پرتفولیو گیت‌هاب](https://github.com/CheginiSoroush)

</div>

---

## ✨ این چیه؟ / What is this?

داشبورد شخصی تمرین، تغذیه و پیشرفت — برنامهٔ **۳ روزهٔ Push / Pull / Legs** با فینیشر **FST-7** در پایان هر جلسه، RPE ۸–۹ و پیشروی دوگانه. همه‌چیز RTL و فارسی، همه‌داده‌ها فقط روی دستگاه خودت، و خروجی مستقیم برای اپ‌های بدنسازی.

> A personal, fully-RTL fitness dashboard: a 3-day PPL split with FST-7 finishers, set-by-set logging, science-backed knowledge base, and one-click exports to Hevy / Liftosaur / Lyfta.

## 🖼️ نگاهی به داخل / Screenshots

| خانه | برنامهٔ هفتگی | دانش و منابع |
|:---:|:---:|:---:|
| ![خانه](docs/screenshots/home.png) | ![برنامه](docs/screenshots/program.png) | ![دانش](docs/screenshots/knowledge.png) |
| **موبایل — خانه** | **موبایل — برنامه** | |
| ![موبایل خانه](docs/screenshots/mobile-home.png) | ![موبایل برنامه](docs/screenshots/mobile-program.png) | |

## 🏋️ برنامهٔ تمرین / The Program

| جلسه | تمرکز | ست‌های کاری | فینیشر FST-7 |
|:---:|:---|:---:|:---|
| **شنبه** | سینه · سرشانه · پشت‌بازو | ۲۳ ست | نشر جانب کابل — ۷ ست × ۴۵ ثانیه |
| **دوشنبه** | زیربغل · پشت بازو جلوی بدن | ۲۶ ست | فییس‌پول — ۷ ست × ۴۵ ثانیه |
| **چهارشنبه** | پا · باسن · شکم | ۲۷ ست | نشر جانب دستگاه — ۷ ست × ۴۵ ثانیه |

هر ۲۰ حرکت با ویدیو/فلیپ‌بوک، نکات فرم، خطاهای رایج و **نسخهٔ دستگاه ↔ وزنهٔ آزاد**.

## 🚀 قابلیت‌ها / Features

- 📋 **ثبت جلسه ست‌به‌ست** — وزنه، تکرار، استراحت‌سنج و RPE با دکمه‌های سریع
- 📈 **پیشرفت واقعی** — نمودار وزنه‌ها، استمراری هفتگی و رکوردهای شخصی
- 🧠 **کتابخانهٔ دانش** — قاموس ۳۱ اصطلاح، تحقیق کراتین و CLA، منابع علمی لینک‌دار
- 🧘 **روتین کشش ۱۴ حرکته** + LISS دوچرخه + تغذیه و سلامت
- 📤 **خروجی برای اپ‌ها** — Hevy، Liftosaur، Lyfta، Gymverse و… با نام دقیق حرکت‌ها از کتابخانهٔ هر اپ
- 🤖 **پرامپت ChatGPT + Hevy** — ساخت خودکار هر ۳ روال داخل اپ با یک پرامپت (دستگاهی/آزاد)
- 🔒 **حریم خصوصی کامل** — بدون سرور و حساب؛ همه‌چیز روی دستگاه تو
- 🌓 **تم تیرهٔ سبز** — طراحی mobile-first با فونت وزیرمتن، کاملاً آفلاین

## 📤 خروجی‌ها / Exports

فایل‌های آماده در [`public/exports`](public/exports): `build-hevy*.txt` · `liftosaur-*.liftoscript` · `build-lyfta*.txt` · `chatgpt-hevy-prompt-*.txt` و…

## ⚙️ معماری / Architecture

```mermaid
graph LR
  A([کاربر]) --> B[Next.js 16 — App Router]
  B --> C[خانه · برنامه · تمرین · پیشرفت · پروفایل]
  B --> D[(دیتای محلی — فقط روی دستگاه)]
  B --> E[خروجی: Hevy · Liftosaur · Lyfta · ChatGPT]
  C --> F[کتابخانهٔ دانش علمی]
```

## 🛠️ تکنولوژی / Tech Stack

| لایه | ابزار |
|:---|:---|
| فریم‌ورک | Next.js 16 (App Router) · React 19 |
| زبان | TypeScript 5 (strict) |
| استایل | Tailwind CSS 4 · shadcn/ui · Lucide |
| داده | Prisma + SQLite · TanStack Query · Zustand |
| اجرا | Bun · GitHub Actions → GitHub Pages |

## 🏃 اجرا / Getting Started

```bash
git clone https://github.com/CheginiSoroush/Workout.git
cd Workout
bun install
bun run dev            # توسعه → http://localhost:3000
bun run build:static   # خروجی استاتیک برای GitHub Pages
```

## 👤 سازنده / Creator

| | |
|:---|:---|
| **طراحی، کد، برنامهٔ تمرینی و محتوا** | سروش چگینی — **Soroush Chegini** |
| **گیت‌هاب** | [@CheginiSoroush](https://github.com/CheginiSoroush) |
| **ایمیل** | [imsorouschegini@gmail.com](mailto:imsorouschegini@gmail.com) |
| **وب‌سایت** | [imsoroush.ir](https://imsoroush.ir) |

---

<div align="center">

© ۲۰۲۶ [Soroush Chegini](https://github.com/CheginiSoroush) — تمام حقوق محفوظ است.

⭐ اگه ایده‌ات را زد، یک ستار بزن!

</div>
