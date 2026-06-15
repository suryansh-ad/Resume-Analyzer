import { absoluteUrl, siteConfig } from "./site";

export function createMetadata({
  title = "Fresherr - AI Resume Analyzer & ATS Resume Checker",
  description = siteConfig.description,
  path = "/",
  image = "/frr-logo.jpeg",
  noIndex = false,
  keywords = siteConfig.keywords,
} = {}) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords,
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
          alt: title,
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
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
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
    "@id": `${siteConfig.url}/#software`,
    name: "Fresherr AI Resume Analyzer",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteConfig.url,
    description: siteConfig.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1240",
      "bestRating": "5",
      "worstRating": "1"
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
    "@id": `${siteConfig.url}/#organization`,
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
        name: "What is a good ATS resume score?",
        acceptedAnswer: {
          "@type": "Answer",
          "text": "A score of 80% or above is considered optimal. This means your resume has adequate keyword density, correct layout structures, and contains no parsing roadblocks."
        },
      },
      {
        "@type": "Question",
        name: "How does the AI Resume Analyzer work?",
        acceptedAnswer: {
          "@type": "Answer",
          "text": "Our analyzer parses your resume's text, comparing it with standard hiring requirements. It checks formatting, reads action words, flags keyword gaps, and computes an estimated ATS compatibility score."
        },
      },
    ],
  };
}

export function blogPostingJsonLd({
  title,
  description,
  path,
  image = "/frr-logo.jpeg",
  datePublished,
  dateModified,
  authorName = "Fresherr Careers Team",
} = {}) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "headline": title,
    "description": description,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": authorName,
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": absoluteUrl("/frr-logo.jpeg"),
      },
    },
    "datePublished": datePublished || new Date().toISOString(),
    "dateModified": dateModified || new Date().toISOString(),
  };
}

