import cadburyLogo from '../assets/Images/cadbury-transaparent.png'
import nestleLogo from '../assets/Images/Nestle transaprent.png'
import shellLogo from '../assets/Images/shell transaparent.png'
import totalEnergiesLogo from '../assets/Images/total-transaparent.png'

const baseOrganisations = [
  { id: 'shell', name: 'Shell', logo: { src: shellLogo, alt: 'Shell' } },
  { id: 'nestle', name: 'Nestlé', logo: { src: nestleLogo, alt: 'Nestlé' } },
  { id: 'cadbury', name: 'Cadbury', logo: { src: cadburyLogo, alt: 'Cadbury' } },
  { id: 'total-energies', name: 'TotalEnergies', logo: { src: totalEnergiesLogo, alt: 'TotalEnergies' } },
]

function sampleCategory(category, total) {
  return Array.from({ length: total }, (_, index) => {
    const organisation = baseOrganisations[index % baseOrganisations.length]
    return { ...organisation, id: `${category}-${organisation.id}-${index + 1}`, category, destinationUrl: null, isSampleData: true }
  })
}

// Temporary mock response matching the planned AOT 8.0 organisation endpoint.
// Reused transparent logo assets populate each category until CMS records arrive.
export const sponsors = {
  data: [
    ...sampleCategory('partners', 4),
    ...sampleCategory('sponsors', 8),
    ...sampleCategory('exhibitors', 7),
    ...sampleCategory('media-partners', 10),
  ],
  meta: {
    source: 'mock',
    total: 29,
    section: {
      heading: ['The organisations', 'Moving AOT 8.0 forward.'],
      logoCollectionLabel: 'AOT 8.0 organisation logos',
    },
    categories: [
      { id: 'partners', label: 'Partners' },
      { id: 'sponsors', label: 'Sponsors' },
      { id: 'exhibitors', label: 'Exhibitors' },
      { id: 'media-partners', label: 'Media partners' },
    ],
  },
}
