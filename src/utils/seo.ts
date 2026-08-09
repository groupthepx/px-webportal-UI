/**
 * SEO Utilities
 * ======================================
 * Helper functions สำหรับการจัดการ SEO และ metadata
 */

import { Metadata } from 'next';

// Base URL ของ website
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://px-group.com';
const SITE_NAME = 'The PX Group';
const DEFAULT_DESCRIPTION = 'The PX Group - แพลตฟอร์มเครือข่ายธุรกิจที่ครบวงจร พร้อมระบบรางวัลและโอกาสในการเติบโต';
const DEFAULT_IMAGE = `${SITE_URL}/assets/image/cover_lading.png`;

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

/**
 * สร้าง metadata สำหรับหน้าต่างๆ
 * 
 * @example
 * ```ts
 * export const metadata = generateMetadata({
 *   title: 'หน้าหลัก',
 *   description: 'ยินดีต้อนรับสู่ PX Group'
 * });
 * ```
 */
export function generateMetadata(props: SEOProps = {}): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    keywords = [],
    author = SITE_NAME,
    publishedTime,
    modifiedTime,
    noIndex = false,
  } = props;

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [
      'PX Group',
      'ธุรกิจ',
      'เครือข่าย',
      'รางวัล',
      'VJ Star Live',
      ...keywords,
    ],
    authors: [{ name: author }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    
    // Open Graph
    openGraph: {
      type,
      locale: 'th_TH',
      url: pageUrl,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@pxgroup',
    },

    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },

    // Additional metadata
    alternates: {
      canonical: pageUrl,
      languages: {
        'th-TH': pageUrl,
        'en-US': pageUrl,
        'lo-LA': pageUrl,
      },
    },
  };

  // เพิ่ม article metadata ถ้าเป็นบทความ
  if (type === 'article' && (publishedTime || modifiedTime)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
    };
  }

  return metadata;
}

/**
 * สร้าง JSON-LD Schema สำหรับ SEO
 */
export function generateJsonLd(type: string, data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}

/**
 * Organization Schema
 */
export const organizationSchema = generateJsonLd('Organization', {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/svg/logo.svg`,
  description: DEFAULT_DESCRIPTION,
  sameAs: [
    'https://www.facebook.com/pxgroup',
    'https://www.instagram.com/pxgroup',
    'https://www.youtube.com/pxgroup',
    'https://www.tiktok.com/@pxgroup',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    availableLanguage: ['th', 'en', 'lo'],
  },
});

/**
 * Website Schema
 */
export const websiteSchema = generateJsonLd('WebSite', {
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/assets/svg/logo.svg`,
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

/**
 * Breadcrumb Schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return generateJsonLd('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  });
}

/**
 * Article Schema
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  url: string;
}) {
  return generateJsonLd('Article', {
    headline: article.title,
    description: article.description,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/svg/logo.svg`,
      },
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${article.url}`,
    },
  });
}

/**
 * FAQ Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return generateJsonLd('FAQPage', {
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

/**
 * Product Schema
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: string;
  url: string;
}) {
  return generateJsonLd('Product', {
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'THB',
      availability: product.availability || 'https://schema.org/InStock',
      url: `${SITE_URL}${product.url}`,
    },
  });
}

export default {
  generateMetadata,
  generateJsonLd,
  organizationSchema,
  websiteSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateProductSchema,
};

