'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Home, Briefcase, Coffee, Heart, ShoppingBag, Search, FileText, Palette, Hammer } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('home');
  const tServices = useTranslations('services');
  const locale = useLocale();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [defaultBackground, setDefaultBackground] = useState<string>('');

  const slides = [
    {
      title: 'Modern Interior Design Excellence',
      description: 'We transform spaces into beautiful, functional environments that reflect your unique style and enhance your lifestyle. Our team of experienced designers brings creativity and expertise to every project.',
      image: "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-11.webp",
    },
    {
      title: 'Residential Design & Execution',
      description: 'Transform your home into a personalized sanctuary that reflects your unique style and lifestyle. We create spaces that inspire and delight.',
      image: "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarim_1-1536x8641-1.jpg",
    },
    {
      title: 'Office Design & Execution',
      description: 'Create productive and inspiring workspaces that enhance employee well-being and company culture. Modern offices designed for success.',
      image: "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-0.jpg",
    },
    {
      title: 'Cafe & Restaurant Design',
      description: 'Design inviting dining spaces that create memorable experiences for your guests. From cozy cafes to fine dining restaurants.',
      image: "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-1-1536x8641-1.jpg",
    },
  ];

  // Auto-slide functionality for hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        setPreviousSlide(prev);
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 800);
        return (prev + 1) % slides.length;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  // Auto-slide functionality for projects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectSlide((prev) => (prev + 1) % 6);
    }, 6000); // Change project every 6 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setPreviousSlide(currentSlide);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 800);
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => {
    setPreviousSlide(currentSlide);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 800);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setPreviousSlide(currentSlide);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 800);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const services = [
    {
      id: 'residential',
      icon: Home,
      title: tServices('residential.title'),
      description: tServices('residential.description'),
      image: '/images/services/residantel.jpg',
      href: `/${locale}/services/residential`,
    },
    {
      id: 'office',
      icon: Briefcase,
      title: tServices('office.title'),
      description: tServices('office.description'),
      image: '/images/services/office.jpg',
      href: `/${locale}/services/office`,
    },
    {
      id: 'cafe',
      icon: Coffee,
      title: tServices('cafe.title'),
      description: tServices('cafe.description'),
      image: '/images/services/restaurant.jpg',
      href: `/${locale}/services/cafe`,
    },
    {
      id: 'clinic',
      icon: Heart,
      title: tServices('clinic.title'),
      description: tServices('clinic.description'),
      image: '/images/services/clinic.jpg',
      href: `/${locale}/services/clinic`,
    },
    {
      id: 'retail',
      icon: ShoppingBag,
      title: tServices('retail.title'),
      description: tServices('retail.description'),
      image: '/images/services/store.webp',
      href: `/${locale}/services/retail`,
    },
  ];

  // Set random default background on mount
  useEffect(() => {
    if (services.length > 0) {
      const randomService = services[Math.floor(Math.random() * services.length)];
      setDefaultBackground(randomService.image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services.length]);

  return (
    <div className="w-full">
      {/* Hero Slider Section */}
      <section className="min-h-screen flex flex-col md:flex-row relative">
        {/* Left Panel - Text Content */}
        <div className="w-full md:w-1/2 bg-white flex items-center px-4 sm:px-6 md:px-8 lg:px-16 py-12 md:py-20 relative z-10 overflow-hidden">
          <div className="max-w-2xl w-full relative">
            <div className="relative min-h-[300px]">
              {slides.map((slide, index) => {
                const isActive = index === currentSlide;
                const isPrevious = index === previousSlide && isTransitioning && previousSlide !== currentSlide;
                
                if (!isActive && !isPrevious) return null;
                
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 ${
                      isActive ? 'z-10' : 'z-20'
                    }`}
                    style={{
                      animation: isActive && isTransitioning
                        ? 'slideInFromLeft 0.8s ease-in-out'
                        : isPrevious
                        ? 'slideOutToLeft 0.8s ease-in-out'
                        : 'none',
                      transform: !isTransitioning && isActive ? 'translateX(0)' : undefined
                    }}
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="relative z-30 mt-8">
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center gap-2 text-black font-semibold text-base md:text-lg group mb-8 md:mb-12"
              >
                View Project
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={prevSlide}
                  className="p-2 md:p-3 border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 md:p-3 border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Image Slider */}
        <div className="w-full md:w-1/2 relative min-h-[400px] sm:min-h-[500px] md:min-h-screen overflow-hidden">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            const isPrevious = index === previousSlide && isTransitioning && previousSlide !== currentSlide;
            
            if (!isActive && !isPrevious) return null;
            
            return (
              <div
                key={index}
                className={`absolute inset-0 ${
                  isActive ? 'z-10' : 'z-20'
                }`}
              >
                <div 
                  className="absolute inset-0"
                  style={{
                    animation: isActive && isTransitioning
                      ? 'slideInFromBottom 0.8s ease-in-out'
                      : isPrevious
                      ? 'slideOutToTop 0.8s ease-in-out'
                      : 'none',
                    transform: !isTransitioning && isActive ? 'translateY(0) scale(1)' : undefined
                  }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
                </div>
              </div>
            );
          })}
          
          {/* Pagination Dots */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-primary w-8'
                    : 'bg-white/30 hover:bg-white/50 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 text-white/50 text-xs md:text-sm z-20">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </section>

      {/* Our Process Section - Workflow */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <p className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-2">{t('processTitle')}</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">{t('processSubtitle')}</h2>
          </div>
          
          {/* Process Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
            {[
              {
                step: '01',
                title: t('processAnalysis.title'),
                description: t('processAnalysis.description'),
              },
              {
                step: '02',
                title: t('processProposal.title'),
                description: t('processProposal.description'),
              },
              {
                step: '03',
                title: t('processDesign.title'),
                description: t('processDesign.description'),
              },
              {
                step: '04',
                title: t('processExecution.title'),
                description: t('processExecution.description'),
              },
            ].map((process, index) => (
              <div key={index} className="relative">
                <div className="mb-4 md:mb-6">
                  <span className="text-4xl md:text-6xl font-bold text-gray-100">{process.step}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{process.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{process.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 right-0 w-full h-0.5">
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gray-200"></div>
                    <div className="absolute right-0 top-0 w-2 h-2 bg-primary rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Process Flow Visual */}
          <div className="relative mt-16">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200"></div>
              {[
                { label: t('processAnalysis.title'), Icon: Search },
                { label: t('processProposal.title'), Icon: FileText },
                { label: t('processDesign.title'), Icon: Palette },
                { label: t('processExecution.title'), Icon: Hammer },
              ].map((item, index) => {
                const Icon = item.Icon;
                return (
                  <div key={index} className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mb-3 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-700">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative min-h-[70vh] w-full overflow-hidden bg-black">
        {/* Background Images */}
        <div className="absolute inset-0">
          {/* Default random background */}
          {defaultBackground && (
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                hoveredService === null ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={defaultBackground}
                alt="Default Background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
          )}

          {/* Service backgrounds on hover */}
          {services.map((service) => (
            <div
              key={`bg-${service.id}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                hoveredService === service.id ? 'opacity-100 z-20' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={service.image || '/images/services/residantel.jpg'}
                alt={service.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="relative z-30 min-h-[70vh] flex items-center">
          <div className="w-full">
            {/* Desktop: 5 Columns */}
            <div className="hidden md:grid md:grid-cols-5 h-[70vh]">
              {services.map((service, index) => {
                const isHovered = hoveredService === service.id;
                return (
                  <div
                    key={service.id}
                    className="relative h-full flex flex-col justify-end p-6 lg:p-8 xl:p-12 cursor-pointer group border-r border-white/20 last:border-r-0"
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    {/* Title - Bottom Left */}
                    <div
                      className={`transition-all duration-500 ease-in-out ${
                        isHovered ? 'transform -translate-y-8' : 'transform translate-y-0'
                      }`}
                    >
                      <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4">
                        {service.title}
                      </h3>

                      {/* Description and Button - Only visible on hover */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ${
                          isHovered
                            ? 'opacity-100 max-h-96'
                            : 'opacity-0 max-h-0'
                        }`}
                      >
                        <p className="text-sm md:text-base lg:text-lg text-white/90 mb-6 leading-relaxed">
                          {service.description}
                        </p>
                        <Link
                          href={service.href}
                          className="inline-flex items-center gap-2 text-white font-semibold text-sm md:text-base hover:gap-3 transition-all group/link"
                        >
                          Learn More
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile: Vertical Stack */}
            <div className="md:hidden space-y-0">
              {services.map((service, index) => {
                const isHovered = hoveredService === service.id;
                return (
                  <div
                    key={service.id}
                    className="relative min-h-[200px] flex flex-col justify-end p-6 cursor-pointer border-b border-white/20 last:border-b-0"
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                    onClick={() => setHoveredService(isHovered ? null : service.id)}
                  >
                    {/* Background for mobile */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={service.image || '/images/services/residantel.jpg'}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div
                        className={`transition-all duration-500 ease-in-out ${
                          isHovered ? 'transform -translate-y-4' : 'transform translate-y-0'
                        }`}
                      >
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                          {service.title}
                        </h3>

                        <div
                          className={`overflow-hidden transition-all duration-500 ${
                            isHovered
                              ? 'opacity-100 max-h-96'
                              : 'opacity-0 max-h-0'
                          }`}
                        >
                          <p className="text-sm text-white/90 mb-4 leading-relaxed">
                            {service.description}
                          </p>
                          <Link
                            href={service.href}
                            className="inline-flex items-center gap-2 text-white font-semibold text-sm hover:gap-3 transition-all"
                          >
                            Learn More
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Request Quote Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Get a Free Quote
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 md:mb-12">
              Ready to transform your space? Contact us today for a free consultation and quote.
            </p>
            <Link
              href={`/${locale}/quote`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Request Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Slider Section - Dark Background */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-black text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <p className="text-xs md:text-sm uppercase tracking-wider text-gray-400 mb-2">{t('projectsSubtitle')}</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">{t('projectsTitle')}</h2>
          </div>

          {/* Projects Slider */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentProjectSlide * 100}%)` }}
              >
                {[
                  { 
                    id: 1, 
                    title: 'Caddebostan Residential Project', 
                    location: 'Istanbul, Turkey', 
                    category: 'Residential',
                    image: "/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-11.webp",
                    slug: 'caddebostan-residential'
                  },
                  { 
                    id: 2, 
                    title: 'Tatbik-i Office Project', 
                    location: 'Istanbul, Turkey', 
                    category: 'Office',
                    image: "/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-0.jpg",
                    slug: 'tatbiki-office'
                  },
                  { 
                    id: 3, 
                    title: "Maddie's Cucina", 
                    location: 'Istanbul, Turkey', 
                    category: 'Cafe & Restaurant',
                    image: "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-1-1536x8641-1.jpg",
                    slug: 'maddies-cucina'
                  },
                  { 
                    id: 4, 
                    title: 'M.B Residential Design and Implementation', 
                    location: 'Istanbul, Turkey', 
                    category: 'Residential',
                    image: "/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarim_1-1536x8641-1.jpg",
                    slug: 'mb-residential'
                  },
                  { 
                    id: 5, 
                    title: 'Halide Akıncı Clinic', 
                    location: 'Istanbul, Turkey', 
                    category: 'Clinic & Healthcare',
                    image: "/images/projects/Clinic/Halide Akıncı Clinic/Halide_Akinci_Klinik_Tasarim_1-1536x8641-1.jpg",
                    slug: 'halide-akinci'
                  },
                  { 
                    id: 6, 
                    title: 'Gurme Bahçeşehir Restaurant', 
                    location: 'Istanbul, Turkey', 
                    category: 'Cafe & Restaurant',
                    image: "/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-1-1536x8641-1.jpg",
                    slug: 'gurme-bahcesehir'
                  },
                ].map((project) => (
                  <div key={project.id} className="min-w-full px-2 md:px-4">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
                      {/* Left - Image */}
                      <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden order-2 md:order-1">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>

                      {/* Right - Content */}
                      <div className="order-1 md:order-2">
                        <span className="text-xs md:text-sm text-primary font-semibold mb-2 block">{project.category}</span>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">{project.title}</h3>
                        <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4 md:mb-6">
                          {project.location} • A stunning example of modern interior design that combines functionality with aesthetic beauty.
                        </p>
                        <Link
                          href={`/${locale}/projects/${project.slug}`}
                          className="inline-flex items-center gap-2 text-white font-semibold text-sm md:text-base hover:gap-3 transition-all"
                        >
                          View Project
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 md:mt-12">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProjectSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentProjectSlide
                        ? 'bg-primary w-8'
                        : 'bg-white/30 w-2 hover:bg-white/50'
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={() => setCurrentProjectSlide((prev) => (prev - 1 + 6) % 6)}
                  className="p-2 md:p-3 border border-white/20 hover:bg-white/10 transition-colors"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <span className="text-xs md:text-sm text-gray-400">
                  {currentProjectSlide + 1} / 6
                </span>
                <button
                  onClick={() => setCurrentProjectSlide((prev) => (prev + 1) % 6)}
                  className="p-2 md:p-3 border border-white/20 hover:bg-white/10 transition-colors"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Ideas Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <p className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-2">RECENT</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">News & Ideas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Inspiring Presence of Design Thanks to Indoor Plants',
                date: 'August 2, 2024',
                image: 'https://placehold.co/600x400/000000/bfca02?text=Design+News+1',
              },
              {
                title: 'Modern Minimalism in Contemporary Living Spaces',
                date: 'July 15, 2024',
                image: 'https://placehold.co/600x400/000000/bfca02?text=Design+News+2',
              },
              {
                title: 'Sustainable Materials in Interior Design',
                date: 'June 28, 2024',
                image: 'https://placehold.co/600x400/000000/bfca02?text=Design+News+3',
              },
            ].map((article, index) => (
              <Link
                key={index}
                href="/blog"
                className="group"
              >
                <div className="relative h-48 sm:h-56 md:h-64 mb-3 md:mb-4 bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/20 text-center">
                      <div className="text-xl md:text-2xl font-bold">Article {index + 1}</div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500">{article.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
