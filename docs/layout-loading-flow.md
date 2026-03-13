## Logic: read data and render site layout

Only the essential flow for fetching data and showing the layout.

### Steps

1) Input params
   - `site` from route `/[site]/...`
   - `lang` from route `/[site]/[lang]/...`

2) Root layout (`src/app/layout.tsx`)
   - Import global CSS and load Google fonts.
   - Apply font variables on `<body>`.

3) Site layout (`src/app/[site]/layout.tsx`)
   - Resolve `params.site`.
   - `siteData = getSite(siteSlug)`.
   - `globals = fetchGlobals(siteData?.id)`.
   - `theme = globals.theme || globals.translations[0]?.theme || {}`.
   - Compute `styleVars` from `theme` (colors, radius, font families).
   - Generate metadata (title/description/favicon) using `siteData`, `globals`, and `NEXT_PUBLIC_DIRECTUS_URL`.
   - Render providers and apply variables:
     - `<ThemeProvider theme={theme} globals={globals}>`
     - `<FaviconProvider siteData={siteData} />`
     - `<FontVariablesSetter fontVars={fontVars} />`
     - `<div style={styleVars}>`
       - `<ClientThemeWrapper theme globals styleVars>` wraps `{children}`

4) Language layout (`src/app/[site]/[lang]/layout.tsx`)
   - Resolve `params.lang`.
   - Initialize i18n: `await getTranslations({ locale: lang })`.
   - Return `{children}`.

5) Page render
   - Components read `theme`/`globals` via `useTheme()` and use CSS variables from the wrapper.

### Code paths

- Layouts: `src/app/layout.tsx` → `src/app/[site]/layout.tsx` → `src/app/[site]/[lang]/layout.tsx`
- Data: `src/directus/queries/sites.ts#getSite`, `src/directus/queries/globals.ts#fetchGlobals`
- Providers: `src/components/providers/ThemeProvider.tsx`, `src/components/providers/ClientThemeWrapper.tsx`

