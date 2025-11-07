Skip to content
Showcase
Docs
Blog
Templates
Enterprise
Search documentation...
⌘K

Using Pages Router

Features available in /pages

Using Latest Version

15.5.3

Getting Started
Installation
Project Structure
Images
Fonts
CSS
Deploying
Guides
AMP
Analytics
Authentication
Babel
CI Build Caching
Content Security Policy
CSS-in-JS
Custom Server
Debugging
Draft Mode
Environment Variables
Forms
ISR
Instrumentation
Internationalization
Lazy Loading
MDX
Migrating
Multi-Zones
OpenTelemetry
Package Bundling
PostCSS
Preview Mode
Production
Redirecting
Sass
Scripts
Self-Hosting
Static Exports
Tailwind CSS
Testing
Third Party Libraries
Upgrading
Building Your Application
Routing
Rendering
Data Fetching
Configuring
API Reference
Components
File-system conventions
Functions
Configuration
CLI
Edge Runtime
Turbopack
Architecture
Accessibility
Fast Refresh
Next.js Compiler
Supported Browsers
Community
Contribution Guide
Rspack
On this page
Getting started
Locale Strategies
Sub-path Routing
Domain Routing
Automatic Locale Detection
Prefixing the Default Locale
Disabling Automatic Locale Detection
Accessing the locale information
Transition between locales
Leveraging the NEXT_LOCALE cookie
Search Engine Optimization
How does this work with Static Generation?
Dynamic Routes and getStaticProps Pages
Automatically Statically Optimized Pages
Non-dynamic getStaticProps Pages
Limits for the i18n config
Edit this page on GitHub
Scroll to top
Pages Router
Guides
Internationalization
You are currently viewing the documentation for Pages Router.
How to implement internationalization in Next.js
i18n routing
Next.js has built-in support for internationalized (i18n) routing since v10.0.0. You can provide a list of locales, the default locale, and domain-specific locales and Next.js will automatically handle the routing.

The i18n routing support is currently meant to complement existing i18n library solutions like react-intl, react-i18next, lingui, rosetta, next-intl, next-translate, next-multilingual, tolgee, paraglide-next, next-intlayer and others by streamlining the routes and locale parsing.

Getting started
To get started, add the i18n config to your next.config.js file.

Locales are UTS Locale Identifiers, a standardized format for defining locales.

Generally a Locale Identifier is made up of a language, region, and script separated by a dash: language-region-script. The region and script are optional. An example:

en-US - English as spoken in the United States
nl-NL - Dutch as spoken in the Netherlands
nl - Dutch, no specific region
If user locale is nl-BE and it is not listed in your configuration, they will be redirected to nl if available, or to the default locale otherwise. If you don't plan to support all regions of a country, it is therefore a good practice to include country locales that will act as fallbacks.

next.config.js

module.exports = {
i18n: {
// These are all the locales you want to support in
// your application
locales: ['en-US', 'fr', 'nl-NL'],
// This is the default locale you want to be used when visiting
// a non-locale prefixed path e.g. `/hello`
defaultLocale: 'en-US',
// This is a list of locale domains and the default locale they
// should handle (these are only required when setting up domain routing)
// Note: subdomains must be included in the domain value to be matched e.g. "fr.example.com".
domains: [
{
domain: 'example.com',
defaultLocale: 'en-US',
},
{
domain: 'example.nl',
defaultLocale: 'nl-NL',
},
{
domain: 'example.fr',
defaultLocale: 'fr',
// an optional http field can also be used to test
// locale domains locally with http instead of https
http: true,
},
],
},
}
Locale Strategies
There are two locale handling strategies: Sub-path Routing and Domain Routing.

Sub-path Routing
Sub-path Routing puts the locale in the url path.

next.config.js

module.exports = {
i18n: {
locales: ['en-US', 'fr', 'nl-NL'],
defaultLocale: 'en-US',
},
}
With the above configuration en-US, fr, and nl-NL will be available to be routed to, and en-US is the default locale. If you have a pages/blog.js the following urls would be available:

/blog
/fr/blog
/nl-nl/blog
The default locale does not have a prefix.

Domain Routing
By using domain routing you can configure locales to be served from different domains:

next.config.js

module.exports = {
i18n: {
locales: ['en-US', 'fr', 'nl-NL', 'nl-BE'],
defaultLocale: 'en-US',

    domains: [
      {
        // Note: subdomains must be included in the domain value to be matched
        // e.g. www.example.com should be used if that is the expected hostname
        domain: 'example.com',
        defaultLocale: 'en-US',
      },
      {
        domain: 'example.fr',
        defaultLocale: 'fr',
      },
      {
        domain: 'example.nl',
        defaultLocale: 'nl-NL',
        // specify other locales that should be redirected
        // to this domain
        locales: ['nl-BE'],
      },
    ],

},
}
For example if you have pages/blog.js the following urls will be available:

example.com/blog
www.example.com/blog
example.fr/blog
example.nl/blog
example.nl/nl-BE/blog
Automatic Locale Detection
When a user visits the application root (generally /), Next.js will try to automatically detect which locale the user prefers based on the Accept-Language header and the current domain.

If a locale other than the default locale is detected, the user will be redirected to either:

When using Sub-path Routing: The locale prefixed path
When using Domain Routing: The domain with that locale specified as the default
When using Domain Routing, if a user with the Accept-Language header fr;q=0.9 visits example.com, they will be redirected to example.fr since that domain handles the fr locale by default.

When using Sub-path Routing, the user would be redirected to /fr.

Prefixing the Default Locale
With Next.js 12 and Middleware, we can add a prefix to the default locale with a workaround.

For example, here's a next.config.js file with support for a few languages. Note the "default" locale has been added intentionally.

next.config.js

module.exports = {
i18n: {
locales: ['default', 'en', 'de', 'fr'],
defaultLocale: 'default',
localeDetection: false,
},
trailingSlash: true,
}
Next, we can use Middleware to add custom routing rules:

middleware.ts

import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.\*)$/

export async function middleware(req: NextRequest) {
if (
req.nextUrl.pathname.startsWith('/\_next') ||
req.nextUrl.pathname.includes('/api/') ||
PUBLIC_FILE.test(req.nextUrl.pathname)
) {
return
}

if (req.nextUrl.locale === 'default') {
const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en'

    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    )

}
}
This Middleware skips adding the default prefix to API Routes and public files like fonts or images. If a request is made to the default locale, we redirect to our prefix /en.

Disabling Automatic Locale Detection
The automatic locale detection can be disabled with:

next.config.js

module.exports = {
i18n: {
localeDetection: false,
},
}
When localeDetection is set to false Next.js will no longer automatically redirect based on the user's preferred locale and will only provide locale information detected from either the locale based domain or locale path as described above.

Accessing the locale information
You can access the locale information via the Next.js router. For example, using the useRouter() hook the following properties are available:

locale contains the currently active locale.
locales contains all configured locales.
defaultLocale contains the configured default locale.
When pre-rendering pages with getStaticProps or getServerSideProps, the locale information is provided in the context provided to the function.

When leveraging getStaticPaths, the configured locales are provided in the context parameter of the function under locales and the configured defaultLocale under defaultLocale.

Transition between locales
You can use next/link or next/router to transition between locales.

For next/link, a locale prop can be provided to transition to a different locale from the currently active one. If no locale prop is provided, the currently active locale is used during client-transitions. For example:

import Link from 'next/link'

export default function IndexPage(props) {
return (

<Link href="/another" locale="fr">
To /fr/another
</Link>
)
}
When using the next/router methods directly, you can specify the locale that should be used via the transition options. For example:

import { useRouter } from 'next/router'

export default function IndexPage(props) {
const router = useRouter()

return (

<div
onClick={() => {
router.push('/another', '/another', { locale: 'fr' })
}} >
to /fr/another
</div>
)
}
Note that to handle switching only the locale while preserving all routing information such as dynamic route query values or hidden href query values, you can provide the href parameter as an object:

import { useRouter } from 'next/router'
const router = useRouter()
const { pathname, asPath, query } = router
// change just the locale and maintain all other route information including href's query
router.push({ pathname, query }, asPath, { locale: nextLocale })
See here for more information on the object structure for router.push.

If you have a href that already includes the locale you can opt-out of automatically handling the locale prefixing:

import Link from 'next/link'

export default function IndexPage(props) {
return (

<Link href="/fr/another" locale={false}>
To /fr/another
</Link>
)
}
Leveraging the NEXT_LOCALE cookie
Next.js allows setting a NEXT_LOCALE=the-locale cookie, which takes priority over the accept-language header. This cookie can be set using a language switcher and then when a user comes back to the site it will leverage the locale specified in the cookie when redirecting from / to the correct locale location.

For example, if a user prefers the locale fr in their accept-language header but a NEXT_LOCALE=en cookie is set the en locale when visiting / the user will be redirected to the en locale location until the cookie is removed or expired.

Search Engine Optimization
Since Next.js knows what language the user is visiting it will automatically add the lang attribute to the <html> tag.

Next.js doesn't know about variants of a page so it's up to you to add the hreflang meta tags using next/head. You can learn more about hreflang in the Google Webmasters documentation.

How does this work with Static Generation?
Note that Internationalized Routing does not integrate with output: 'export' as it does not leverage the Next.js routing layer. Hybrid Next.js applications that do not use output: 'export' are fully supported.

Dynamic Routes and getStaticProps Pages
For pages using getStaticProps with Dynamic Routes, all locale variants of the page desired to be prerendered need to be returned from getStaticPaths. Along with the params object returned for paths, you can also return a locale field specifying which locale you want to render. For example:

pages/blog/[slug].js

export const getStaticPaths = ({ locales }) => {
return {
paths: [
// if no `locale` is provided only the defaultLocale will be generated
{ params: { slug: 'post-1' }, locale: 'en-US' },
{ params: { slug: 'post-1' }, locale: 'fr' },
],
fallback: true,
}
}
For Automatically Statically Optimized and non-dynamic getStaticProps pages, a version of the page will be generated for each locale. This is important to consider because it can increase build times depending on how many locales are configured inside getStaticProps.

For example, if you have 50 locales configured with 10 non-dynamic pages using getStaticProps, this means getStaticProps will be called 500 times. 50 versions of the 10 pages will be generated during each build.

To decrease the build time of dynamic pages with getStaticProps, use a fallback mode. This allows you to return only the most popular paths and locales from getStaticPaths for prerendering during the build. Then, Next.js will build the remaining pages at runtime as they are requested.

Automatically Statically Optimized Pages
For pages that are automatically statically optimized, a version of the page will be generated for each locale.

Non-dynamic getStaticProps Pages
For non-dynamic getStaticProps pages, a version is generated for each locale like above. getStaticProps is called with each locale that is being rendered. If you would like to opt-out of a certain locale from being pre-rendered, you can return notFound: true from getStaticProps and this variant of the page will not be generated.

export async function getStaticProps({ locale }) {
// Call an external API endpoint to get posts.
// You can use any data fetching library
const res = await fetch(`https://.../posts?locale=${locale}`)
const posts = await res.json()

if (posts.length === 0) {
return {
notFound: true,
}
}

// By returning { props: posts }, the Blog component
// will receive `posts` as a prop at build time
return {
props: {
posts,
},
}
}
Limits for the i18n config
locales: 100 total locales
domains: 100 total locale domain items
Good to know: These limits have been added initially to prevent potential performance issues at build time. You can workaround these limits with custom routing using Middleware in Next.js 12.

Previous
Instrumentation
Next
Lazy Loading
Was this helpful?

Your feedback...
supported.
Resources
Docs
Support Policy
Learn
Showcase
Blog
Team
Analytics
Next.js Conf
Previews
More
Next.js Commerce
Contact Sales
Community
GitHub
Releases
Telemetry
Governance
About Vercel
Next.js + Vercel
Open Source Software
GitHub
Bluesky
X
Legal
Privacy Policy
Cookie Preferences
Subscribe to our newsletter
Stay updated on new releases and features, guides, and case studies.

you@domain.com
Subscribe
© 2025 Vercel, Inc.

Skip to content
Docs
LearnNew!
Examples
Blog
GitHub
Getting started
Usage guide
Routing
Setup
Configuration
Middleware
Navigation
Environments
Workflows & integrations
Design principles
Presented by

System
Edit this page
Docs
Routing
Routing
next-intl integrates with Next.js’ routing system in two places:

Middleware: Negotiates the locale and handles redirects & rewrites (e.g. / → /en)
Navigation APIs: Lightweight wrappers around Next.js’ navigation APIs like <Link />
This enables you to express your app in terms of APIs like <Link href="/about">, while aspects like the locale and user-facing pathnames are automatically handled behind the scenes (e.g. /de/über-uns).

Set up routing
→
Configuration
→
Middleware
→
Navigation APIs
→
Prefer to watch a video?

Locale-based routing
Last updated on August 22, 2025
Request configuration
Setup
Docs · Learn · Examples · Blog ·
v4
Bluesky · X · GitHub ·
Hosted on

Skip to content
Docs
LearnNew!
Examples
Blog
GitHub
Getting started
App Router
Pages Router
Usage guide
Routing
Environments
Workflows & integrations
Design principles
Presented by

System
On This Page

Getting started
messages/en.json
i18n/request.ts
next.config.ts
app/layout.tsx
app/page.tsx
Next steps
Locale-based routing
Provide a locale
Internationalization isn’t just translating words
Edit this page
Docs
Getting started
App Router
Next.js App Router internationalization (i18n)
Prefer to watch a video?

Set up next-intl
Getting started
If you haven’t done so already, create a Next.js app that uses the App Router and run:

npm install next-intl

Now, we’re going to create the following file structure:

├── messages
│ ├── en.json
│ └── ...
├── next.config.ts
└── src
├── i18n
│ └── request.ts
└── app
├── layout.tsx
└── page.tsx

Let’s set up the files:

messages/en.json
Messages represent the translations that are available per language and can be provided either locally or loaded from a remote data source.

The simplest option is to add JSON files in your local project folder:

messages/en.json
{
"HomePage": {
"title": "Hello world!"
}
}

i18n/request.ts
next-intl creates a request-scoped configuration object, which you can use to provide messages and other options based on the user’s locale to Server Components.

src/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
// Static for now, we'll change this later
const locale = 'en';

return {
locale,
messages: (await import(`../../messages/${locale}.json`)).default
};
});

next.config.ts
Now, set up the plugin which links your i18n/request.ts file to next-intl.

next.config.ts
import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

app/layout.tsx
To make your request configuration available to Client Components, you can wrap the children in your root layout with NextIntlClientProvider.

app/layout.tsx
import {NextIntlClientProvider} from 'next-intl';

type Props = {
children: React.ReactNode;
};

export default async function RootLayout({children}: Props) {
return (

<html>
<body>
<NextIntlClientProvider>{children}</NextIntlClientProvider>
</body>
</html>
);
}

app/page.tsx
Use translations in your page components or anywhere else!

app/page.tsx
import {useTranslations} from 'next-intl';

export default function HomePage() {
const t = useTranslations('HomePage');
return <h1>{t('title')}</h1>;
}

In case of async components, you can use the awaitable getTranslations function instead:

app/page.tsx
import {getTranslations} from 'next-intl/server';

export default async function HomePage() {
const t = await getTranslations('HomePage');
return <h1>{t('title')}</h1>;
}

Next steps
Locale-based routing
If you’d like to use unique pathnames for every language that your app supports (e.g. /en/about or example.de/über-uns), you can continue to set up a top-level [locale] segment for your app.

Set up locale-based routing
→
Provide a locale
If your app doesn’t require unique pathnames per locale, you can provide a locale to next-intl based on user preferences or other application logic.

The simplest option is to use a cookie:

src/i18n/request.ts
import {cookies} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
const store = await cookies();
const locale = store.get('locale')?.value || 'en';

return {
locale
// ...
};
});

Internationalization isn’t just translating words
next-intl provides the essential foundation for internationalization in Next.js apps. It handles aspects like translations, date and number formatting, as well as internationalized routing.

However, building for a global audience spans a wider range of topics:

Choosing the right architecture and routing strategy for your app
Integrating with backend services or a CMS
Leveraging generative AI for content localization
Streamlining your development workflow with TypeScript and IDE tooling
Collaborating with your team using a translation management system
Understanding all the pieces that contribute to a truly localized experience
Mastering SEO for multilingual apps to reach global audiences
Video preview
Build international Next.js apps with confidence
Learn how to build delightful, multilingual apps with Next.js—from the basics to advanced patterns, all through a real-world project.

Get started→
Last updated on September 14, 2025
Getting started
Pages Router
Docs · Learn · Examples · Blog ·
v4
Bluesky · X · GitHub ·
Hosted on
Skip to content
Docs
LearnNew!
Examples
Blog
GitHub
Getting started
Usage guide
Routing
Setup
Configuration
Middleware
Navigation
Environments
Workflows & integrations
Design principles
Presented by

System
Edit this page
Docs
Routing
Routing
next-intl integrates with Next.js’ routing system in two places:

Middleware: Negotiates the locale and handles redirects & rewrites (e.g. / → /en)
Navigation APIs: Lightweight wrappers around Next.js’ navigation APIs like <Link />
This enables you to express your app in terms of APIs like <Link href="/about">, while aspects like the locale and user-facing pathnames are automatically handled behind the scenes (e.g. /de/über-uns).

Set up routing
→
Configuration
→
Middleware
→
Navigation APIs
→
Prefer to watch a video?

Locale-based routing
Last updated on August 22, 2025
Request configuration
Setup
Docs · Learn · Examples · Blog ·
v4
Bluesky · X · GitHub ·
Hosted on
Skip to content
Docs
LearnNew!
Examples
Blog
GitHub
Getting started
Usage guide
Routing
Setup
Configuration
Middleware
Navigation
Environments
Workflows & integrations
Design principles
Presented by

System
On This Page

Locale detection
Prefix-based routing (default)
Domain-based routing
Matcher config
Composing other middlewares
Example: Additional rewrites
Example: Integrating with Clerk
Example: Integrating with Supabase Authentication
Example: Integrating with Auth.js (aka NextAuth.js)
Usage without middleware (static export)
Troubleshooting
”The middleware doesn’t run for a particular page.”
”My page content isn’t localized despite the pathname containing a locale prefix.”
”Unable to find next-intl locale because the middleware didn’t run on this request and no locale was returned in getRequestConfig.”
Edit this page
Docs
Routing
Middleware
Middleware
The middleware can be created via createMiddleware.

It receives a routing configuration and takes care of:

Locale negotiation
Applying relevant redirects & rewrites
Providing alternate links for search engines
Example:

middleware.ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
// Match all pathnames except for
// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
// - … the ones containing a dot (e.g. `favicon.ico`)
matcher: '/((?!api|trpc|\_next|\_vercel|._\\.._).\*)'
};

Locale detection
The locale is negotiated based on your routing configuration, taking into account your settings for localePrefix, domains, localeDetection, and localeCookie.

Prefix-based routing (default)
Prefer to watch a video?

Prefix-based routing
By default, prefix-based routing is used to determine the locale of a request.

In this case, the locale is detected based on these priorities:

A locale prefix is present in the pathname (e.g. /en/about)
A cookie is present that contains a previously detected locale
A locale can be matched based on the accept-language header
As a last resort, the defaultLocale is used
To change the locale, users can visit a prefixed route. This will take precedence over a previously matched locale that is saved in a cookie or the accept-language header and will update a previous cookie value.

Example workflow:

A user requests / and based on the accept-language header, the en locale is matched.
The user is redirected to /en.
The app renders <Link locale="de" href="/">Switch to German</Link> to allow the user to change the locale to de.
When the user clicks on the link, a request to /de is initiated.
The middleware will add a cookie to remember the preference for the de locale.
The user later requests / again and the middleware will redirect to /de based on the cookie.
Domain-based routing
Prefer to watch a video?

Domain-based routing
If you’re using the domains setting, the middleware will match the request against the available domains to determine the best-matching locale. To retrieve the domain, the host is read from the x-forwarded-host header, with a fallback to host (hosting platforms typically provide these headers out of the box).

The locale is detected based on these priorities:

A locale prefix is present in the pathname (e.g. ca.example.com/fr)
A locale is stored in a cookie and is supported on the domain
A locale that the domain supports is matched based on the accept-language header
As a fallback, the defaultLocale of the domain is used
Since the middleware is aware of all your domains, if a domain receives a request for a locale that is not supported (e.g. en.example.com/fr), it will redirect to an alternative domain that does support the locale.

Example workflow:

The user requests us.example.com and based on the defaultLocale of this domain, the en locale is matched.
The app renders <Link locale="fr" href="/">Switch to French</Link> to allow the user to change the locale to fr.
When the link is clicked, a request to us.example.com/fr is initiated.
The middleware recognizes that the user wants to switch to another domain and responds with a redirect to ca.example.com/fr.
Matcher config
The middleware is intended to only run on pages, not on arbitrary files that you serve independently of the user locale (e.g. /favicon.ico).

A popular strategy is to match all routes that don’t start with certain segments (e.g. /\_next) and also none that include a dot (.) since these typically indicate static files. However, if you have some routes where a dot is expected (e.g. /users/jane.doe), you should explicitly provide a matcher for these.

middleware.ts
export const config = {
// Matcher entries are linked with a logical "or", therefore
// if one of them matches, the middleware will be invoked.
matcher: [
// Match all pathnames except for
// - … if they start with `/api`, `/_next` or `/_vercel`
// - … the ones containing a dot (e.g. `favicon.ico`)
'/((?!api|\_next|\_vercel|._\\.._).\*)',

    // However, match all pathnames within `/users`, optionally with a locale prefix
    '/([\\w-]+)?/users/(.+)'

]
};

Note that some third-party providers like Vercel Analytics typically use internal endpoints that are then rewritten to an external URL (e.g. /\_vercel/insights/view). Make sure to exclude such requests from your middleware matcher so they aren’t rewritten by accident.

Composing other middlewares
By calling createMiddleware, you’ll receive a function of the following type:

function middleware(request: NextRequest): NextResponse;

If you need to incorporate additional behavior, you can either modify the request before the next-intl middleware receives it, modify the response or even create the middleware based on dynamic configuration.

middleware.ts
import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';

export default async function middleware(request: NextRequest) {
// Step 1: Use the incoming request (example)
const defaultLocale = request.headers.get('x-your-custom-locale') || 'en';

// Step 2: Create and call the next-intl middleware (example)
const handleI18nRouting = createMiddleware({
locales: ['en', 'de'],
defaultLocale
});
const response = handleI18nRouting(request);

// Step 3: Alter the response (example)
response.headers.set('x-your-custom-locale', defaultLocale);

return response;
}

export const config = {
// Match only internationalized pathnames
matcher: ['/', '/(de|en)/:path*']
};

Example: Additional rewrites
If you need to handle rewrites apart from the ones provided by next-intl, you can adjust the pathname of the request before invoking the next-intl middleware (based on “A/B Testing with Cookies” by Vercel).

This example rewrites requests for /[locale]/profile to /[locale]/profile/new if a special cookie is set.

middleware.ts
import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';

export default async function middleware(request: NextRequest) {
const [, locale, ...segments] = request.nextUrl.pathname.split('/');

if (locale != null && segments.join('/') === 'profile') {
const usesNewProfile =
(request.cookies.get('NEW_PROFILE')?.value || 'false') === 'true';

    if (usesNewProfile) {
      request.nextUrl.pathname = `/${locale}/profile/new`;
    }

}

const handleI18nRouting = createMiddleware({
locales: ['en', 'de'],
defaultLocale: 'en'
});
const response = handleI18nRouting(request);
return response;
}

export const config = {
matcher: ['/', '/(de|en)/:path*']
};

Note that if you use a localePrefix other than always, you need to adapt the handling appropriately to handle unprefixed pathnames too. Also, make sure to only rewrite pathnames that will not lead to a redirect, as otherwise rewritten pathnames will be redirected to.

Example: Integrating with Clerk
@clerk/nextjs provides a middleware that can be combined with other middlewares like the one provided by next-intl. By combining them, the middleware from @clerk/next will first ensure protected routes are handled appropriately. Subsequently, the middleware from next-intl will run, potentially redirecting or rewriting incoming requests.

middleware.ts
import {clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher(['/:locale/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
if (isProtectedRoute(req)) await auth.protect();

return handleI18nRouting(req);
});

export const config = {
// Match only internationalized pathnames
matcher: ['/', '/(de|en)/:path*']
};

(based on @clerk/nextjs@^6.0.0)

Example: Integrating with Supabase Authentication
In order to use Supabase Authentication with next-intl, you need to combine the Supabase middleware with the one from next-intl.

You can do so by following the setup guide from Supabase and adapting the middleware utils to accept a response object that’s been created by the next-intl middleware instead of creating a new one:

utils/supabase/middleware.ts
import {createServerClient} from '@supabase/ssr';
import {NextResponse, type NextRequest} from 'next/server';

export async function updateSession(
request: NextRequest,
response: NextResponse
) {
const supabase = createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies: {
getAll() {
return request.cookies.getAll();
},
setAll(cookiesToSet) {
cookiesToSet.forEach(({name, value}) =>
request.cookies.set(name, value)
);
cookiesToSet.forEach(({name, value, options}) =>
response.cookies.set(name, value, options)
);
}
}
}
);

const {
data: {user}
} = await supabase.auth.getUser();

return response;
}

Now, we can integrate the Supabase middleware with the one from next-intl:

middleware.ts
import createMiddleware from 'next-intl/middleware';
import {type NextRequest} from 'next/server';
import {routing} from './i18n/routing';
import {updateSession} from './utils/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
const response = handleI18nRouting(request);

// A `response` can now be passed here
return await updateSession(request, response);
}

export const config = {
matcher: ['/', '/(de|en)/:path*']
};

(based on @supabase/ssr@^0.5.0)

Example: Integrating with Auth.js (aka NextAuth.js)
The Next.js middleware of Auth.js requires an integration with their control flow to be compatible with other middlewares. The success callback can be used to run the next-intl middleware on authorized pages. However, public pages need to be treated separately.

For pathnames specified in the pages object (e.g. signIn), Auth.js will skip the entire middleware and not run the success callback. Therefore, we have to detect these pages before running the Auth.js middleware and only run the next-intl middleware in this case.

middleware.ts
import {withAuth} from 'next-auth/middleware';
import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';
import {routing} from './i18n/routing';

const publicPages = ['/', '/login'];

const handleI18nRouting = createMiddleware(routing);

const authMiddleware = withAuth(
// Note that this callback is only invoked if
// the `authorized` callback has returned `true`
// and not for pages listed in `pages`.
function onSuccess(req) {
return handleI18nRouting(req);
},
{
callbacks: {
authorized: ({token}) => token != null
},
pages: {
signIn: '/login'
}
}
);

export default function middleware(req: NextRequest) {
const publicPathnameRegex = RegExp(
`^(/(${locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
'i'
);
const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

if (isPublicPage) {
return handleI18nRouting(req);
} else {
return (authMiddleware as any)(req);
}
}

export const config = {
matcher: ['/((?!api|_next|.*\\..*).*)']
};

(based on next-auth@^4.0.0)

Have a look at the next-intl with NextAuth.js example to explore a working setup.

Usage without middleware (static export)
If you’re using the static export feature from Next.js (output: 'export'), the middleware will not run. You can use prefix-based routing nontheless to internationalize your app, but a few tradeoffs apply.

Static export limitations:

Using a locale prefix is required (same as localePrefix: 'always')
The locale can’t be negotiated on the server (same as localeDetection: false)
You can’t use pathnames, as these require server-side rewrites
Static rendering is required
Additionally, other limitations as documented by Next.js will apply too.

If you choose this approach, you might want to enable a redirect at the root of your app:

app/page.tsx
import {redirect} from 'next/navigation';

// Redirect the user to the default locale when `/` is requested
export default function RootPage() {
redirect('/en');
}

Additionally, Next.js will ask for a root layout for app/page.tsx, even if it’s just passing children through:

app/layout.tsx
export default function RootLayout({children}) {
return children;
}

Troubleshooting
”The middleware doesn’t run for a particular page.”
To resolve this, make sure that:

The middleware is set up in the correct file (e.g. src/middleware.ts).
Your middleware matcher correctly matches all routes of your application, including dynamic segments with potentially unexpected characters like dots (e.g. /users/jane.doe).
In case you’re composing other middlewares, ensure that the middleware is called correctly.
In case you require static rendering, make sure to follow the static rendering guide instead of relying on hacks like force-static.
”My page content isn’t localized despite the pathname containing a locale prefix.”
This is very likely the result of your middleware not running on the request. As a result, a potential fallback from i18n/request.ts might be applied.

”Unable to find next-intl locale because the middleware didn’t run on this request and no locale was returned in getRequestConfig.”
If the middleware is not expected to run on this request (e.g. because you’re using a setup without locale-based routing, you should explicitly return a locale from getRequestConfig to recover from this error.

If the middleware is expected to run, verify that your middleware is set up correctly.

Note that next-intl will invoke the notFound() function to abort the render if no locale is available after getRequestConfig has run. You should consider adding a not-found page due to this.

Last updated on September 15, 2025
Configuration
Navigation
Docs · Learn · Examples · Blog ·
v4
Bluesky · X · GitHub ·
Hosted on
Skip to content
Docs
LearnNew!
Examples
Blog
GitHub
Getting started
Usage guide
Routing
Setup
Configuration
Middleware
Navigation
Environments
Workflows & integrations
Design principles
Presented by

System
On This Page

APIs
Link
useRouter
usePathname
redirect
getPathname
Edit this page
Docs
Routing
Navigation
Navigation APIs
Prefer to watch a video?

Navigation APIs
next-intl provides lightweight wrappers around Next.js’ navigation APIs like <Link /> and useRouter that automatically handle the user locale and pathnames behind the scenes.

To create these APIs, you can call the createNavigation function with your routing configuration:

navigation.ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {Link, redirect, usePathname, useRouter, getPathname} =
createNavigation(routing);

This function is typically called in a central module like src/i18n/navigation.ts in order to provide easy access to navigation APIs in your components.

APIs
The created navigation APIs are thin wrappers around the equivalents from Next.js and mostly adhere to the same function signatures. Your routing configuration and the user’s locale are automatically incorporated.

If you’re using the pathnames setting in your routing configuration, the internal pathnames that are accepted for href arguments will be strictly typed and localized to the given locale.

Link
This component wraps next/link and localizes the pathname as necessary.

import {Link} from '@/i18n/navigation';

// When the user is on `/en`, the link will point to `/en/about`

<Link href="/about">About</Link>
 
// Search params can be added via `query`
<Link href={{pathname: "/users", query: {sortBy: 'name'}}}>Users</Link>
 
// You can override the `locale` to switch to another language
// (this will set the `hreflang` attribute on the anchor tag)
<Link href="/" locale="de">Switch to German</Link>

Depending on if you’re using the pathnames setting, dynamic params can either be passed as:

// 1. A final string (when not using `pathnames`)

<Link href="/users/12">Susan</Link>
 
// 2. An object (when using `pathnames`)
<Link href={{
  pathname: '/users/[userId]',
  params: {userId: '5'}
}}>
  Susan
</Link>

useRouter
If you need to navigate programmatically, e.g. in an event handler, next-intl provides a convience API that wraps useRouter from Next.js and localizes the pathname accordingly.

'use client';

import {useRouter} from '@/i18n/navigation';

const router = useRouter();

// When the user is on `/en`, the router will navigate to `/en/about`
router.push('/about');

// Search params can be added via `query`
router.push({
pathname: '/users',
query: {sortBy: 'name'}
});

// You can override the `locale` to switch to another language
router.replace('/about', {locale: 'de'});

Depending on if you’re using the pathnames setting, dynamic params can either be passed as:

// 1. A final string (when not using `pathnames`)
router.push('/users/12');

// 2. An object (when using `pathnames`)
router.push({
pathname: '/users/[userId]',
params: {userId: '5'}
});

usePathname
To retrieve the current pathname without a potential locale prefix, you can call usePathname.

'use client';

import {usePathname} from '@/i18n/navigation';

// When the user is on `/en`, this will be `/`
const pathname = usePathname();

Note that if you’re using the pathnames setting, the returned pathname will correspond to an internal pathname template (dynamic params will not be replaced by their values).

// When the user is on `/de/über-uns`, this will be `/about`
const pathname = usePathname();

// When the user is on `/de/neuigkeiten/produktneuheit`,
// this will be `/news/[articleSlug]`
const pathname = usePathname();

redirect
If you want to interrupt the render and redirect to another page, you can invoke the redirect function. This wraps redirect from Next.js and localizes the pathname as necessary.

Note that a locale prop is always required, even if you’re just passing the current locale.

import {redirect} from '@/i18n/navigation';

// Redirects to `/en/login`
redirect({href: '/login', locale: 'en'});

// Search params can be added via `query`
redirect({href: '/users', query: {sortBy: 'name'}, locale: 'en'});

Depending on if you’re using the pathnames setting, dynamic params can either be passed as:

// 1. A final string (when not using `pathnames`)
redirect({href: '/users/12', locale: 'en'});

// 2. An object (when using `pathnames`)
redirect({
href: {
pathname: '/users/[userId]',
params: {userId: '5'}
},
locale: 'en'
});

When using a localePrefix setting other than always, you can enforce a locale prefix by setting the forcePrefix option to true. This is useful when changing the user’s locale and you need to update the locale cookie first:

// Will initially redirect to `/en/about` to update the locale
// cookie, regardless of your `localePrefix` setting
redirect({href: '/about', locale: 'en', forcePrefix: true});

permanentRedirect is supported too.

getPathname
If you need to construct a particular pathname based on a locale, you can call the getPathname function.

import {getPathname} from '@/i18n/navigation';

// Will return `/en/about`
const pathname = getPathname({
locale: 'en',
href: '/about'
});

// Search params can be added via `query`
const pathname = getPathname({
locale: 'en',
href: {
pathname: '/users',
query: {sortBy: 'name'}
}
});

Depending on if you’re using the pathnames setting, dynamic params can either be passed as:

// 1. A final string (when not using `pathnames`)
const pathname = getPathname({
locale: 'en',
href: '/users/12'
});

// 2. An object (when using `pathnames`)
const pathname = getPathname({
locale: 'en',
href: {
pathname: '/users/[userId]',
params: {userId: '5'}
}
});

Use cases:

Sitemaps
hreflang & canonicals
Last updated on August 22, 2025
Middleware
Environments
Docs · Learn · Examples · Blog ·
v4
Bluesky · X · GitHub ·
Hosted on
Skip to content
Docs
LearnNew!
Examples
Blog
GitHub
Getting started
Usage guide
Routing
Setup
Configuration
Middleware
Navigation
Environments
Workflows & integrations
Design principles
Presented by

System
Edit this page
Docs
Routing
Routing
next-intl integrates with Next.js’ routing system in two places:

Middleware: Negotiates the locale and handles redirects & rewrites (e.g. / → /en)
Navigation APIs: Lightweight wrappers around Next.js’ navigation APIs like <Link />
This enables you to express your app in terms of APIs like <Link href="/about">, while aspects like the locale and user-facing pathnames are automatically handled behind the scenes (e.g. /de/über-uns).

Set up routing
→
Configuration
→
Middleware
→
Navigation APIs
→
Prefer to watch a video?

Locale-based routing
Last updated on August 22, 2025
Request configuration
Setup
Docs · Learn · Examples · Blog ·
v4
Bluesky · X · GitHub ·
Hosted on
Skip to content
Docs
LearnNew!
Examples
Blog
GitHub
Getting started
Usage guide
Routing
Setup
Configuration
Middleware
Navigation
Environments
Workflows & integrations
Design principles
Presented by

System
On This Page

Initial setup
src/i18n/routing.ts
src/middleware.ts
src/i18n/navigation.ts
src/i18n/request.ts
src/app/[locale]/layout.tsx
Static rendering
Add generateStaticParams
Add setRequestLocale to all relevant layouts and pages
Use the locale param in metadata
Edit this page
Docs
Routing
Setup
Setup locale-based routing
Prefer to watch a video?

Routing setup
In order to use unique pathnames for every language that your app supports, next-intl can be used to handle the following routing setups:

Prefix-based routing (e.g. /en/about)
Domain-based routing (e.g. en.example.com/about)
In either case, next-intl integrates with the App Router by using a top-level [locale] dynamic segment that can be used to provide content in different languages.

Initial setup
To get started with locale-based routing, we’ll set up the following files:

src/i18n/routing.ts
We’ll use routing.ts as a central place to define our routing configuration:

src/i18n/routing.ts
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
// A list of all locales that are supported
locales: ['en', 'de'],

// Used when no locale matches
defaultLocale: 'en'
});

Depending on your requirements, you may wish to customize your routing configuration later—but let’s finish with the setup first.

src/middleware.ts
Once we have our routing configuration in place, we can use it to set up the middleware:

src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
// Match all pathnames except for
// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
// - … the ones containing a dot (e.g. `favicon.ico`)
matcher: '/((?!api|trpc|\_next|\_vercel|._\\.._).\*)'
};

src/i18n/navigation.ts
Additionally, we can use our routing configuration to set up the navigation APIs:

src/i18n/navigation.ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
createNavigation(routing);

src/i18n/request.ts
Now, we can read the matched locale in our request configuration:

src/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
// Typically corresponds to the `[locale]` segment
const requested = await requestLocale;
const locale = hasLocale(routing.locales, requested)
? requested
: routing.defaultLocale;

return {
locale
// ...
};
});

src/app/[locale]/layout.tsx
To complete our setup, we’ll move all of our existing layouts and pages into the [locale] segment:

src
└── app
└── [locale]
├── layout.tsx
├── page.tsx
└── ...

The locale that was matched is now available via the [locale] param:

app/[locale]/layout.tsx
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

type Props = {
children: React.ReactNode;
params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
// Ensure that the incoming `locale` is valid
const {locale} = await params;
if (!hasLocale(routing.locales, locale)) {
notFound();
}

// ...
}

That’s all it takes! From here, you can configure your routing to cater to your specific needs.

In case you ran into an issue, have a look at the App Router example to explore a working app.

Static rendering
When using locale-based routing, next-intl will currently opt into dynamic rendering when APIs like useTranslations are used in Server Components. This is a limitation that we aim to remove in the future, but as a stopgap solution, next-intl provides a temporary API that can be used to enable static rendering.

Add generateStaticParams
Since we are using a dynamic route segment for the [locale] param, we need to use generateStaticParams so that the routes can be rendered at build time.

Depending on your needs, you can add generateStaticParams either to a layout or pages:

Layout: Enables static rendering for all pages within this layout (e.g. app/[locale]/layout.tsx)
Individual pages: Enables static rendering for a specific page (e.g. app/[locale]/page.tsx)
Example:

import {routing} from '@/i18n/routing';

export function generateStaticParams() {
return routing.locales.map((locale) => ({locale}));
}

Add setRequestLocale to all relevant layouts and pages
next-intl provides an API that can be used to distribute the locale that is received via params in layouts and pages for usage in all Server Components that are rendered as part of the request.

app/[locale]/layout.tsx
import {setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

type Props = {
children: React.ReactNode;
params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
const {locale} = await params;
if (!hasLocale(routing.locales, locale)) {
notFound();
}

// Enable static rendering
setRequestLocale(locale);

return (
// ...
);
}

app/[locale]/page.tsx
import {use} from 'react';
import {setRequestLocale} from 'next-intl/server';
import {useTranslations} from 'next-intl';

export default function IndexPage({params}) {
const {locale} = use(params);

// Enable static rendering
setRequestLocale(locale);

// Once the request locale is set, you
// can call hooks from `next-intl`
const t = useTranslations('IndexPage');

return (
// ...
);
}

Keep in mind that:

The locale that you pass to setRequestLocale should be validated (e.g. in your root layout).
You need to call this function in every page and every layout that you intend to enable static rendering for since Next.js can render layouts and pages independently.
setRequestLocale needs to be called before you invoke any functions from next-intl like useTranslations or getMessages.
Use the locale param in metadata
In addition to the rendering of your pages, also page metadata needs to qualify for static rendering.

To achieve this, you can forward the locale that you receive from Next.js via params to the awaitable functions from next-intl.

page.tsx
import {getTranslations} from 'next-intl/server';

export async function generateMetadata({params}) {
const {locale} = await params;
const t = await getTranslations({locale, namespace: 'Metadata'});

return {
title: t('title')
};
}

Last updated on September 20, 2025
Routing
Configuration
Docs · Learn · Examples · Blog ·
v4
Bluesky · X · GitHub ·
Hosted on

Trouble with Locale Switching in Next.js 14 using next-int
Need help
Hey everyone,

I'm currently working on a project where I'm using next-intl for localization with Next.js 14 and the app router. This is my first time implementing it, and I've hit a snag.

My default language is set to English ('en'). However, when I'm on the Swedish version of the site (www.localhost/sv) and try to navigate to the English version by removing 'sv' from the URL, it automatically redirects me back to '/sv'. The only way I can switch to the English version is by explicitly typing '/en' in the URL. I just keep bouncing back to the Swedish version otherwise.

I've followed the instructions on the official repository and the next-intl website, but I'm still struggling to make it work as expected.

Has anyone faced a similar issue or have any tips on what I might be doing wrong?

Upvote
7

Downvote

21
Go to comments

Share
u/viktvaktarna avatar
viktvaktarna
•
Promoted

Vill du se skillnad både på vågen och i hur du mår? Börja idag och nå alla dina hälsomål med ViktVäktarna.
Sign Up
viktvaktarna.se
Thumbnail image: Vill du se skillnad både på vågen och i hur du mår? Börja idag och nå alla dina hälsomål med ViktVäktarna.
Join the conversation
Sort by:

Best

Search Comments
Expand comment search
Comments Section
ixartz
•
2y ago
I just recently add next-into into my Next.js Boilerplate, including the Locale Switching. You can find the repository here: https://github.com/ixartz/Next-js-Boilerplate

You can use it for inspiration or directly use the boilerplate.

track me

Upvote
2

Downvote

Reply
reply

Award

Share

Pretty-Technologies
OP
•
2y ago
I just recently add next-into into my Next.js Boilerplate, including the Locale Switching. You can find the repository here: https://github.com/ixartz/Next-js-Boilerplate

You can use it for inspiration or directly use the boilerplate.

Thanks for pointing me to your Next.js Boilerplate. I'll take a look at it, always useful to have a practical reference, especially from a recent implementation.

Upvote
2

Downvote

Reply
reply

Award

Share

ixartz
•
2y ago
Yes, it just added it last week/this week.

Upvote
1

Downvote

Reply
reply

Award

Share

Effective_Turnip7646
•
1y ago
Thanks this is saving my life! I had a similar problem and I all I need is a `router.refresh()` in the locale switch : )

Upvote
3

Downvote

Reply
reply

Award

Share

ixartz
•
1y ago
Haha, it's always helpful to have a working example you can rely, much more easier to debug and find the root cause of the problem 😉

Thank you so much for taking the time to share your experience, it's always rewarding to see your project being useful to other developers.

Upvote
1

Downvote

Reply
reply

Award

Share

Zephury
•
2y ago
This is the expected behavior. If you want to switch by url to your default locale, which has localePrefix: “as-needed”, you still must input the default locale in the url. When using ‘as-needed’, it is a rewrite. Requests that contain the defaultLocale are simply visually hidden from the url. As far as Next is concerned, you are still at /en/any-page, for example, even though it may show only /any-page in the url bar, if en were your defaultLocale. To switch languages on site, you simply pass the locale prop to Link. For example, you would use <Link to=“/any-page” locale=“en”>English</Link> and never use to=“/en/any-page”

Upvote
2

Downvote

Reply
reply

Award

Share

dummyjunk
•
1y ago
•
Edited 1y ago
Hi, I've been having this issue for a couple of days, and I finally found that the problem is with my site configuration of nginx server.

By commenting out every line containing "add_header Cache-Control "public, max-age=3600";" or "proxy_cache_bypass $http_upgrade;", it finally started working successfully.

I believe the issue was related to caching, as every time I manually deleted "/sv" for example, (note that I also cleared the "NEXT_LOCALE" cookie), it refuses to go back to "/" or "/en".

Anyway, I hope this solution can assist anyone facing the same issue.

Upvote
1

Downvote

Reply
reply

Award

Share

u/tonkotsu-ai avatar
tonkotsu-ai
•
Promoted

Tonkotsu makes you the tech lead of a team of coding agents. Try it FREE.
Download
tonkotsu.ai
Thumbnail image: Tonkotsu makes you the tech lead of a team of coding agents. Try it FREE.
nikola1970
•
2y ago
There is an option in the middleware localePrefix which you should set as a string 'as-needed'. That should fix it for you. Also try to test it in incognito browser mode.

Upvote
1

Downvote

Reply
reply

Award

Share

Pretty-Technologies
OP
•
2y ago
Thanks for your suggestion about setting localePrefix to 'as-needed'.

I've already configured it that way in my middleware. Despite this, the issue still occurs: whenever I try to navigate from '/sv' to the default English version by deleting '/sv' from the URL (thus landing on '/'), the site redirects me back to '/sv' instead of staying on the English version at '/'. I have to explicitly type '/en'

Upvote
1

Downvote

Reply
reply

Award

Share

nikola1970
•
2y ago
I suppose defaultLang is also set. Can you test it in the incognito browser? I had a lot of trouble with caching and testing with different options.

Upvote
1

Downvote

Reply
reply

Award

Share

Pretty-Technologies
OP
•
2y ago
Yes, defaultLocale is set. I've tried testing it in different browsers and in incognito mode, but I'm still experiencing the same behavior.

Upvote
1

Downvote

Reply
reply

Award

Share

nikola1970
•
2y ago
Try localeDetection: false

Upvote
1

Downvote

Reply
reply

Award

Share

Pretty-Technologies
OP
•
2y ago
Setting localeDetection: false does resolve the issue, but I'm concerned it might be a compromise on user experience. My goal is for the site to automatically detect and adapt to the user's language preferences. I noticed that the official demo doesn't use this setting in the middleware. Could I be misunderstanding the purpose or implementation of the localeDetection setting? Any insights on this would be really helpful.

Upvote
1

Downvote

Reply
reply

Award

Share

nikola1970
•
2y ago
I guess setting it to false will give you predictable behaviour related to the URL prefix, like what you want to achieve. If you have it as true that might be the clue why you are always redirected to /sv if you are Sweden based?

Upvote
1

Downvote

Reply
reply

Award

Share

Pretty-Technologies
OP
•
2y ago
I understand the point about predictable behavior with localeDetection set to false.

However, the issue persists even when I experiment with languages other than Swedish, and still encounter the same redirection behavior upon removing the 'sv' prefix. This seems off, especially when considering how the official example on GitHub is structured. And the demo has the desired behaviour.

Upvote
1

Downvote

Reply
reply

Award

Share

nikola1970
•
2y ago
Strange indeed. Maybe you can ask in their GitHub discussions. :)

Upvote
1

Downvote

Reply
reply

Award

Share

u/wilson2603 avatar
wilson2603
•
2y ago
By default it’ll look at the NEXT_LOCALE cookie. This is set when you visit /sv and so subsequent visits to / will be redirected.

Upvote
1

Downvote

Reply
reply

Award

Share

Pretty-Technologies
OP
•
2y ago
Thanks for the insight, that makes sense. The NEXT_LOCALE cookie setting seems to be influencing the redirection. Since I'm relatively new to this, I'm unsure how best to approach the issue. In your opinion, is this a significant enough problem that I should opt for setting localeDetection: false, or is there a better way to handle it?

Upvote
1

Downvote

Reply
reply

Award

Share
