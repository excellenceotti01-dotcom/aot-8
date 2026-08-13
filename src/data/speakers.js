import babajideSanwoOlu from '../assets/Images/Babajide-Sanwo-Olu-1.jpeg'
import tubosunAlake from '../assets/Images/Tubosun-Alake-1.jpeg'
import victorGbengaAfolabi from '../assets/Images/Victor-Gbenga-Afolabi-1.jpg'

// Temporary mock response matching GET /wp-json/aot8/v1/speakers.
export const speakers = {
  data: [
    { id: 'tubosun-alake', name: 'Tubosun Alake', image: { src: tubosunAlake, alt: 'Tubosun Alake' }, linkedinUrl: null },
    { id: 'victor-gbenga-afolabi', name: 'Victor-Gbenga Afolabi', image: { src: victorGbengaAfolabi, alt: 'Victor-Gbenga Afolabi' }, linkedinUrl: null },
    { id: 'babajide-sanwo-olu', name: 'Babajide Sanwo-Olu', image: { src: babajideSanwoOlu, alt: 'Babajide Sanwo-Olu' }, linkedinUrl: null },
  ],
  meta: { source: 'mock', total: 3 },
}
