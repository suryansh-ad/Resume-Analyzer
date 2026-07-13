import { Sora, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { createMetadata, organizationJsonLd } from "../lib/seo";
import { LayoutWrapper } from "../components/LayoutWrapper";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = createMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${sora.variable} ${poppins.variable} font-sans`}>
        <Script id="organization-json-ld" type="application/ld+json">
          {JSON.stringify(organizationJsonLd())}
        </Script>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
