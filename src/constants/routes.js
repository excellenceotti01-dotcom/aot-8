export const HOME_PATH = '/aot-8/'
export const REGISTRATION_PATH = '/aot-8/register/'
export const HOME_ANCHOR = `${HOME_PATH}#home`

export function normalisePathname(pathname) {
  const normalised = pathname.replace(/\/+$/, '')
  return normalised || '/'
}

export const HOME_ROUTE = normalisePathname(HOME_PATH)
export const REGISTRATION_ROUTE = normalisePathname(REGISTRATION_PATH)
