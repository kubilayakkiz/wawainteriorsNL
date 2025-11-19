'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [defaultBackground, setDefaultBackground] = useState<string>('');

  const services = [
    {
      id: 'residential',
      title: t('residential.title'),
      description: t('residential.description'),
      image: '/images/services/residantel.jpg',
      href: `/${locale}/services/residential`,
    },
    {
      id: 'office',
      title: t('office.title'),
      description: t('office.description'),
      image: '/images/services/office.jpg',
      href: `/${locale}/services/office`,
    },
    {
      id: 'cafe',
      title: t('cafe.title'),
      description: t('cafe.description'),
      image: '/images/services/restaurant.jpg',
      href: `/${locale}/services/cafe`,
    },
    {
      id: 'clinic',
      title: t('clinic.title'),
      description: t('clinic.description'),
      image: '/images/services/clinic.jpg',
      href: `/${locale}/services/clinic`,
    },
    {
      id: 'retail',
      title: t('retail.title'),
      description: t('retail.description'),
      image: '/images/services/store.webp',
      href: `/${locale}/services/retail`,
    },
  ];

  // Set random default background on mount
  useEffect(() => {
    const randomService = services[Math.floor(Math.random() * services.length)];
    setDefaultBackground(randomService.image);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section with Header Image */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/header.webp"
            alt="Services"
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
              {t('heroQuote')}
            </h1>
          </div>
        </div>
      </section>

      {/* Services Introduction Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            {/* Left Column - Title and Statement */}
            <div className="flex flex-col">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
                {t('introTitle')}
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                {t('introStatement')}
              </p>
            </div>
            {/* Middle Column - First Text */}
            <div className="flex flex-col pt-[4.5rem] md:pt-[5.5rem] lg:pt-[6.5rem]">
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {t('introText1')}
              </p>
            </div>
            {/* Right Column - Second Text */}
            <div className="flex flex-col pt-[4.5rem] md:pt-[5.5rem] lg:pt-[6.5rem]">
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {t('introText2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="relative min-h-screen w-full overflow-hidden bg-black">
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
                src={service.image}
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
        <div className="relative z-30 min-h-screen flex items-center">
          <div className="w-full">
            {/* Desktop: 5 Columns */}
            <div className="hidden md:grid md:grid-cols-5 h-screen">
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
                          {t('learnMore')}
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
                        src={service.image}
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
                            {t('learnMore')}
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
    </div>
  );
}
