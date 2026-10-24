"use client";

// ============================================================
// MotionMedia — رسانه آفلاین حرکت: فلیپ‌بوک مرحله‌به‌مرحله + ویدیوی لوکال
// گارد فایل مفقود: هر مسیر قبل از رندر با HEAD بی‌صدا پروب می‌شود
// (fetch 404 نویز کنسول ندارد، برخلاف <img>) + onError به‌عنوان لایه دوم.
// هیچ crash و هیچ broken-image — فال‌بک همیشه به عکس اصلی حرکت.
// ============================================================

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Image as ImageIcon,
  LoaderCircle,
  Maximize2,
  Pause,
  Play,
  Video,
  WifiOff,
} from "lucide-react";
import type { MotionMediaData } from "@/lib/media";
import { probeMedia } from "@/lib/media";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** فاصله سواپ فریم فلیپ‌بوک */
const FLIP_INTERVAL_MS = 900;

type MediaMode = "flipbook" | "video";

export interface MotionMediaProps {
  /** عکس اصلی حرکت — فال‌بک همیشگی */
  photo: string;
  /** فال‌بک دوم (مثلاً عکس نسخه پایه وقتی عکس نسخه جایگزین غایب است) */
  fallbackPhoto?: string;
  alt: string;
  media?: MotionMediaData;
  /** حالت فشرده: فلیپ‌بوک بی‌کنترل روی عکس + باز کردن نسخه کامل در Dialog */
  compact?: boolean;
  className?: string;
}

/** تشخیص کاهش موشن — media query سیستم + سوییچ دستی پروفایل (html.reduce-motion) */
function subscribeReducedMotion(onChange: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  // سوییچ دستی «ظاهر و تجربه» کلاس روی html می‌گذارد — همان تغییر را گوش می‌دهیم
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => {
    mq.removeEventListener("change", onChange);
    obs.disconnect();
  };
}

function getReducedMotionSnapshot(): boolean {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("reduce-motion")
  );
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
}

/** پروب گروه فریم‌ها — همه فریم‌ها باید باشند وگرنه فلیپ‌بوک غیرفعال می‌شود */
function useSequenceReady(seq?: string[]): boolean | null {
  const [ready, setReady] = useState<boolean | null>(() =>
    seq && seq.length > 0 ? null : false
  );
  useEffect(() => {
    if (!seq || seq.length === 0) return;
    let alive = true;
    Promise.all(seq.map((f) => probeMedia(f))).then((results) => {
      if (alive) setReady(results.every(Boolean));
    });
    return () => {
      alive = false;
    };
  }, [seq]);
  return ready;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// ------------------------------------------------------------
// حالت کامل — صحنه + کنترل فلیپ‌بوک/ویدیو
// ------------------------------------------------------------

function FullMedia({ photo, fallbackPhoto, alt, media, className }: MotionMediaProps) {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<MediaMode>("flipbook");
  const [idx, setIdx] = useState(0);
  const [frameError, setFrameError] = useState(false);
  const [stepError, setStepError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  // عکس مؤثر — اگر عکس اصلی شکست خورد، فال‌بک دوم (سپس جای‌نگهدار)
  const effectivePhoto =
    photoError && fallbackPhoto && !fallbackError ? fallbackPhoto : photo;
  const onPhotoError = () =>
    effectivePhoto === photo ? setPhotoError(true) : setFallbackError(true);

  const frames = media?.frames ?? [];
  const steps = media?.steps ?? [];
  const framesReady = useSequenceReady(frames);
  const stepsReady = useSequenceReady(steps);

  const [videoReady, setVideoReady] = useState<boolean | null>(() =>
    media?.video ? null : false
  );
  useEffect(() => {
    const video = media?.video;
    if (!video) return;
    let alive = true;
    probeMedia(video).then((ok) => {
      if (alive) setVideoReady(ok);
    });
    return () => {
      alive = false;
    };
  }, [media?.video]);

  // پخش = دست‌کاری کاربر؟ اگر نه: پیش‌فرض توقف هنگام کاهش موشن
  const [playOverride, setPlayOverride] = useState<boolean | null>(null);
  const playing = playOverride ?? !reduced;

  // زنجیره فلیپ‌بوک: فریم‌های ویدیویی → عکس‌های مرحله‌ای → عکس ثابت
  const usingFrames =
    !!media && framesReady === true && !frameError && frames.length > 0;
  const usingSteps =
    !usingFrames &&
    !!media &&
    stepsReady === true &&
    !stepError &&
    steps.length > 0;
  const flipActive = usingFrames || usingSteps;
  const sequence = usingFrames ? frames : steps;
  const labels = usingFrames
    ? (media?.phases ?? [])
    : (media?.stepPhases ?? []);
  const hasVideo = !!media && videoReady === true && !videoError;
  const showVideo = hasVideo && mode === "video";
  const preparing = !!media && !flipActive && !showVideo;

  // چرخه فلیپ‌بوک — پاک‌سازی در unmount/توقف
  useEffect(() => {
    if (!playing || !flipActive || sequence.length < 2) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % sequence.length),
      FLIP_INTERVAL_MS
    );
    return () => clearInterval(t);
  }, [playing, flipActive, sequence.length]);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (sequence.length === 0) return;
      setIdx((i) => (i + dir + sequence.length) % sequence.length);
    },
    [sequence.length]
  );

  return (
    <figure
      data-testid="motion-media"
      data-mode={showVideo ? "video" : flipActive ? (usingSteps ? "steps" : "flipbook") : "photo"}
      data-frames={
        flipActive ? "ok" : framesReady === false ? "missing" : "probing"
      }
      data-steps={
        usingSteps ? "ok" : stepsReady === false ? "missing" : "probing"
      }
      data-video={hasVideo ? "ok" : videoReady === false ? "missing" : "probing"}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border/60 bg-secondary/40",
        className
      )}
    >
      {/* ---------- صحنه ---------- */}
      <div className="relative min-h-32 flex-1 bg-secondary/40">
        {showVideo ? (
          <video
            src={media?.video}
            poster={photo}
            controls
            loop
            playsInline
            preload="metadata"
            aria-label={`ویدیوی آموزش ${alt} — پخش لوکال`}
            className="absolute inset-0 h-full w-full bg-black/50 object-contain"
            onError={() => {
              setVideoError(true);
              setMode("flipbook");
            }}
          />
        ) : flipActive ? (
          sequence.map((f, i) => (
            <img
              key={f}
              src={f}
              alt={i === idx ? alt : ""}
              aria-hidden={i !== idx}
              loading="lazy"
              onError={() =>
                usingFrames ? setFrameError(true) : setStepError(true)
              }
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
                i === idx ? "opacity-100" : "opacity-0"
              )}
            />
          ))
        ) : photoError && effectivePhoto === photo ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <ImageIcon className="h-8 w-8" aria-hidden="true" />
            <span className="text-xs">تصویر در دسترس نیست</span>
          </div>
        ) : (
          <img
            src={effectivePhoto}
            alt={alt}
            loading="lazy"
            onError={onPhotoError}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* لیبل فاز فعلی — پایین-انتها (بدون تداخل با نشان‌های بیرونی کارت) */}
        {flipActive && !showVideo && (
          <span className="absolute bottom-2 end-2 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            {labels[idx % Math.max(1, labels.length)]}
          </span>
        )}

        {/* نشان رسانه در حال آماده‌سازی — فریم‌ها هنوز تولید نشده‌اند (جایگاه مشترک با لیبل فاز) */}
        {preparing && (
          <span className="absolute bottom-2 end-2 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            <LoaderCircle className="h-3 w-3 animate-spin" aria-hidden="true" />
            رسانه در حال آماده‌سازی
          </span>
        )}

        {/* سوییچ حالت — فقط وقتی ویدیو واقعاً موجود است */}
        {hasVideo && (
          <div
            role="group"
            aria-label="انتخاب نوع نمایش رسانه"
            className="absolute end-2 top-2 flex items-center gap-0.5 rounded-full bg-black/65 p-1 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setMode("flipbook")}
              aria-pressed={mode === "flipbook"}
              aria-label="نمایش مرحله‌به‌مرحله"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white",
                mode === "flipbook"
                  ? "bg-primary text-primary-foreground"
                  : "text-white/85 hover:text-white",
                focusRing
              )}
            >
              <Clapperboard className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setMode("video")}
              aria-pressed={mode === "video"}
              aria-label="پخش ویدیو"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white",
                mode === "video"
                  ? "bg-primary text-primary-foreground"
                  : "text-white/85 hover:text-white",
                focusRing
              )}
            >
              <Video className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* ---------- نوار کنترل ---------- */}
      {(flipActive || showVideo) && (
        <figcaption className="flex items-center gap-0.5 border-t border-border/60 bg-secondary/70 px-1.5 py-1">
          {showVideo ? (
            <span className="flex min-w-0 flex-1 items-center gap-2 px-1.5 py-1">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold text-primary">
                <WifiOff className="h-3 w-3" aria-hidden="true" />
                لوکال و آفلاین
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                ویدیو روی همین دستگاه پخش می‌شود — بدون اینترنت
              </span>
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPlayOverride(!playing)}
                aria-pressed={playing}
                aria-label={
                  playing
                    ? "توقف پیمایش مرحله‌به‌مرحله"
                    : "پخش پیمایش مرحله‌به‌مرحله"
                }
                className={cn(
                  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/15",
                  focusRing
                )}
              >
                {playing ? (
                  <Pause className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Play className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="فاز قبلی"
                className={cn(
                  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  focusRing
                )}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <span
                className="flex min-w-4 flex-1 items-center justify-center gap-1"
                aria-hidden="true"
              >
                {sequence.map((f, i) => (
                  <span
                    key={f}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-200",
                      i === idx ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/40"
                    )}
                  />
                ))}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="فاز بعدی"
                className={cn(
                  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  focusRing
                )}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}

// ------------------------------------------------------------
// حالت فشرده — فلیپ‌بوک بی‌کنترل روی عکس + باز کردن نسخه کامل در Dialog
// ------------------------------------------------------------

function CompactMedia({ photo, fallbackPhoto, alt, media, className }: MotionMediaProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [frameError, setFrameError] = useState(false);
  const [stepError, setStepError] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const effectivePhoto =
    photoError && fallbackPhoto && !fallbackError ? fallbackPhoto : photo;
  const onPhotoError = () =>
    effectivePhoto === photo ? setPhotoError(true) : setFallbackError(true);

  const frames = media?.frames ?? [];
  const steps = media?.steps ?? [];
  const framesReady = useSequenceReady(frames);
  const stepsReady = useSequenceReady(steps);
  const usingFrames =
    !!media && framesReady === true && !frameError && frames.length > 0;
  const usingSteps =
    !usingFrames &&
    !!media &&
    stepsReady === true &&
    !stepError &&
    steps.length > 0;
  const flipActive = usingFrames || usingSteps;
  const sequence = usingFrames ? frames : steps;

  // فلیپ‌بوک کوچک — وقتی Dialog باز است یا کاهش موشن، می‌ایستد
  useEffect(() => {
    if (open || reduced || !flipActive || sequence.length < 2) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % sequence.length),
      FLIP_INTERVAL_MS
    );
    return () => clearInterval(t);
  }, [open, reduced, flipActive, sequence.length]);

  return (
    <>
      <button
        type="button"
        onClick={media ? () => setOpen(true) : undefined}
        disabled={!media}
        aria-haspopup="dialog"
        aria-label={media ? `${alt} — نمایش بزرگ رسانه` : alt}
        data-testid="motion-media-compact"
        className={cn(
          "relative block shrink-0 overflow-hidden rounded-xl border border-border/60 bg-secondary/40 p-0",
          media &&
            "cursor-zoom-in transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
          className
        )}
      >
        {flipActive ? (
          sequence.map((f, i) => (
            <img
              key={f}
              src={f}
              alt=""
              loading="lazy"
              onError={() =>
                usingFrames ? setFrameError(true) : setStepError(true)
              }
              className={cn(
                "h-full w-full object-cover transition-opacity duration-200",
                i === idx
                  ? "relative opacity-100"
                  : "absolute inset-0 opacity-0"
              )}
            />
          ))
        ) : photoError && effectivePhoto === photo ? (
          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : (
          <img
            src={effectivePhoto}
            alt={alt}
            loading="lazy"
            onError={onPhotoError}
            className="h-full w-full object-cover"
          />
        )}

        {/* نشان باز کردن — فقط وقتی رسانه‌ای در کار است */}
        {media && (
          <span
            aria-hidden="true"
            className="absolute bottom-1 end-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md gap-3 p-4 sm:p-5">
          <DialogTitle className="text-base font-bold">{alt}</DialogTitle>
          <DialogDescription className="sr-only">
            رسانه آموزشی: پیمایش مرحله‌به‌مرحله و ویدیوی لوکال و آفلاین
          </DialogDescription>
          <FullMedia
            photo={photo}
            alt={alt}
            media={media}
            className="aspect-video w-full"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

// ------------------------------------------------------------

export default function MotionMedia(props: MotionMediaProps) {
  return props.compact ? <CompactMedia {...props} /> : <FullMedia {...props} />;
}
