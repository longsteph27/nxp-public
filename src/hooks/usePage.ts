import { useQuery } from '@tanstack/react-query'
import qs from 'qs'
import { Page } from '@/directus/types'

interface UsePageOptions {
    site: string
    lang: string
    permalink: string
    enabled?: boolean
}

export function usePage({ site, lang, permalink, enabled = true }: UsePageOptions) {
    return useQuery({
        queryKey: ['page', site, lang, permalink],
        queryFn: async (): Promise<Page> => {
            const queryString = qs.stringify({
                site,
                lang,
                permalink,
            })

            const response = await fetch(`/api/pages?${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to fetch page')
            }

            return response.json()
        },
        enabled: enabled && !!site && !!lang,
        staleTime: 5 * 60 * 1000, // Cache results for 5 minutes client-side
    })
}
