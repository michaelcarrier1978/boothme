import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-archivo",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://boothme.app");

const title = "BoothMe — Vendor Show Management, Simplified";
const description =
  "The all-in-one platform for event organizers. Manage applications, vendors, and booth assignments — without the spreadsheet chaos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: {
    icon: "/ticket-office.png",
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    siteName: "BoothMe",
    images: [
      {
        url: "/event-owner-map.gif",
        width: 2230,
        height: 1254,
        alt: "BoothMe — drag vendors onto a live floor plan as they apply",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/event-owner-map.gif"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={archivo.variable}>
      <head>
        <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
      </head>
      <body>
        {children}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1593221715528386&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
      <Script src="https://t.contentsquare.net/uxa/387747c8d7a80.js" strategy="afterInteractive" />
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-MWZLTLDJ57" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MWZLTLDJ57');
        `}
      </Script>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1593221715528386');
          fbq('track', 'PageView');
        `}
      </Script>
    </html>
  );
}
