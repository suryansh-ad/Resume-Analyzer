import { absoluteUrl, siteConfig } from "./site";

export function createMetadata({
  title = "Fresherr - AI Resume Analyzer & ATS Resume Checker",
  description = siteConfig.description,
  path = "/",
  image = "/frr-logo.jpeg",
} = {}) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: "Fresherr" }],
    icons: {
      icon: [{ url: "/frr-logo.jpeg", type: "image/jpeg" }],
      shortcut: ["/frr-logo.jpeg"],
      apple: [{ url: "/frr-logo.jpeg", type: "image/jpeg" }],
    },
    verification: {
      google:
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
        "KPR06GIgj8s-t0TXpBt3UQls3b8ZjCjCVFF-yGlRLGo",
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Fresherr AI Resume Analyzer",
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Fresherr",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteConfig.url,
    description: siteConfig.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    featureList: [
      "ATS Resume Checker",
      "Resume Score Checker",
      "AI Resume Review",
      "Keyword Analysis",
      "Resume Optimization Suggestions",
    ],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fresherr",
    url: siteConfig.url,
    logo: absoluteUrl("/frr-logo.jpeg"),
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Fresherr?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fresherr is an AI-powered resume analyzer that checks ATS score, resume score, keywords, and improvement opportunities.",
        },
      },
      {
        "@type": "Question",
        name: "Can Fresherr check ATS compatibility?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Fresherr checks resume structure, contact details, keywords, formatting, impact language, and length balance to estimate ATS readiness.",
        },
      },
    ],
  };
}
