import { useQuery } from '@tanstack/react-query'
import qs from 'qs'

type CollectionType =
    | 'posts'
    | 'pages'
    | 'categories'
    | 'projects'
    | 'help_articles'

interface UseSearchOptions {
    query: string
    collections: CollectionType[]
    enabled?: boolean
}

export function useSearch({ query, collections, enabled = true }: UseSearchOptions) {
    return useQuery({
        queryKey: ['search', query, collections],
        queryFn: async () => {
            const encodedCollections = collections
                .map((collection) => encodeURIComponent(collection))
                .join(',')

            const queryString = qs.stringify(
                {
                    search: query,
                    collections: encodedCollections,
                },
                { encode: false }
            )

            const response = await fetch(`/api/search?${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            return response.json()
        },
        enabled: enabled && query.length > 0,
        staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
    })
}
