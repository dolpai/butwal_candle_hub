import type { RequestHandler } from './$types';
import { getPublishedProducts } from '$lib/server/products';

const BASE_URL = 'https://butwalcandlehub.com.np';

export const GET: RequestHandler = async () => {
  const products = await getPublishedProducts();

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/shop', priority: '0.9', changefreq: 'daily' },
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
    { loc: '/track-order', priority: '0.6', changefreq: 'monthly' }
  ];

  const productPages = products.map((p) => ({
    loc: `/product/${p.slug}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const allPages = [...staticPages, ...productPages];

  const urls = allPages
    .map(
      (page) => `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
};
