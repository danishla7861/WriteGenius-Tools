/**
 * Updates document head SEO tags dynamically for single-page routing
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[];
  type?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FaqItem[];
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

export function updateDocumentSeo(config: SeoConfig): void {
  if (typeof document === 'undefined') return;

  // 1. Title
  document.title = config.title;

  // Helper to set or create meta tag
  const setMeta = (attrName: 'name' | 'property', attrValue: string, content: string) => {
    let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Meta description & Keywords
  setMeta('name', 'description', config.description);
  if (config.keywords && config.keywords.length > 0) {
    setMeta('name', 'keywords', config.keywords.join(', '));
  }

  // 3. OpenGraph Tags
  setMeta('property', 'og:type', config.type || 'website');
  setMeta('property', 'og:title', config.title);
  setMeta('property', 'og:description', config.description);
  setMeta('property', 'og:site_name', 'WriteGenius Tools');

  // 4. Twitter / X Cards
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', config.title);
  setMeta('name', 'twitter:description', config.description);

  // 5. Canonical URL
  const origin = window.location.origin;
  const canonicalUrl = `${origin}${config.canonicalPath || window.location.pathname}`;
  
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('name', 'twitter:url', canonicalUrl);

  // 6. JSON-LD structured data graph
  const schemas: Record<string, unknown>[] = [];

  // Main custom schema
  if (config.schema) {
    if (Array.isArray(config.schema)) {
      schemas.push(...config.schema);
    } else {
      schemas.push(config.schema);
    }
  }

  // BreadcrumbList Schema
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: config.breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url.startsWith('http') ? b.url : `${origin}${b.url}`,
      })),
    });
  }

  // FAQPage Schema
  if (config.faqs && config.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: config.faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  // Inject or update structured data
  if (schemas.length > 0) {
    let scriptTag = document.getElementById('dynamic-json-ld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-json-ld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const payload = schemas.length === 1 ? schemas[0] : {
      '@context': 'https://schema.org',
      '@graph': schemas,
    };
    scriptTag.textContent = JSON.stringify(payload, null, 2);
  }
}
