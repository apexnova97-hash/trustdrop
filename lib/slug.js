export function slugify(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getCollectionSlug(business) {
  const stored = typeof business?.slug === 'string' ? business.slug.trim() : ''
  const usableStored = stored && !['undefined', 'null'].includes(stored.toLowerCase())
  const fromName = slugify(business?.business_name || '')

  if (usableStored && slugify(stored)) return slugify(stored)
  if (fromName) return fromName
  if (business?.id) return String(business.id)

  return ''
}
