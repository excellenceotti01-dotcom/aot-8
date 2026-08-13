import babajideSanwoOlu from '../assets/Images/Babajide-Sanwo-Olu-1.jpeg'
import tubosunAlake from '../assets/Images/Tubosun-Alake-1.jpeg'
import victorGbengaAfolabi from '../assets/Images/Victor-Gbenga-Afolabi-1.jpg'

// Mock collection response matching the planned people-behind-AOT endpoint.
export const peopleBehindAot8 = {
  section: { heading: 'The People Behind AOT 8.0', totalLabel: '03' },
  data: [
    {
      id: 'chief-host',
      role: 'Chief Host',
      name: 'Babajide Sanwo-Olu',
      title: 'Governor, Lagos State',
      biography: 'Babajide Sanwo-Olu is the Governor of Lagos State, leading a city focused on innovation, opportunity and a more connected future.',
      image: babajideSanwoOlu,
      socials: {},
    },
    {
      id: 'host',
      role: 'Host',
      name: 'Tubosun Alake',
      title: 'Special Adviser on Innovation & Technology',
      biography: 'Tubosun Alake works at the intersection of public leadership, technology and innovation—helping connect ideas that move Lagos forward.',
      image: tubosunAlake,
      socials: {},
    },
    {
      id: 'curator',
      role: 'Curator',
      name: 'Victor-Gbenga Afolabi',
      title: 'Founder, AOT Lagos',
      biography: 'Victor-Gbenga Afolabi convenes people, ideas and ecosystems around the technologies shaping Lagos, Africa and the world.',
      image: victorGbengaAfolabi,
      socials: {},
    },
  ],
  meta: {
    source: 'mock',
    total: 3,
  },
}
