import { NextRequest, NextResponse } from 'next/server'
import { fetchPage } from '@/directus/queries/pages'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const site = searchParams.get('site')
    const lang = searchParams.get('lang')
    const permalink = searchParams.get('permalink') || '/'

    if (!site || !lang) {
        return NextResponse.json(
            { error: 'Missing required parameters: site, lang' },
            { status: 400 }
        )
    }

    try {
        const page = await fetchPage(site, lang, permalink, { disableCache: true })

        if (!page) {
            return NextResponse.json(
                { error: 'Page not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(page)
    } catch (error) {
        console.error('[API] Error fetching page:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
