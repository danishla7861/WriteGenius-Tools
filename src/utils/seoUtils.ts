/**
 * Updates document head SEO tags dynamically for single-page routing
 */
export interface SeoConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: string;
  schema?: Record<string, unknown>;
}

export function updateDocumentSeo(config: SeoConfig): void {
  if (typeof document === 'undefined') return;

  // 1. Title
  document.title = config.title;

  // 2. Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', config.description);

  // 3. OpenGraph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', config.title);

  // 4. OpenGraph Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', config.description);

  // 5. Canonical URL
  const canonicalUrl = `${window.location.origin}${config.canonicalPath || window.location.pathname}`;
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

  // 6. JSON-LD structured data
  if (config.schema) {
    let scriptTag = document.getElementById('dynamic-json-ld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-json-ld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(config.schema);
  }
}
