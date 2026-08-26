import gdmLogo from '../assets/Images/partners/GDM logo white.png'
import lassaLogo from '../assets/Images/partners/LASSA logo white.png'
import lassraLogo from '../assets/Images/partners/LASSRA logo white.png'
import lsetfLogo from '../assets/Images/partners/LSETF logo white.png'
import mistLogo from '../assets/Images/partners/MIST logo white.png'
import a4tLogo from '../assets/Images/exhibitors/A4&T logo white.png'
import daggregateLogo from '../assets/Images/exhibitors/DAGGREGATE logo white.png'
import flexDealsLogo from '../assets/Images/exhibitors/Flex Deals logo white.png'
import flexMobileLogo from '../assets/Images/exhibitors/Flex mobile logo white.png'
import flexMonieLogo from '../assets/Images/exhibitors/Flex Monie logo white.png'
import tingtelLogo from '../assets/Images/exhibitors/Tingtel logo white.png'
import wellnessLogo from '../assets/Images/exhibitors/Wellness logo white.png'
import bellaNaijaLogo from '../assets/Images/Media Partners/Bella Naija Logo white.png'
import brandTimesLogo from '../assets/Images/Media Partners/Brand Times Logo white.png'
import elitesAfricaLogo from '../assets/Images/Media Partners/Elites Africa Logo white.png'
import nairametricsLogo from '../assets/Images/Media Partners/Nairametrics logo white.png'
import raveNewsOnlineLogo from '../assets/Images/Media Partners/Rave news online logo white.png'
import startupLagosLogo from '../assets/Images/Media Partners/Startup Lagos Logo white.png'
import tvcLogo from '../assets/Images/Media Partners/TVC Logo white.png'

function fallbackOrganisation(id, name, logo, category) {
  return {
    id,
    name,
    logo: { src: logo, alt: name },
    category,
    destinationUrl: null,
    isSampleData: true,
  }
}

// Prepared official logo files keep the section complete until its CMS category is populated.
export const sponsors = {
  data: [
    fallbackOrganisation('gdm-group', 'GDM Group', gdmLogo, 'partners'),
    fallbackOrganisation('lassa', 'LASSA', lassaLogo, 'partners'),
    fallbackOrganisation('lassra', 'LASSRA', lassraLogo, 'partners'),
    fallbackOrganisation('lsetf', 'LSETF', lsetfLogo, 'partners'),
    fallbackOrganisation('mist', 'MIST', mistLogo, 'partners'),
    fallbackOrganisation('a4t', 'A4&T', a4tLogo, 'exhibitors'),
    fallbackOrganisation('daggregate', 'Daggregate', daggregateLogo, 'exhibitors'),
    fallbackOrganisation('flex-deals', 'Flex Deals', flexDealsLogo, 'exhibitors'),
    fallbackOrganisation('flex-mobile', 'Flex Mobile', flexMobileLogo, 'exhibitors'),
    fallbackOrganisation('flex-monie', 'Flex Monie', flexMonieLogo, 'exhibitors'),
    fallbackOrganisation('tingtel', 'Tingtel', tingtelLogo, 'exhibitors'),
    fallbackOrganisation('wellness', 'Wellness', wellnessLogo, 'exhibitors'),
    fallbackOrganisation('bella-naija', 'Bella Naija', bellaNaijaLogo, 'media-partners'),
    fallbackOrganisation('brand-times', 'Brand Times', brandTimesLogo, 'media-partners'),
    fallbackOrganisation('elites-africa', 'Elites Africa', elitesAfricaLogo, 'media-partners'),
    fallbackOrganisation('nairametrics', 'Nairametrics', nairametricsLogo, 'media-partners'),
    fallbackOrganisation('rave-news-online', 'Rave News Online', raveNewsOnlineLogo, 'media-partners'),
    fallbackOrganisation('startup-lagos', 'Startup Lagos', startupLagosLogo, 'media-partners'),
    fallbackOrganisation('tvc', 'TVC', tvcLogo, 'media-partners'),
  ],
  meta: {
    source: 'mock',
    total: 19,
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
