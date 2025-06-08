const fs = require('fs');
const path = require('path');

// Configuration
const DOMAIN = 'https://arthrokinetix.vercel.app';
const BUILD_DIR = path.join(__dirname, '../build');

// Static routes
const staticRoutes = [
  {
    url: '/',
    changefreq: 'daily',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/research',
    changefreq: 'daily', 
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/research-enhanced',
    changefreq: 'daily',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/gallery',
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/profile',
    changefreq: 'weekly',
    priority: '0.6',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/admin',
    changefreq: 'monthly',
    priority: '0.3',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Sample dynamic routes (in production, fetch from API)
const dynamicRoutes = [
  {
    url: '/research/1',
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/research/2', 
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/gallery/1',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/gallery/2',
    changefreq: 'monthly', 
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Combine all routes
const allRoutes = [...staticRoutes, ...dynamicRoutes];

// Generate sitemap XML
const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Generate robots.txt
const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin

# Sitemap
Sitemap: ${DOMAIN}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Allow Google bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Allow Bing bots  
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /
`;
};

// Write files
const writeSitemap = () => {
  try {
    // Ensure build directory exists
    if (!fs.existsSync(BUILD_DIR)) {
      fs.mkdirSync(BUILD_DIR, { recursive: true });
    }

    // Write sitemap.xml
    const sitemapPath = path.join(BUILD_DIR, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, generateSitemap());
    console.log(`✅ Sitemap generated: ${sitemapPath}`);

    // Write robots.txt
    const robotsPath = path.join(BUILD_DIR, 'robots.txt');
    fs.writeFileSync(robotsPath, generateRobotsTxt());
    console.log(`✅ Robots.txt generated: ${robotsPath}`);

    console.log(`📊 Total URLs in sitemap: ${allRoutes.length}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  writeSitemap();
}

module.exports = { generateSitemap, generateRobotsTxt, writeSitemap };