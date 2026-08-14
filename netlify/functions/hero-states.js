const WORDPRESS_HERO_STATES_URL = 'https://aotlagos.com/wp-json/aot8/v1/hero-states'

const CACHE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
  'Netlify-CDN-Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
}

const ERROR_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}

export default async (request) => {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...ERROR_HEADERS, Allow: 'GET' },
    })
  }

  try {
    const response = await fetch(WORDPRESS_HERO_STATES_URL, {
      credentials: 'omit',
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Hero States source is unavailable' }), {
        status: 502,
        headers: ERROR_HEADERS,
      })
    }

    return new Response(await response.text(), { status: 200, headers: CACHE_HEADERS })
  } catch {
    return new Response(JSON.stringify({ error: 'Hero States source is unavailable' }), {
      status: 502,
      headers: ERROR_HEADERS,
    })
  }
}
