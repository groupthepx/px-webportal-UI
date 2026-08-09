"use client";

import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import { Suspense, useEffect, useMemo } from "react";

const androidStoreUrl =
  "https://play.google.com/store/apps/details?id=com.thepxgroup.vj";
const iosStoreUrl = "https://apps.apple.com/th/app/px-vj/id6763715241";

export default function SharedLessonClient() {
  return (
    <Suspense fallback={<SharedLessonShell />}>
      <SharedLessonContent />
    </Suspense>
  );
}

function SharedLessonContent() {
  const lessonUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const androidIntentUrl = useMemo(() => {
    const currentUrl = lessonUrl ? new URL(lessonUrl) : null;
    const appPath = currentUrl
      ? `${currentUrl.host}${currentUrl.pathname}${currentUrl.search}`
      : "thepxgroup.co.th/shared-lesson";

    return [
      `intent://${appPath}`,
      "#Intent",
      "scheme=https",
      "package=com.thepxgroup.vj",
      `S.browser_fallback_url=${encodeURIComponent(androidStoreUrl)}`,
      "end",
    ].join(";");
  }, [lessonUrl]);

  useEffect(() => {
    if (!lessonUrl) return;

    const userAgent = navigator.userAgent || "";
    const isAndroid = /Android/i.test(userAgent);
    const isIos = /iPhone|iPad|iPod/i.test(userAgent);
    const redirectKey = `px-vj-open-attempt:${lessonUrl}`;

    if (sessionStorage.getItem(redirectKey) === "1") return;
    if (!isAndroid && !isIos) return;

    sessionStorage.setItem(redirectKey, "1");

    const timer = window.setTimeout(() => {
      if (isAndroid) {
        window.location.href = androidIntentUrl;
        return;
      }

      if (isIos) {
        window.location.href = lessonUrl;
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [androidIntentUrl, lessonUrl]);

  return (
    <SharedLessonShell
      androidIntentUrl={androidIntentUrl}
      lessonUrl={lessonUrl}
    />
  );
}

function SharedLessonShell({
  androidIntentUrl = androidStoreUrl,
  lessonUrl = "/shared-lesson",
}: {
  androidIntentUrl?: string;
  lessonUrl?: string;
}) {
  const openIosLesson = () => {
    window.location.href = lessonUrl || iosStoreUrl;
    window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        window.location.href = iosStoreUrl;
      }
    }, 1300);
  };

  return (
    <main className="sharedLessonPage">
      <section className="sharedLessonCard">
        <div className="sharedLessonAccent" />
        <img
          src="/assets/image/px_vj_splash_logo.png"
          alt="PX VJ"
          className="sharedLessonLogo"
        />
        <h1 className="sharedLessonTitle">
          เปิดบทเรียนในแอป PX VJ
        </h1>
        <p className="sharedLessonDescription">
          หากติดตั้งแอปแล้ว ระบบจะเปิดบทเรียนให้อัตโนมัติ
          และตรวจสอบสิทธิ์สมาชิกก่อนเข้าชมวิดีโอ
        </p>

        <div className="sharedLessonButtons">
          <button
            className="storeButton storeButtonDark"
            onClick={openIosLesson}
            type="button"
          >
            <span className="storeIcon storeIconApple">
              <AppleIcon />
            </span>
            <span className="storeText">
              <span className="storeEyebrow storeEyebrowDark">เปิดหรือดาวน์โหลดบน</span>
              <span className="storeLabel storeLabelDark">App Store</span>
            </span>
          </button>
          <a className="storeButton storeButtonLight" href={androidIntentUrl}>
            <span className="storeIcon storeIconAndroid">
              <AndroidIcon />
            </span>
            <span className="storeText">
              <span className="storeEyebrow storeEyebrowLight">เปิดหรือดาวน์โหลดบน</span>
              <span className="storeLabel storeLabelLight">Google Play</span>
            </span>
          </a>
        </div>
      </section>
      <style jsx>{`
        .sharedLessonPage {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 122, 24, 0.16), transparent 34%),
            linear-gradient(180deg, #fff4ea 0%, #fffaf5 47%, #ffffff 100%);
          color: #1f2937;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 88px 24px;
          font-family:
            Noto Sans Thai,
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        }

        .sharedLessonCard {
          width: min(100%, 998px);
          min-height: 700px;
          background: #ffffff;
          border: 1px solid rgba(241, 89, 42, 0.18);
          border-radius: 56px;
          box-shadow:
            0 36px 86px rgba(127, 65, 28, 0.14),
            0 18px 44px rgba(241, 89, 42, 0.1);
          padding: 66px 48px 52px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .sharedLessonAccent {
          position: absolute;
          inset: 0 0 auto;
          height: 13px;
          background: linear-gradient(90deg, #eea15d 0%, #f1592a 50%, #9f3025 100%);
        }

        .sharedLessonLogo {
          width: 180px;
          height: 180px;
          border-radius: 36px;
          object-fit: cover;
          display: block;
          margin: 0 auto 36px;
          box-shadow:
            0 24px 48px rgba(127, 29, 29, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.76);
        }

        .sharedLessonTitle {
          margin: 0;
          font-size: clamp(48px, 6vw, 72px);
          line-height: 1.08;
          font-weight: 900;
          letter-spacing: 0;
          color: #172033;
        }

        .sharedLessonDescription {
          margin: 26px auto 0;
          max-width: 720px;
          font-size: clamp(24px, 2.6vw, 30px);
          line-height: 1.72;
          color: #6b7280;
          font-weight: 800;
        }

        .sharedLessonButtons {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 30px;
          margin: 58px auto 0;
          max-width: 900px;
        }

        .storeButton {
          width: 100%;
          min-height: 132px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 30px;
          padding: 26px 38px;
          text-decoration: none;
          text-transform: none;
          font-weight: 900;
          cursor: pointer;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
          text-align: left;
        }

        .storeButton:hover {
          transform: translateY(-2px);
        }

        .storeButtonDark {
          border: 2px solid rgba(241, 89, 42, 0.42);
          background: linear-gradient(135deg, #111827 0%, #1f2937 58%, #3a1b13 100%);
          color: #ffffff;
          box-shadow:
            0 24px 58px rgba(17, 24, 39, 0.26),
            0 12px 28px rgba(241, 89, 42, 0.14);
        }

        .storeButtonLight {
          border: 2px solid rgba(241, 89, 42, 0.24);
          background: linear-gradient(135deg, #ffffff 0%, #fff8f2 58%, #ffe9dc 100%);
          color: #111827;
          box-shadow:
            0 22px 48px rgba(127, 65, 28, 0.12),
            0 10px 24px rgba(241, 89, 42, 0.1);
        }

        .storeIcon {
          width: 62px;
          height: 62px;
          flex: 0 0 62px;
          display: grid;
          place-items: center;
          line-height: 1;
        }

        .storeIconApple {
          color: #ffffff;
        }

        .storeIconApple :global(svg) {
          font-size: 58px;
        }

        .storeIconAndroid {
          color: #1fb55f;
        }

        .storeIconAndroid :global(svg) {
          font-size: 44px;
        }

        .storeText {
          display: grid;
          gap: 8px;
          line-height: 1.05;
          min-width: 0;
        }

        .storeEyebrow {
          font-size: clamp(22px, 2.4vw, 26px);
          font-weight: 800;
          white-space: nowrap;
        }

        .storeEyebrowDark {
          color: rgba(255, 255, 255, 0.72);
        }

        .storeEyebrowLight {
          color: #8a4b2d;
        }

        .storeLabel {
          font-size: clamp(34px, 3.7vw, 40px);
          font-weight: 900;
          letter-spacing: 0;
          white-space: nowrap;
        }

        .storeLabelDark {
          color: #ffffff;
        }

        .storeLabelLight {
          color: #172033;
        }

        @media (max-width: 900px) {
          .sharedLessonPage {
            padding: 40px 18px;
          }

          .sharedLessonCard {
            min-height: auto;
            border-radius: 34px;
            padding: 42px 28px 34px;
          }

          .sharedLessonLogo {
            width: 116px;
            height: 116px;
            border-radius: 28px;
            margin-bottom: 24px;
          }

          .sharedLessonTitle {
            font-size: clamp(36px, 9vw, 52px);
          }

          .sharedLessonDescription {
            font-size: clamp(18px, 4.8vw, 24px);
          }

          .sharedLessonButtons {
            grid-template-columns: 1fr;
            gap: 18px;
            margin-top: 36px;
          }

          .storeButton {
            min-height: 96px;
            border-radius: 22px;
            gap: 22px;
            padding: 18px 28px;
          }

          .storeIcon {
            width: 48px;
            height: 48px;
            flex-basis: 48px;
          }

          .storeIconApple {
          }

          .storeIconApple :global(svg) {
            font-size: 46px;
          }

          .storeIconAndroid {
          }

          .storeIconAndroid :global(svg) {
            font-size: 34px;
          }

          .storeEyebrow {
            font-size: 18px;
          }

          .storeLabel {
            font-size: 30px;
          }
        }

        @media (max-width: 430px) {
          .sharedLessonPage {
            padding: 28px 14px;
          }

          .sharedLessonCard {
            border-radius: 28px;
            padding: 34px 18px 24px;
          }

          .sharedLessonLogo {
            width: 92px;
            height: 92px;
            border-radius: 24px;
            margin-bottom: 18px;
          }

          .sharedLessonTitle {
            font-size: 30px;
          }

          .sharedLessonDescription {
            margin-top: 12px;
            font-size: 16px;
            line-height: 1.7;
          }

          .sharedLessonButtons {
            margin-top: 28px;
            gap: 14px;
          }

          .storeButton {
            min-height: 76px;
            border-radius: 18px;
            gap: 16px;
            padding: 13px 18px;
          }

          .storeIcon {
            width: 40px;
            height: 40px;
            flex-basis: 40px;
          }

          .storeIconApple {
          }

          .storeIconApple :global(svg) {
            font-size: 38px;
          }

          .storeIconAndroid {
          }

          .storeIconAndroid :global(svg) {
            font-size: 28px;
          }

          .storeEyebrow {
            font-size: 13px;
          }

          .storeLabel {
            font-size: 24px;
          }
        }
      `}</style>
    </main>
  );
}
