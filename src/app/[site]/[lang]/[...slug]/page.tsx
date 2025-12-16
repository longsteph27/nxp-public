import React from 'react';
import { fetchNavigationSafe } from '@/directus/queries/navigation';
// fetchPage remove? Yes.
import { getSite } from '@/directus/queries/sites';
// Header/Footer remove? Yes.
import { PageProps } from '@/types/next';
import PageClient from '@/components/PageClient';

export default async function SlugPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const { site, lang, slug } = resolvedParams;

  // Construct the current pathname on the server side
  const currentPathname = `/${site}/${lang}${slug && slug.length > 0 ? `/${slug.join('/')}` : ''}`;

  console.log('\n=== Page Component Debug ===');
  console.log('Site:', site);
  console.log('Language:', lang);
  console.log('Slug:', slug);
  console.log('Current Pathname:', currentPathname);

  // Fetch site data to get siteId (if multi-tenant)
  const siteData = await getSite(site);

  // Fetch navigation (main/footer)
  const [mainNav, footerNav] = await Promise.all([
    fetchNavigationSafe(site, lang, 'header'),
    fetchNavigationSafe(site, lang, 'footer')
  ]);

  console.log('\n=== Navigation Data ===');
  console.log('Header Navigation:', mainNav);
  console.log('Footer Navigation:', footerNav);
  console.log('Site Data:', siteData);

  // Determine permalink from slug
  const permalink = !slug || slug.length === 0 || (slug.length === 1 && slug[0] === site) ? '/' : `/${slug.join('/')}`;

  return (
    <PageClient
      site={site}
      lang={lang}
      permalink={permalink}
      mainNav={mainNav}
      footerNav={footerNav}
      siteData={siteData}
    />
  );
}