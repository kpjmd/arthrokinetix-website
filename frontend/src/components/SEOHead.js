import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = "Arthrokinetix - Medical Research & Algorithmic Art",
  description = "Where medical research meets emotional intelligence and algorithmic art. Explore evidence-based orthopedic surgery research transformed into unique digital artwork.",
  keywords = "medical research, algorithmic art, orthopedic surgery, sports medicine, emotional AI, research visualization",
  image = "https://arthrokinetix.vercel.app/images/og-image.jpg",
  url = "https://arthrokinetix.vercel.app",
  type = "website",
  article = null
}) => {
  const fullTitle = title.includes('Arthrokinetix') ? title : `${title} | Arthrokinetix`;
  const canonicalUrl = url.startsWith('http') ? url : `https://arthrokinetix.vercel.app${url}`;

  // Generate structured data for articles
  const generateArticleStructuredData = () => {
    if (!article) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.description || description,
      "image": image,
      "datePublished": article.published_date,
      "dateModified": article.updated_date || article.published_date,
      "author": {
        "@type": "Organization",
        "name": "Arthrokinetix Research Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Arthrokinetix",
        "logo": {
          "@type": "ImageObject",
          "url": "https://arthrokinetix.vercel.app/images/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "keywords": article.keywords || keywords,
      "articleSection": article.subspecialty || "Medical Research",
      "about": {
        "@type": "Thing",
        "name": article.subspecialty || "Orthopedic Surgery"
      }
    };
  };

  // Generate organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Arthrokinetix",
    "url": "https://arthrokinetix.vercel.app",
    "logo": "https://arthrokinetix.vercel.app/images/logo.png",
    "description": "Revolutionary platform combining medical research, emotional AI, and algorithmic art",
    "sameAs": [
      "https://github.com/arthrokinetix",
      "https://twitter.com/arthrokinetix"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://arthrokinetix.vercel.app/contact"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Arthrokinetix Research Team" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Arthrokinetix" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@arthrokinetix" />
      <meta name="twitter:site" content="@arthrokinetix" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#2c3e50" />
      <meta name="msapplication-TileColor" content="#2c3e50" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
      
      {article && (
        <script type="application/ld+json">
          {JSON.stringify(generateArticleStructuredData())}
        </script>
      )}
      
      {/* Medical/Scientific Schema for articles */}
      {article && article.subspecialty && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalScholarlyArticle",
            "headline": article.title,
            "about": {
              "@type": "MedicalCondition",
              "name": article.subspecialty
            },
            "medicalSpecialty": "https://schema.org/Orthopedics",
            "funding": {
              "@type": "Grant",
              "funder": {
                "@type": "Organization", 
                "name": "Arthrokinetix Research"
              }
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;