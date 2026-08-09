import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/theme/ThemeProvider";
import { CssBaseline } from "@mui/material";
import LauoutProviders from "./LayoutProviders";
import { SidebarProvider } from "@/contexts/SidebarContext";
// import { getServerSession } from "next-auth";
// import SessionProvider from "@/components/SessionProvider";
import StoreProvider from "./StoreProvider";
import SessionProvider from "./SessionProvider";
import LocalizationProviders from "./LocalizationProviders";
import SnackbarProviders from "./SnackbarProvider";
import Script from "next/script";
import I18nProvider from "./I18nProvider";

export const notoSansThai = localFont({
  src: "./fonts/NotoSansThai.ttf",
  variable: "--font-thai-nato",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "The PX Group - เครือข่ายธุรกิจชั้นนำ",
    template: "%s | The PX Group"
  },
  description: "The PX Group - แพลตฟอร์มเครือข่ายธุรกิจที่ครบวงจร พร้อมระบบรางวัลและโอกาสในการเติบโต",
  keywords: ["PX Group", "ธุรกิจ", "เครือข่าย", "รางวัล", "VJ Star Live"],
  authors: [{ name: "The PX Group" }],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "The PX Group",
    title: "The PX Group - เครือข่ายธุรกิจชั้นนำ",
    description: "The PX Group - แพลตฟอร์มเครือข่ายธุรกิจที่ครบวงจร",
  },
  twitter: {
    card: "summary_large_image",
    title: "The PX Group",
    description: "The PX Group - แพลตฟอร์มเครือข่ายธุรกิจที่ครบวงจร",
  },
  robots: {
    index: true,
    follow: true,
  },
  };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};




export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const session = await getServerSession()


  return (
    <html lang="th">
      <head>
        <link 
          rel="stylesheet" 
          href="/stimulsoft/stimulsoft.viewer.office2013.whiteblue.css"
        />
        <link rel="preconnect" href="https://px-spaces.sgp1.cdn.digitaloceanspaces.com" />
        <link rel="dns-prefetch" href="https://px-api.mooo.com" />
      </head>
      <body
        className={` ${notoSansThai.className} antialiased`}
      >
        <Script 
          src="/scripts/stimulsoft.reports.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="/scripts/stimulsoft.viewer.js" 
          strategy="beforeInteractive"
        />
        <Script id="sti-license-key" strategy="afterInteractive">
          {`
            if (typeof Stimulsoft !== 'undefined') {
              Stimulsoft.Base.StiLicense.Key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7koivWV0htru4Pn2682yhdY3+9jxMCVTKcKAjiEjgJzqXgLFCpe62hxJ7/VJZ9Hq5l39md0pyydqd5Dc1fSWhCtYqC042BVmGNkukYJQN0ufCozjA/qsNxzNMyEql26oHE6wWE77pHutroj+tKfOO1skJ52cbZklqPm8OiH/9mfU4rrkLffOhDQFnIxxhzhr2BL5pDFFCZ7axXX12y/4qzn5QLPBn1AVLo3NVrSmJB2KiwGwR4RL4RsYVxGScsYoCZbwqK2YrdbPHP0t5vOiLjBQ+Oy6F4rNtDYHn7SNMpthfkYiRoOibqDkPaX+RyCany0Z+uz8bzAg0oprJEn6qpkQ56WMEppdMJ9/CBnEbTFwn1s/9s8kYsmXCvtI4iQcz+RkUWspLcBzlmj0lJXWjTKMRZz+e9PmY11Au16wOnBU3NHvRc9T/Zk0YFh439GKd/fRwQrk8nJevYU65ENdAOqiP5po7Vnhif5FCiHRpxgF";
            }
          `}
        </Script>
        <I18nProvider>
          <StoreProvider >
            <SidebarProvider>
              <SessionProvider >
                <ThemeProvider >
                  <LocalizationProviders>
                    <SnackbarProviders>
                      <CssBaseline />
                      <LauoutProviders>
                        {children}
                      </LauoutProviders>
                    </SnackbarProviders>
                  </LocalizationProviders>
                </ThemeProvider>
              </SessionProvider>
            </SidebarProvider>
          </StoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
