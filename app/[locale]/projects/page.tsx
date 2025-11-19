'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

interface AdminProject {
  id: string;
  slug: string;
  title: string;
  titleKey: string;
  description: string;
  descriptionKey: string;
  category: string;
  year: string;
  location: string;
  client: string;
  heroImage: string;
  galleryImages: string[];
  locale: string;
}

// Static projects (fallback)
const staticProjects = [
  { 
    id: 1, 
    category: 'cafe', 
    titleKey: 'maddiesCucina.title',
    date: '2024',
    image: "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-1-1536x8641-1.jpg",
    aspectRatio: '4/3',
    slug: 'maddies-cucina'
  },
  { 
    id: 2, 
    category: 'cafe', 
    titleKey: 'gurmeBahcesehir.title',
    date: '2024',
    image: "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-1-1536x8641-1.jpg",
    aspectRatio: '4/3',
    slug: 'gurme-bahcesehir'
  },
  { 
    id: 3, 
    category: 'clinic', 
    titleKey: 'halideAkinci.title',
    date: '2024',
    image: "/images/projects/Clinic/Halide Akıncı Clinic/Halide_Akinci_Klinik_Tasarim_1-1536x8641-1.jpg",
    aspectRatio: '4/3',
    slug: 'halide-akinci'
  },
  { 
    id: 4, 
    category: 'clinic', 
    titleKey: 'fulyaClinic.title',
    date: '2024',
    image: "/images/projects/Clinic/Fulya Clinic/Fulya_Klinik_Tasarim_1-1-1536x8641-1.jpg",
    aspectRatio: '4/3',
    slug: 'fulya-clinic'
  },
  { 
    id: 5, 
    category: 'office', 
    titleKey: 'tatbikiOffice.title',
    date: '2024',
    image: "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-0.jpg",
    aspectRatio: '4/3',
    slug: 'tatbiki-office'
  },
  { 
    id: 6, 
    category: 'residential', 
    titleKey: 'mbResidential.title',
    date: '2024',
    image: "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_2-1536x8641-1.jpg",
    aspectRatio: '4/3',
    slug: 'mb-residential'
  },
  { 
    id: 7, 
    category: 'residential', 
    titleKey: 'caddebostan.title',
    date: '2024',
    image: "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-0.jpg",
    aspectRatio: '4/3',
    slug: 'caddebostan-residential'
  },
  { 
    id: 8, 
    category: 'residential', 
    titleKey: 'germanyResidential.title',
    date: '2024',
    image: "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-2-1536x8641-1.jpg",
    aspectRatio: '4/3',
    slug: 'germany-residential'
  },
];

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const locale = useLocale();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [adminProjects, setAdminProjects] = useState<AdminProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem('adminProjects');
    if (storedProjects) {
      const allProjects = JSON.parse(storedProjects);
      const localeProjects = allProjects.filter((p: AdminProject) => p.locale === locale);
      setAdminProjects(localeProjects);
    }
    setIsLoading(false);
  }, [locale]);

  const filters = [
    { id: 'all', label: t('filterAll') },
    { id: 'cafe', label: t('filterCafe') },
    { id: 'clinic', label: t('filterClinic') },
    { id: 'office', label: t('filterOffice') },
    { id: 'residential', label: t('filterResidential') },
  ];

  // Combine static and admin projects
  const allProjects = [
    ...staticProjects.map(p => ({
      id: p.id.toString(),
      slug: p.slug,
      category: p.category,
      title: t(p.titleKey),
      titleKey: p.titleKey,
      date: p.date,
      image: p.image,
      aspectRatio: p.aspectRatio,
      isStatic: true
    })),
    ...adminProjects.map(p => ({
      id: p.id,
      slug: p.slug,
      category: p.category,
      title: p.titleKey ? (t(p.titleKey) || p.title) : p.title,
      titleKey: p.titleKey,
      date: p.year,
      image: p.heroImage,
      aspectRatio: '4/3',
      isStatic: false
    }))
  ];

  const filteredProjects = selectedFilter === 'all' 
    ? allProjects 
    : allProjects.filter(p => p.category === selectedFilter);

  return (
    <div className="w-full">
      {/* Hero Section with Header Image */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/header.webp"
            alt="Projects"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black/80"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-12">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white leading-relaxed tracking-wide drop-shadow-lg">
              {t('statement')}
            </h1>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 md:mb-8 leading-tight">
              {t('subtitle')}
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 md:mb-12">
              {t('description')}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 md:gap-6">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`text-sm md:text-base font-semibold transition-colors pb-2 border-b-2 ${
                  selectedFilter === filter.id
                    ? 'text-black border-black'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid - Masonry Style */}
      <section className="pb-16 md:pb-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 md:columns-2 gap-6 md:gap-8 lg:gap-12">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/${locale}/projects/${project.slug || project.id}`}
                className="group relative mb-6 md:mb-8 lg:mb-12 break-inside-avoid cursor-pointer block"
              >
                <div 
                  className="relative w-full overflow-hidden bg-gray-200"
                  style={{ aspectRatio: project.aspectRatio }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Animated Border Frame on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                      <rect
                        x="20"
                        y="20"
                        width="calc(100% - 40px)"
                        height="calc(100% - 40px)"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="2000"
                        strokeDashoffset="2000"
                        className="group-hover:animate-draw-border"
                      />
                    </svg>
                  </div>

                  {/* Text Box on Hover */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="bg-white border border-black p-4 md:p-5 relative">
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 text-black">
                        {project.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-500">
                        {project.date}
                      </p>
                      {/* Shadow box behind */}
                      <div className="absolute inset-0 border border-black translate-x-1 translate-y-1 -z-10 bg-white"></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
