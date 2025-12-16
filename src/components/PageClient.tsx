'use client'

import React from 'react'
import PageBuilder from '@/components/PageBuilder'
import { usePage } from '@/hooks/usePage'
import TheHeader from '@/components/navigation/TheHeader'
import TheFooter from '@/components/navigation/TheFooter'
import { Navigation } from '@/directus/types'

interface PageClientProps {
    site: string
    lang: string
    permalink: string
    mainNav: Navigation | null
    footerNav: Navigation | null
    siteData: any
}

export default function PageClient({
    site,
    lang,
    permalink,
    mainNav,
    footerNav,
    siteData,
}: PageClientProps) {
    const { data: pageContent, isLoading, isError } = usePage({
        site,
        lang,
        permalink,
    })

    // Construct current pathname for header/footer
    // If permalink is just '/', use /site/lang
    // Otherwise append permalink
    const currentPathname = `/${site}/${lang}${permalink === '/' ? '' : permalink}`

    if (isLoading) {
        return (
            <>
                <TheHeader
                    navigation={mainNav}
                    lang={lang}
                    site={siteData?.slug || site}
                    siteData={siteData}
                    translations={[]}
                    pathname={currentPathname}
                />
                <div className='flex min-h-screen w-full items-center justify-center bg-gray-50 py-12'>
                    <span className='loading loading-spinner loading-lg text-primary'></span>
                </div>
                <TheFooter
                    navigation={footerNav}
                    lang={lang}
                    pathname={currentPathname}
                />
            </>
        )
    }

    if (isError || !pageContent) {
        return (
            <>
                <TheHeader
                    navigation={mainNav}
                    lang={lang}
                    site={siteData?.slug || site}
                    siteData={siteData}
                    translations={[]}
                    pathname={currentPathname}
                />
                <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50'>
                    <div className='mx-auto max-w-2xl px-4 py-12'>
                        <h1 className='mb-4 text-3xl font-bold'>404 - Page Not Found</h1>
                        <div className='mb-2'>
                            Site: <b>{site}</b>
                        </div>
                        <div className='mb-2'>
                            Lang: <b>{lang}</b>
                        </div>
                        <div className='mb-2'>
                            Permalink: <b>{permalink}</b>
                        </div>
                        <div className='mt-4 rounded bg-gray-100 p-4'>
                            <p className='text-sm text-gray-600'>
                                The requested page could not be loaded via the API.
                            </p>
                        </div>
                    </div>
                </div>
                <TheFooter
                    navigation={footerNav}
                    lang={lang}
                    pathname={currentPathname}
                />
            </>
        )
    }

    return (
        <>
            <TheHeader
                navigation={mainNav}
                lang={lang}
                site={siteData?.slug || site}
                siteData={siteData}
                translations={pageContent?.translations || []}
                pathname={currentPathname}
            />
            <div className='min-h-screen w-full bg-gray-50 py-12'>
                <div className='w-full px-4 md:px-8 lg:px-16'>
                    <PageBuilder
                        blocks={Array.isArray(pageContent.blocks) ? pageContent.blocks : []}
                        lang={lang}
                    />
                </div>
            </div>
            <TheFooter
                navigation={footerNav}
                lang={lang}
                pathname={currentPathname}
            />
        </>
    )
}
