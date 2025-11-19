'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, User, Tag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

// Helper function to get project images
const getProjectImages = (projectSlug: string) => {
  const imageMap: { [key: string]: { hero: string; gallery: string[] } } = {
    'maddies-cucina': {
      hero: "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-1-1536x8641-1.jpg",
      gallery: [
        "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-2-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-4-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-5-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-5-1536x8641-2.jpg",
        "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-7-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-8-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-9-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-10-1536x8641-1.jpg",
      ]
    },
    'gurme-bahcesehir': {
      hero: "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-1-1536x8641-1.jpg",
      gallery: [
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-3-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-4-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-5-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-6-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-8-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-9-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-11-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-13-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-14-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-15-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-16-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-17-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-19-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-21-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-22-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-24-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-26-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-27-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-28-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-30-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-31-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-32-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-33-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-34-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-35-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-36-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-38-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-39-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-40-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-41-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-42-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-43-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-44-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-45-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-46-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-47-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-48-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-49-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-50-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-51-1536x8641-1.jpg",
        "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-52-1536x8641-1.jpg",
      ]
    },
    'halide-akinci': {
      hero: "/images/projects/Clinic/Halide Akıncı Clinic/Halide_Akinci_Klinik_Tasarim_1-1536x8641-1.jpg",
      gallery: [
        "/images/projects/Clinic/Halide Akıncı Clinic/Halide_Akinci_Klinik_Tasarim_3-1536x8641-1.jpg",
        "/images/projects/Clinic/Halide Akıncı Clinic/Halide_Akinci_Klinik_Tasarim_4-1536x8641-1.jpg",
        "/images/projects/Clinic/Halide Akıncı Clinic/Halide_Akinci_Klinik_Tasarim_5-1536x8641-1.jpg",
        "/images/projects/Clinic/Halide Akıncı Clinic/Halide_Akinci_Klinik_Tasarim_6-1536x8641-1.jpg",
        "/images/projects/Clinic/Halide Akıncı Clinic/Halide_Akinci_Klinik_Tasarim_13-1536x8641-1.jpg",
      ]
    },
    'fulya-clinic': {
      hero: "/images/projects/Clinic/Fulya Clinic/Fulya_Klinik_Tasarim_1-1-1536x8641-1.jpg",
      gallery: [
        "/images/projects/Clinic/Fulya Clinic/Fulya_Klinik_Tasarim_2-1-1-1536x8641-1.jpg",
        "/images/projects/Clinic/Fulya Clinic/Fulya_Klinik_Tasarim_5-1-1-1536x8641-1.jpg",
        "/images/projects/Clinic/Fulya Clinic/Fulya_Klinik_Tasarim_6-1-1-1536x8641-1.jpg",
        "/images/projects/Clinic/Fulya Clinic/Fulya_Klinik_Tasarim_7-1-1-1536x8641-1.jpg",
      ]
    },
    'tatbiki-office': {
      hero: "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-0.jpg",
      gallery: [
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-1.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-2.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-3.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-4.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-5.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-6.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-8.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-9.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-10.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-11.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-12.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-13.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-14.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-15.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-16.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-17.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-18.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-19.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-20.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-21.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-22.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-23.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-24.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-25.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-26.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-29.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-30.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-31.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-32.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-33.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-34.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-35.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-36.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-37.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-38.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-39.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-41.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-42.jpg",
        "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-43.jpg",
      ]
    },
    'mb-residential': {
      hero: "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_2-1536x8641-1.jpg",
      gallery: [
        "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_3-1536x8641-1.jpg",
        "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_4-1536x8641-1.jpg",
        "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_5-1536x8641-1.jpg",
        "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_6-1536x8641-1.jpg",
        "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_7-1536x8641-1.jpg",
        "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_8-1536x8641-1.jpg",
        "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_9-1536x8641-1.jpg",
        "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_10-1536x8641-1.jpg",
      ]
    },
    'caddebostan': {
      hero: "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-0.jpg",
      gallery: [
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-1.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-2.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-3.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-4.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-5.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-6.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-7.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-8.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-9.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-10.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-11.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-12.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-14.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-15.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-16.jpg",
        "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-17.jpg",
      ]
    },
    'germany-residential': {
      hero: "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-2-1536x8641-1.jpg",
      gallery: [
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-4-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-5-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-6-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-7-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-8-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-9-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-10-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-11-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-12-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-13-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-14-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-15-1536x8641-1.jpg",
        "/images/projects/Residential/The Germany Residential Project/almanya-icmimar-16-1536x8641-1.jpg",
      ]
    },
  };
  return imageMap[projectSlug] || { hero: '', gallery: [] };
};

// Projects data
const projects = [
  { 
    id: 1, 
    slug: 'maddies-cucina',
    category: 'cafe', 
    titleKey: 'maddiesCucina.title',
    descriptionKey: 'maddiesCucina.description',
    year: '2024',
    location: 'Istanbul, Turkey',
    client: 'Maddie\'s Cucina',
    date: '2024',
    aspectRatio: '4/3'
  },
  { 
    id: 2, 
    slug: 'gurme-bahcesehir',
    category: 'cafe', 
    titleKey: 'gurmeBahcesehir.title',
    descriptionKey: 'gurmeBahcesehir.description',
    year: '2024',
    location: 'Bahçeşehir, Istanbul, Turkey',
    client: 'Gurme Bahçeşehir Restaurant',
    date: '2024',
    aspectRatio: '4/3'
  },
  { 
    id: 3, 
    slug: 'halide-akinci',
    category: 'clinic', 
    titleKey: 'halideAkinci.title',
    descriptionKey: 'halideAkinci.description',
    year: '2024',
    location: 'Istanbul, Turkey',
    client: 'Halide Akıncı Clinic',
    date: '2024',
    aspectRatio: '4/3'
  },
  { 
    id: 4, 
    slug: 'fulya-clinic',
    category: 'clinic', 
    titleKey: 'fulyaClinic.title',
    descriptionKey: 'fulyaClinic.description',
    year: '2024',
    location: 'Fulya, Istanbul, Turkey',
    client: 'Fulya Clinic',
    date: '2024',
    aspectRatio: '4/3'
  },
  { 
    id: 5, 
    slug: 'tatbiki-office',
    category: 'office', 
    titleKey: 'tatbikiOffice.title',
    descriptionKey: 'tatbikiOffice.description',
    year: '2024',
    location: 'Istanbul, Turkey',
    client: 'University',
    date: '2024',
    aspectRatio: '4/3'
  },
  { 
    id: 6, 
    slug: 'mb-residential',
    category: 'residential', 
    titleKey: 'mbResidential.title',
    descriptionKey: 'mbResidential.description',
    year: '2024',
    location: 'Istanbul, Turkey',
    client: 'Private Client',
    date: '2024',
    aspectRatio: '4/3'
  },
  { 
    id: 7, 
    slug: 'caddebostan',
    category: 'residential', 
    titleKey: 'caddebostan.title',
    descriptionKey: 'caddebostan.description',
    year: '2024',
    location: 'Caddebostan, Istanbul, Turkey',
    client: 'Private Client',
    date: '2024',
    aspectRatio: '4/3'
  },
  { 
    id: 8, 
    slug: 'germany-residential',
    category: 'residential', 
    titleKey: 'germanyResidential.title',
    descriptionKey: 'germanyResidential.description',
    year: '2024',
    location: 'Germany',
    client: 'Private Client',
    date: '2024',
    aspectRatio: '4/3'
  },
];

export default function ProjectDetailPage({ params }: { params: { id: string; locale: string } }) {
  const t = useTranslations('projects');
  const locale = useLocale();
  const projectId = parseInt(params.id);
  const project = projects.find(p => p.id === projectId);

  const [images, setImages] = useState<{ hero: string; gallery: string[] }>({ hero: '', gallery: [] });
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (project) {
      const projectImages = getProjectImages(project.slug);
      setImages(projectImages);
    }
  }, [project]);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && images.gallery.length > 0) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.gallery.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && images.gallery.length > 0) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.gallery.length) % images.gallery.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageIndex, images.gallery.length]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href={`/${locale}/projects`} className="text-primary hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const relatedProjects = projects
    .filter(p => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      architecture: t('filterArchitecture'),
      interior: t('filterInterior'),
      landscape: t('filterLandscape'),
      cafe: t('filterCafe'),
      clinic: t('filterClinic'),
      office: t('filterOffice'),
      residential: t('filterResidential'),
      retail: t('filterRetail'),
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="w-full">
      {/* Hero Image */}
      {images.hero && (
        <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          <Image
            src={images.hero}
            alt={t(project.titleKey)}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Back Button */}
          <div className="absolute top-4 md:top-8 left-4 md:left-8 z-10">
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-white px-4 py-2 rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-semibold">{t('detail.backToProjects')}</span>
            </Link>
          </div>
        </section>
      )}

      {/* Project Info Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Project Details - 4 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  {t('detail.year')}
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {project.year}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  {t('detail.location')}
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {project.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  {t('detail.client')}
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {project.client}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  {t('detail.category')}
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {getCategoryLabel(project.category)}
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
            {t(project.titleKey)}
          </h1>

          {/* Description */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('detail.description')}
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
              {t(project.descriptionKey)}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {images.gallery && images.gallery.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="w-full px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
              {images.gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200 cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image}
                    alt={`${t(project.titleKey)} - Gallery ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && images.gallery.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous Button */}
          {images.gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next Button */}
          {images.gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images.gallery[selectedImageIndex]}
              alt={`${t(project.titleKey)} - Gallery ${selectedImageIndex + 1}`}
              width={1920}
              height={1080}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          {/* Image Counter */}
          {images.gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded">
              {selectedImageIndex + 1} / {images.gallery.length}
            </div>
          )}
        </div>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">
              {t('detail.relatedProjects')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedProjects.map((relatedProject) => {
                const relatedImages = getProjectImages(relatedProject.slug);
                return (
                  <Link
                    key={relatedProject.id}
                    href={`/${locale}/projects/${relatedProject.id}`}
                    className="group"
                  >
                    <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden bg-gray-200">
                      {relatedImages.hero && (
                        <Image
                          src={relatedImages.hero}
                          alt={t(relatedProject.titleKey)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-black group-hover:text-primary transition-colors">
                      {t(relatedProject.titleKey)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {relatedProject.date}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
