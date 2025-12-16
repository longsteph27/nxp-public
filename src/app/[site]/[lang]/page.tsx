import React from 'react';
import { fetchNavigationSafe } from '@/directus/queries/navigation';
// fetchPage is no longer used here but keeping import might be needed if generatedMetadata uses it (implied, though not in snippet)
// But for cleaner code, I will remove it if it's not used. 
// However, the previous view didn't show generateMetadata using it? 
// Actually, I'll keep fetchPage import just in case generateMetadata (which I haven't seen fully) needs it, 
// or I can assume it's safe to remove. 
// Given the snippet, I'll just add PageClient.
import { getSite } from '@/directus/queries/sites';
// TheHeader/Footer are now used inside PageClient? No, PageClient uses them.
// Wait, PageClient renders TheHeader/Footer. So I don't need them here?
// Correct. I can remove them from here if PageClient handles them.
import PageClient from '@/components/PageClient';
import { PageProps } from '@/types/next';

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const { site, lang } = resolvedParams;

  // Construct the current pathname on the server side
  const currentPathname = `/${site}/${lang}`;

  console.log('\n=== Page Component Debug ===');
  console.log('Site:', site);
  console.log('Language:', lang);
  console.log('Current Pathname:', currentPathname);

  // Fetch navigation (main/footer)
  const [mainNav, footerNav, siteData] = await Promise.all([
    fetchNavigationSafe(site, lang, 'header'),
    fetchNavigationSafe(site, lang, 'footer'),
    getSite(site)
  ]);

  console.log('\n=== Navigation Data ===');
  console.log('Header Navigation:', mainNav);
  console.log('Footer Navigation:', footerNav);
  console.log('Site Data:', siteData);

  // Render client component for page content
  return (
    <PageClient
      site={site}
      lang={lang}
      permalink="/"
      mainNav={mainNav}
      footerNav={footerNav}
      siteData={siteData}
    />
  );
}
