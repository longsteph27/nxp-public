# Nexpo Platform - Project Documentation

## 📋 Project Overview

**Nexpo Platform** is a modern, full-stack web application built on the **Nextus** framework - a comprehensive website template based on Next.js and Directus technologies. This is a **multi-tenant, multi-language event platform** designed for creating and managing various types of web projects with a powerful content management system.

## 🎯 Key Features

- ✅ **Multi-tenant Architecture** - Support for multiple sites with isolated content
- ✅ **Multi-language Support** - English and Vietnamese (extensible to more languages)
- ✅ **Dynamic Page Builder** - Block-based content management system
- ✅ **Headless CMS Integration** - Directus for content management
- ✅ **Modern UI/UX** - Built with Tailwind CSS and DaisyUI
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **SEO Optimized** - Server-side rendering and meta tag management
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Real-time Search** - Global search functionality
- ✅ **Form Builder** - Dynamic form generation from CMS schema

## 🏗️ Architecture & Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.3 | React framework with App Router, SSR, and API routes |
| **React** | 18.2.0 | UI library with hooks and modern patterns |
| **TypeScript** | 5.3.3 | Type-safe development |
| **Tailwind CSS** | 3.4.3 | Utility-first CSS framework |
| **DaisyUI** | 4.10.1 | Component library for Tailwind |

### Backend & CMS

| Technology | Version | Purpose |
|------------|---------|---------|
| **Directus** | 14.0.0 | Headless CMS with REST/GraphQL APIs |
| **Directus SDK** | 14.0.0 | Type-safe client for Directus API |
| **SQL Database** | - | Data storage (PostgreSQL/MySQL/SQLite) |

### UI/UX Libraries

| Library | Purpose |
|---------|---------|
| **Framer Motion** | Animation and transitions |
| **React Hook Form** | Form handling and validation |
| **Radix UI** | Accessible component primitives |
| **Headless UI** | Unstyled, accessible components |
| **Iconify** | 150,000+ SVG icons |

### Internationalization

| Library | Purpose |
|---------|---------|
| **i18next** | Internationalization framework |
| **next-i18n-router** | Next.js i18n routing |
| **react-i18next** | React i18n integration |

## 🎨 Content Management System

### Block-Based Architecture

The platform uses a modular block system for content creation:

#### Available Content Blocks

- **HeroBlock** - Landing page hero sections with customizable backgrounds
- **ColumnsBlock** - Multi-column layouts with images and content
- **CtaBlock** - Call-to-action sections with buttons
- **StepsBlock** - Process/procedure displays with step-by-step content
- **TestimonialsBlock** - Customer feedback and reviews
- **LogoCloudBlock** - Client/partner logo displays
- **FormBlock** - Dynamic form generation from CMS schema
- **GalleryBlock** - Image galleries with lightbox functionality
- **VideoBlock** - Video content with responsive embedding
- **RichTextBlock** - WYSIWYG content with markdown support
- **FaqsBlock** - Frequently asked questions with accordion layout
- **FeaturesBlock** - Feature showcase with icons and descriptions
- **PricingBlock** - Pricing tables and plans
- **TeamBlock** - Team member profiles
- **QuoteBlock** - Quote displays with attribution

### Multi-Tenant System

- **Site Isolation**: Each site (`nexpo`, `yba`) has separate content
- **URL Structure**: `/site/language` routing pattern
- **Independent Configuration**: Sites can have different themes, content, and settings
- **Shared Resources**: Common components and utilities across sites

## 🌐 API Integration

### Directus API Endpoints

```typescript
// API Routes
/api/collections    - Get site collections
/api/search        - Global search functionality  
/api/fields        - Form field definitions
/api/relations     - Navigation relationships
/api/feedback      - Contact form submissions
```

### Data Fetching Services

```typescript
// Example from src/services/directus.ts
export async function getCollections() {
  return directus.request(readItems('sites', {
    fields: ['*', 'id', 'name', 'slug']
  }))
}

export async function getFields() {
  return directus.request(readItems('forms', {
    fields: ['*', 'id', 'name', 'type']
  }))
}

export async function getRelations() {
  return directus.request(readItems('navigation', {
    fields: ['*', 'id', 'title', 'type']
  }))
}
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [site]/            # Multi-tenant routing
│   │   ├── [lang]/        # Language routing
│   │   │   └── [...slug]/ # Dynamic page routing
│   │   └── layout.tsx     # Site-specific layout
│   ├── api/               # API routes
│   │   ├── collections/   # Collections API
│   │   ├── search/        # Search API
│   │   ├── fields/        # Fields API
│   │   └── feedback/      # Contact form API
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── blocks/           # Content block components
│   │   ├── HeroBlock.tsx
│   │   ├── ColumnsBlock.tsx
│   │   ├── CtaBlock.tsx
│   │   └── ...
│   ├── base/             # Reusable UI components
│   │   ├── VButton.tsx
│   │   ├── VInput.tsx
│   │   ├── VForm.tsx
│   │   └── ...
│   ├── navigation/       # Navigation components
│   │   ├── TheHeader.tsx
│   │   ├── TheFooter.tsx
│   │   └── Navbar.tsx
│   ├── providers/        # Context providers
│   │   ├── ThemeProvider.tsx
│   │   └── FaviconProvider.tsx
│   ├── PageBuilder.tsx   # Main page builder component
│   └── GlobalSearch.tsx  # Global search component
├── directus/             # Directus integration
│   ├── queries/          # Data fetching functions
│   │   ├── sites.ts      # Site data queries
│   │   ├── pages.ts      # Page data queries
│   │   ├── navigation.ts # Navigation queries
│   │   └── globals.ts    # Global settings queries
│   ├── schema.ts         # TypeScript type definitions
│   ├── client.ts         # Directus client setup
│   ├── types.ts          # Custom types
│   └── utils.ts          # Utility functions
├── lib/                   # Utility functions
│   └── utils/            # Helper utilities
│       ├── directus-helpers.ts
│       ├── routing.ts
│       ├── strings.ts
│       └── theme.ts
├── i18n/                  # Internationalization
│   ├── i18n.ts           # i18n configuration
│   ├── i18nConfig.ts     # i18n config
│   └── messages/         # Translation files
│       ├── en/
│       └── vi/
├── hooks/                 # Custom React hooks
│   ├── useResizeObserver.ts
│   └── useScroll.ts
├── types/                 # TypeScript definitions
│   ├── directus.d.ts
│   └── next.d.ts
└── styles/               # Global styles
    ├── globals.css
    └── logo-marquee.css
```

## 🚀 Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Directus instance (local or cloud)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nxp-public

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Directus configuration

# Start development server
pnpm dev
```

### Environment Variables

```bash
# Frontend URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend URL - Directus instance
NEXT_PUBLIC_DIRECTUS_URL=https://app.nexpo.vn

# WebSocket URL for real-time updates
NEXT_PUBLIC_DIRECTUS_WS_URL=ws://localhost:8055/websocket

# Admin token for server-side operations
DIRECTUS_ADMIN_TOKEN=your-admin-token

# Web API token for client-side operations
NEXT_PUBLIC_DIRECTUS_WEBAPI_TOKEN=your-webapi-token

# Cache control
API_CACHE_DISABLED=true

# Default locale
NEXT_PUBLIC_LOCALE_DEFAULT=en

# Theme configuration
NEXT_PUBLIC_DAISYUI_THEMES=true

# Development mode
NEXT_PUBLIC_ENABLE_FALLBACK_DATA=false
```

### Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm dev:turbo        # Start with Turbo mode

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lintfix          # Fix ESLint errors
pnpm format           # Format code with Prettier
pnpm type-check       # TypeScript type checking

# Utilities
pnpm clean            # Clean build cache
```

## 🌍 Internationalization

### Supported Languages

- **English (en)** - Default language
- **Vietnamese (vi)** - Secondary language

### Adding New Languages

1. Add language to Directus Languages collection
2. Create translation files in `src/i18n/messages/[lang]/`
3. Update `src/i18n/i18nConfig.ts`
4. Add language-specific content in Directus

### Translation Structure

```json
{
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  }
}
```

## 🎨 Theming System

### DaisyUI Themes

The platform supports multiple DaisyUI themes:

- **Light Theme** - Default light theme
- **Dark Theme** - Dark mode support
- **Custom Themes** - Configurable via environment variables

### Theme Configuration

```typescript
// tailwind.config.ts
daisyui: {
  themes: ['light', 'dark', 'cupcake', 'corporate'],
  darkTheme: 'dark',
}
```

### CSS Variables

```css
:root {
  --color-primary: #1E40AF;
  --color-gray: #1E293B;
  --border-radius: 1rem;
  --font-display: "Poppins, sans-serif";
  --font-body: "Inter, sans-serif";
  --font-code: "Fira Code, monospace";
}
```

## 🔍 Search Functionality

### Global Search API

```typescript
// Search across multiple collections
GET /api/search?collections=posts,pages&search=query

// Response format
[
  {
    "type": "post",
    "title": "Post Title",
    "description": "Post description",
    "image": "image-id",
    "url": "/posts/post-slug"
  }
]
```

### Search Collections

- **Posts** - Blog posts and articles
- **Pages** - Static pages
- **Projects** - Project portfolios
- **Categories** - Content categories
- **Help Articles** - Documentation

## 📝 Form System

### Dynamic Form Generation

Forms are generated dynamically from Directus schema:

```typescript
// Form field types
interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
  required: boolean;
  validation?: ValidationRules;
}
```

### Form Components

- **VForm** - Main form wrapper
- **VInput** - Text inputs
- **VLabel** - Form labels
- **VFormSchema** - Schema-based form generation

## 🔐 Authentication & Security

### Directus Authentication

- **Token-based** authentication
- **Role-based** access control
- **API key** management
- **User management** through Directus admin

### Security Features

- **CSRF Protection** - Built-in Next.js protection
- **XSS Prevention** - React's built-in XSS protection
- **Input Validation** - Form validation and sanitization
- **Rate Limiting** - API rate limiting (configurable)

## 📊 Performance Optimization

### Next.js Optimizations

- **Server-Side Rendering** - Fast initial page loads
- **Static Generation** - Pre-built pages where possible
- **Image Optimization** - Automatic image optimization
- **Code Splitting** - Automatic code splitting
- **Bundle Analysis** - Built-in bundle analyzer

### Caching Strategy

- **API Response Caching** - Configurable cache duration
- **Static Asset Caching** - CDN-ready static assets
- **ISR (Incremental Static Regeneration)** - Hybrid rendering

## 🧪 Testing Strategy

### Testing Tools

- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Cypress** - End-to-end testing
- **TypeScript** - Type checking

### Testing Structure

```
__tests__/
├── components/          # Component tests
├── pages/              # Page tests
├── api/                # API route tests
└── utils/              # Utility function tests
```

## 🚀 Deployment

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Deployment Platforms

- **Vercel** - Recommended for Next.js applications
- **Netlify** - Alternative deployment platform
- **Docker** - Containerized deployment
- **Traditional Hosting** - Any Node.js hosting provider

### Environment Setup

1. **Frontend Deployment** - Deploy to Vercel/Netlify
2. **Directus Backend** - Deploy to cloud provider or self-host
3. **Database** - PostgreSQL/MySQL/SQLite
4. **CDN** - Optional for static assets

## 📈 Monitoring & Analytics

### Built-in Analytics

- **Google Analytics** - Page views and user behavior
- **Performance Monitoring** - Core Web Vitals
- **Error Tracking** - Error boundary implementation
- **API Monitoring** - Request/response logging

### Health Checks

- **API Health** - Directus connectivity checks
- **Build Status** - CI/CD pipeline monitoring
- **Uptime Monitoring** - Service availability

## 🔧 **Build API System**

The Nexpo Platform includes a comprehensive **Build API** system that provides programmatic access to Directus CMS data and functionality. This API layer enables dynamic content management, search capabilities, and data manipulation for the multi-tenant platform.

### **API Endpoints Overview**

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|----------------|
| `/api/collections` | GET | Fetch all available collections/sites | Bearer Token |
| `/api/search` | GET | Search across multiple content types | Bearer Token |
| `/api/fields` | GET | Retrieve form fields and metadata | Bearer Token |
| `/api/relations` | GET | Get navigation and relationship data | Bearer Token |
| `/api/feedback` | POST | Submit user feedback and ratings | Public |

### **1. Collections API (`/api/collections`)**

**Purpose**: Retrieves all available sites/collections in the system.

**Implementation**:
```typescript
// src/app/api/collections/route.ts
export async function GET() {
  try {
    const collections = await getCollections();
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}
```

**Response Format**:
```json
[
  {
    "id": "6",
    "name": "YBA Event Site",
    "slug": "yba",
    "status": "published",
    "domain": "yba.test"
  }
]
```

**Usage Examples**:
```bash
# Fetch all collections
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/collections
```

### **2. Search API (`/api/search`)**

**Purpose**: Provides advanced search functionality across multiple content types with intelligent result mapping.

**Features**:
- **Multi-collection Search**: Search across posts, pages, projects, categories, and help articles
- **Result Mapping**: Automatically formats results with proper URLs and metadata
- **Flexible Query Parameters**: Support for search terms, collection filtering, and raw data output

**Implementation**:
```typescript
// src/app/api/search/route.ts
export async function GET(req: NextRequest) {
  const query = getQuery(req.url);
  const { collections, search, raw } = query;
  
  const validCollections = validCollections(collections);
  
  const results = await Promise.all(
    validCollections.map(async (collection) => {
      const res = await directusApi.request(
        readItems(collection, { search: search?.toString() })
      );
      return raw ? res : mapResults(collection, res);
    })
  );
  
  return NextResponse.json(results.flat());
}
```

**Supported Collections**:
- `posts` → `/posts/:slug`
- `projects` → `/projects/:slug`
- `pages` → `/:slug`
- `categories` → `/posts/categories/:slug`
- `help_articles` → `/help/articles/:slug`

**Query Parameters**:
- `collections`: Comma-separated list of collections to search
- `search`: Search term to filter results
- `raw`: Return raw Directus data instead of mapped results

**Usage Examples**:
```bash
# Search across all content types
curl "http://localhost:3000/api/search?collections=posts,pages&search=event"

# Get raw data for specific collection
curl "http://localhost:3000/api/search?collections=posts&raw=true"

# Search help articles
curl "http://localhost:3000/api/search?collections=help_articles&search=setup"
```

**Response Format**:
```json
[
  {
    "type": "post",
    "title": "Event Planning Guide",
    "description": "Complete guide to planning successful events",
    "image": "image-id",
    "url": "/posts/event-planning-guide"
  }
]
```

### **3. Fields API (`/api/fields`)**

**Purpose**: Retrieves form field definitions and metadata for dynamic form generation.

**Implementation**:
```typescript
// src/app/api/fields/route.ts
export async function GET() {
  try {
    const fields = await getFields();
    return NextResponse.json(fields);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch fields' },
      { status: 500 }
    );
  }
}
```

**Response Format**:
```json
[
  {
    "id": "field-id",
    "name": "email",
    "type": "email",
    "required": true,
    "validation": "email"
  }
]
```

### **4. Relations API (`/api/relations`)**

**Purpose**: Fetches navigation structure and relationship data for site organization.

**Implementation**:
```typescript
// src/app/api/relations/route.ts
export async function GET() {
  try {
    const relations = await getRelations();
    return NextResponse.json(relations);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch relations' },
      { status: 500 }
    );
  }
}
```

**Response Format**:
```json
[
  {
    "id": "header",
    "title": "Header Navigation",
    "type": "header",
    "items": [
      {
        "id": "nav-item-id",
        "title": "Speakers",
        "url": "/",
        "type": "url"
      }
    ]
  }
]
```

### **5. Feedback API (`/api/feedback`)**

**Purpose**: Handles user feedback submission with support for both creation and updates.

**Features**:
- **Create New Feedback**: Submit new user feedback and ratings
- **Update Existing**: Modify existing feedback records
- **Visitor Tracking**: Associate feedback with visitor sessions

**Implementation**:
```typescript
// src/app/api/feedback/route.ts
export async function POST(req: NextRequest) {
  try {
    const body: HelpFeedback = await req.json();
    const { id, title, url, rating, visitor_id, comments } = body;
    
    let response;
    
    if (id) {
      // Update existing feedback
      response = await directusApi.request(
        updateItem('help_feedback', id, body)
      );
    } else {
      // Create new feedback
      response = await directusApi.request(
        createItem('help_feedback', body)
      );
    }
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(error);
  }
}
```

**Request Format**:
```json
{
  "id": "optional-feedback-id",
  "title": "Page Title",
  "url": "/current-page",
  "rating": 5,
  "visitor_id": "session-id",
  "comments": "User feedback text"
}
```

### **Directus Service Layer**

The Build API leverages a comprehensive service layer (`src/services/directus.ts`) that provides:

#### **Core Service Functions**:
```typescript
// Collection Management
export async function getCollections()
export async function getCollectionById(id: string)
export async function getCollectionFields(collection: Collection)
export async function getCollectionRelations(collection: Collection)

// Field Management
export async function getFields()

// Relationship Management
export async function getRelations()
export async function getRelationsByCollection(collection: Collection)
```

#### **Authentication & Configuration**:
```typescript
const directus = createDirectus<Schema>(
  process.env.NEXT_PUBLIC_DIRECTUS_URL!
).with(rest());
```

### **Error Handling & Security**

**Error Handling**:
- Comprehensive try-catch blocks for all API endpoints
- Standardized error responses with appropriate HTTP status codes
- Detailed error logging for debugging

**Security Features**:
- Bearer token authentication for protected endpoints
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Rate limiting capabilities (configurable)

### **Performance Optimizations**

**Caching Strategy**:
- Next.js built-in caching for API routes
- Directus SDK connection pooling
- Optimized database queries with field selection

**Response Optimization**:
- Minimal field selection to reduce payload size
- Efficient data mapping and transformation
- Parallel processing for multi-collection searches

### **Integration Examples**

**Frontend Integration**:
```typescript
// Search functionality
const searchResults = await fetch('/api/search?collections=posts,pages&search=event');

// Dynamic form generation
const formFields = await fetch('/api/fields');

// Navigation data
const navigation = await fetch('/api/relations');
```

**External System Integration**:
```bash
# Webhook integration
curl -X POST "https://your-domain.com/api/feedback" \
  -H "Content-Type: application/json" \
  -d '{"title":"Page Title","rating":5,"comments":"Feedback"}'
```

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards

- **TypeScript** - All code must be typed
- **ESLint** - Follow linting rules
- **Prettier** - Consistent code formatting
- **Conventional Commits** - Standardized commit messages

### Documentation

- **README** updates for new features
- **Type definitions** for new APIs
- **Component documentation** with JSDoc
- **API documentation** with examples

## 📚 Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Directus Documentation](https://docs.directus.io)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com)

### Community

- [Directus Discord](https://discord.com/invite/directus)
- [Next.js Discord](https://discord.com/invite/bUG2bvbtHy)
- [GitHub Issues](https://github.com/your-repo/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nextus Framework** - Base template and architecture
- **Directus Community** - CMS platform and support
- **Next.js Team** - React framework
- **Tailwind CSS** - CSS framework
- **DaisyUI** - Component library

---

**Last Updated**: January 2025
**Version**: 0.1.0
**Maintainer**: Development Team
