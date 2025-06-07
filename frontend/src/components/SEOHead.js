import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = "Arthrokinetix - Medical Research & Algorithmic Art",
  description = "Where medical research meets emotional intelligence and algorithmic art. Discover evidence-based orthopedic research transformed into stunning visual experiences.",
  url = "",
  image = "",
  type = "website",
  keywords = "medical research, algorithmic art, emotional intelligence, orthopedic surgery, sports medicine, AI analysis",
  author = "Arthrokinetix",
  article = null
}) => {
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image ? `${baseUrl}${image}` : `${baseUrl}/og-image.png`;

  // Generate article-specific structured data
  const articleStructuredData = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.meta_description || description,
    "image": fullImage,
    "author": {
      "@type": "Organization",
      "name": "Arthrokinetix Research Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Arthrokinetix",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": article.published_date,
    "dateModified": article.published_date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Medical Research"
      },
      {
        "@type": "Thing", 
        "name": "Emotional Intelligence"
      },
      {
        "@type": "Thing",
        "name": "Algorithmic Art"
      }
    ],
    "keywords": [
      article.subspecialty,
      article.emotional_data?.dominant_emotion,
      "medical research",
      "emotional analysis",
      "algorithmic art"
    ].filter(Boolean).join(", ")
  } : null;

  // Generate website structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Arthrokinetix",
    "description": description,
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Generate organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Arthrokinetix",
    "description": "Revolutionary platform combining medical research with emotional intelligence and algorithmic art",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "foundingDate": "2024",
    "sameAs": [
      "https://github.com/kpjmd/arthrokinetix-website"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@arthrokinetix.com"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Arthrokinetix" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@arthrokinetix" />
      <meta name="twitter:creator" content="@arthrokinetix" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#2c3e50" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Arthrokinetix" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>

      {articleStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(articleStructuredData)}
        </script>
      )}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//api.anthropic.com" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Article-specific meta tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.published_date} />
          <meta property="article:modified_time" content={article.published_date} />
          <meta property="article:author" content="Arthrokinetix Research Team" />
          <meta property="article:section" content="Medical Research" />
          <meta property="article:tag" content={article.subspecialty} />
          <meta property="article:tag" content={article.emotional_data?.dominant_emotion} />
          <meta property="article:tag" content="Emotional Intelligence" />
          <meta property="article:tag" content="Algorithmic Art" />
        </>
      )}
    </Helmet>
  );
};

export default SEOHead;