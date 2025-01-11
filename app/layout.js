import "./globals.css";
import { cx } from "@/utils";
import { Inter, Manrope } from "next/font/google";
import Header from "@/components/Header";
import siteMetadata from "@/utils/siteMetaData";
import Script from "next/script";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-in",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mr",
});

// Define metadata with Open Graph and Twitter settings
export const metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    images: [siteMetadata.socialBanner],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense account meta tag */}
        <meta name="google-adsense-account" content="ca-pub-6998086632927114" />
        {/* Google Site Verification meta tag */}
        <meta
          name="google-site-verification"
          content="Sscep0wpKsIUKeOJTHedOcq4NhzBBVW6TOzf809HvTY"
        />
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z8EPRTG6VF"
        />
        <Script id="gtag-init">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z8EPRTG6VF');`}
        </Script>
        {/* Impact Site Verification meta tag */}
        <meta
          name="impact-site-verification"
          content="b4e29fa5-7e74-46cb-aded-390407d6a8ff"
        />
        {/* Google AdSense script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6998086632927114"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cx(
          inter.variable,
          manrope.variable,
          "font-mr bg-light dark:bg-dark"
        )}
      >
        {/* Theme switcher script for dark/light mode */}
        <Script id="theme-switcher" strategy="beforeInteractive">
          {`if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }`}
        </Script>

        {/* Header and Footer are included around children */}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
