import React, { useEffect } from 'react';
import { updateDocumentSeo, BreadcrumbItem, FaqItem } from '../../utils/seoUtils';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[];
  type?: string;
  ogImage?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FaqItem[];
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  keywords,
  type = 'website',
  ogImage,
  breadcrumbs,
  faqs,
  schema,
}) => {
  useEffect(() => {
    updateDocumentSeo({
      title,
      description,
      canonicalPath,
      keywords,
      type,
      breadcrumbs,
      faqs,
      schema,
    });
  }, [title, description, canonicalPath, keywords, type, ogImage, breadcrumbs, faqs, schema]);

  return null; // Side-effect component that updates document head (title, meta description, canonical, OG tags, JSON-LD)
};
