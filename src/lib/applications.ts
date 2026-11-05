export type Metric = { label: string; value: string };
export type Review = { stars: string; source: string; quote: string };

export type Application = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  year: string;
  director?: string;
  description: string;
  image: string;
  accentColor?: string;
  metrics: Metric[];
  highlights: string[];
  reviews?: Record<string, Review>;
  badge: string;
};

export const applications: Application[] = [
  {
    id: '01',
    name: 'Nex',
    tagline: 'Manage lighting, climate, and audio from one place.',
    category: 'Environment OS & Facility Intelligence',
    year: '2026',
    director: 'Drava Hardware Lab',
    description: 'Centralized environment and facility intelligence OS. Manage tactile rotary dial audio master volume, adaptive climate regulation (22% Dry), lighting brightness (100%), and unified system security.',
    image: '/assets/app_white_tusker.png',
    accentColor: '#8eff43',
    metrics: [
      { label: 'Master Volume', value: '12 / 100' },
      { label: 'Climate Humidity', value: '22% Dry' },
      { label: 'Lighting', value: '100% Bright' }
    ],
    highlights: [
      'Rotary dial audio telemetry with instant feedback',
      'Zone-based climate and 22% humidity regulation',
      'Real-time facility security and lock management',
      'Adaptive lighting scenes with 100% brightness control'
    ],
    reviews: {
      review1: {
        stars: '★★★★★',
        source: 'WIRED UK',
        quote: '“A MASTERCLASS IN TACTILE ROTARY TELEMETRY AND UNIFIED FACILITY INTELLIGENCE.”'
      },
      review2: {
        stars: '★★★★★',
        source: 'FAST COMPANY',
        quote: '“BRINGS CLIMATE, AUDIO, AND LIGHTING INTO ONE SEAMLESS HARDWARE SPACE.”'
      }
    },
    badge: 'Environment OS'
  },
  {
    id: '02',
    name: 'Grid',
    tagline: 'Spatial screen orchestration & collaborative workspace.',
    category: 'Spatial Multi-Screen Canvas & Media OS',
    year: '2026',
    director: 'Spatial Systems Group',
    description: 'Infinite multi-screen visual workspace allowing teams to assign physical screens, organize media libraries, configure interactive room templates, and stream camera feeds.',
    image: '/assets/app_canvas.jpg',
    accentColor: '#62ffea',
    metrics: [
      { label: 'Sync Latency', value: '< 8ms' },
      { label: 'Active Screens', value: '16+' },
      { label: 'Media Library', value: 'Cloud Sync' }
    ],
    highlights: [
      'Multi-screen spatial canvas with assignable displays',
      'Integrated media drawer with rapid upload pipeline',
      'Pre-configured templates for rooms & presentations',
      'Real-time screen arrangement and camera monitoring'
    ],
    reviews: {
      review1: {
        stars: '★★★★★',
        source: 'THE VERGE',
        quote: '“SPATIAL COLLABORATION REIMAGINED WITH UNMATCHED FLUIDITY.”'
      },
      review2: {
        stars: '★★★★★',
        source: 'TECHCRUNCH',
        quote: '“TURNS ANY PHYSICAL ROOM INTO AN INTERACTIVE MULTI-DISPLAY COMMAND CENTER.”'
      }
    },
    badge: 'Real-Time Engine'
  },
  {
    id: '03',
    name: 'Orca',
    tagline: 'Midnight · Chosen on the kilos · niche 02',
    category: '3D Neural Vision & Footwear Architecture',
    year: '2026',
    director: 'Neural Perception Division',
    description: 'Neural 3D computer vision and volumetric spatial recognition system. Analyzes tonal knit upper textures, aerodynamic responsive foam contours, and physical component geometry in real time.',
    image: '/assets/app_concept_runner.png',
    accentColor: '#ff4d4d',
    metrics: [
      { label: 'Upper Analysis', value: 'Tonal Knit' },
      { label: 'Contour Engine', value: 'Responsive Foam' },
      { label: 'Size Matrix', value: 'UK 6 – 11' }
    ],
    highlights: [
      'Volumetric 3D bounding contour & material analysis',
      'Tonal knit upper & foam geometry recognition',
      'Interactive 3D revolving turntable inspection',
      'Real-time component categorization & telemetry'
    ],
    reviews: {
      review1: {
        stars: '★★★★★',
        source: 'DESIGN MILK',
        quote: '“THE GOLD STANDARD FOR VOLUMETRIC FOOTWEAR AND MATERIAL INTELLIGENCE.”'
      },
      review2: {
        stars: '★★★★★',
        source: 'HYPEBEAST TECH',
        quote: '“BRIDGES PHYSICAL INDUSTRIAL DESIGN WITH REAL-TIME COMPUTER VISION.”'
      }
    },
    badge: 'Neural Vision'
  },
  {
    id: '04',
    name: 'Mosaic',
    tagline: 'Generative data art, dynamic pattern synthesis & mosaic tapestry.',
    category: 'Generative Art & Computational Design',
    year: '2026',
    director: 'Drava Generative Lab',
    description: 'Generative visual computing and dynamic spatial data tapestry. Synthesizes high-density data vectors into fluid digital mosaics, real-time procedural geometry, and responsive architectural ambient art.',
    image: '/assets/app_data_art.png',
    accentColor: '#b6ff66',
    metrics: [
      { label: 'Render FPS', value: '120 FPS' },
      { label: 'Vector Nodes', value: '64,000+' },
      { label: 'Color Gamut', value: 'Wide P3' }
    ],
    highlights: [
      'Real-time generative spatial mosaic and vector weaving',
      'Dynamic telemetry-driven fluid particle fields',
      'High-velocity WebGL GPU shader processing',
      'Adaptive ambient color synthesis for physical spaces'
    ],
    reviews: {
      review1: {
        stars: '★★★★★',
        source: 'CREATIVE APPLICATIONS',
        quote: '“A MESMERIZING INTERSECTION OF RAW ENTERPRISE DATA AND LIVING DIGITAL ART.”'
      },
      review2: {
        stars: '★★★★★',
        source: 'FRAME MAGAZINE',
        quote: '“TRANSFORMS ANY SPATIAL CANVAS INTO AN EVER-EVOLVING GENERATIVE TAPESTRY.”'
      }
    },
    badge: 'Generative Art'
  }
];

export const slugOf = (app: Application) => app.name.toLowerCase();
export const findApp = (slug: string) => applications.findIndex((a) => slugOf(a) === slug);
export const pad = (n: number) => String(n).padStart(2, '0');
