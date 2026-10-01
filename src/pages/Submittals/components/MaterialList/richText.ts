const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const decodeHtml = (value: string) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

export const isEmptyRichText = (html: string) => {
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();
  return !text && !/<img\b/i.test(html);
};

/** Keep a small set of formatting tags and http(s) images. */
export const sanitizeRichText = (html: string) => {
  const source = String(html ?? '');
  if (!source.trim()) return '';
  if (!/<[a-z][\s\S]*>/i.test(source)) {
    return escapeHtml(source).replace(/\n/g, '<br>');
  }

  const withoutScripts = source
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');

  const withImages = withoutScripts.replace(/<img\b[^>]*>/gi, tag => {
    const src = /src\s*=\s*("([^"]*)"|'([^']*)')/i.exec(tag);
    const url = decodeHtml(src?.[2] || src?.[3] || '');
    if (!/^https?:\/\//i.test(url)) return '';
    return `<img src="${escapeHtml(url)}" alt="" />`;
  });

  return withImages.replace(
    /<(?!\/?(p|br|strong|b|em|i|u|ul|ol|li|img|div|span)\b)[^>]*>/gi,
    ''
  );
};

/** Extra height, in page pixels, that a description adds under the ribbons. */
export const descriptionBlockHeight = (html?: string) => {
  if (!html || isEmptyRichText(html)) return 0;
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const images = (html.match(/<img\b/gi) || []).length;
  const blocks = (html.match(/<(p|div|li|br)\b/gi) || []).length;
  const lines = Math.max(blocks || 1, Math.ceil(text.length / 60));
  return 10 + lines * 20 + images * 170;
};
