/**
 * JsonLd Component
 * ======================================
 * Component สำหรับแทรก JSON-LD schema ใน head
 */

import React from 'react';
import Script from 'next/script';

interface JsonLdProps {
  data: Record<string, any>;
}

/**
 * JsonLd - Component สำหรับแทรก structured data
 * 
 * @example
 * ```tsx
 * import { organizationSchema } from '@/utils/seo';
 * 
 * <JsonLd data={organizationSchema} />
 * ```
 */
export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <Script
      id={`json-ld-${data['@type']}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  );
};

export default JsonLd;

