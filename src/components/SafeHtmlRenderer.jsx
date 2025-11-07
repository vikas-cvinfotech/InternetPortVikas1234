'use client';

import DOMPurify from 'dompurify';

export default function SafeHtmlRenderer({ html }) {
  const sanitizedHtml = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  return <div className="html-sandbox" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
