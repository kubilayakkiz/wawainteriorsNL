'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="w-full">
      {/* Hero Section with Quote */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/header.webp"
            alt="Wawa Interiors"
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

      {/* About Us Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
                {t('aboutUs.title')}
              </h2>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-10 leading-tight">
                {t('aboutUs.statement')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                  {t('aboutUs.text1')}
                </p>
              </div>
              <div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                  {t('aboutUs.text2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* First Project Image - Horizontal */}
      <section className="w-full">
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
          <Image
            src="/images/about/about-2.jpg"
            alt="Modern Architecture - Residential Project"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
                {t('ourApproach.title')}
              </h2>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-10 leading-tight">
                {t('ourApproach.statement')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                  {t('ourApproach.text1')}
                </p>
              </div>
              <div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                  {t('ourApproach.text2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Vertical Images Side by Side */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="relative h-96 md:h-[600px] overflow-hidden">
              <Image
                src="/images/about/about-3.webp"
                alt="Modern Design - Contemporary Architecture"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-96 md:h-[600px] overflow-hidden">
              <Image
                src="/images/about/about-4.webp"
                alt="Luxury Interior - Elegant Spaces"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
                {t('philosophy.title')}
              </h2>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-10 leading-tight">
                {t('philosophy.statement')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                  {t('philosophy.text1')}
                </p>
              </div>
              <div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                  {t('philosophy.text2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {t('team.title')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              {t('team.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Canberk Y. */}
            <div className="group relative w-full aspect-[3/4] overflow-hidden bg-primary cursor-pointer">
              <Image
                src="/images/about/canberkY.webp"
                alt={t('team.canberk.name')}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Name - Left Bottom (Vertical) */}
              <div className="absolute left-0 bottom-0 bg-white px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="writing-vertical-rl text-black font-bold text-base md:text-lg whitespace-nowrap">
                  {t('team.canberk.name')}
                </div>
              </div>
              {/* Social Icons - Top Right */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a href="#" className="bg-white p-2 rounded hover:bg-gray-100 transition-colors">
                  <Instagram className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="bg-white p-2 rounded hover:bg-gray-100 transition-colors">
                  <Linkedin className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>

            {/* Erdem D. */}
            <div className="group relative w-full aspect-[3/4] overflow-hidden bg-primary cursor-pointer">
              <Image
                src="/images/about/erdemDE.webp"
                alt={t('team.erdem.name')}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Name - Left Bottom (Vertical) */}
              <div className="absolute left-0 bottom-0 bg-white px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="writing-vertical-rl text-black font-bold text-base md:text-lg whitespace-nowrap">
                  {t('team.erdem.name')}
                </div>
              </div>
              {/* Social Icons - Top Right */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a href="#" className="bg-white p-2 rounded hover:bg-gray-100 transition-colors">
                  <Instagram className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="bg-white p-2 rounded hover:bg-gray-100 transition-colors">
                  <Linkedin className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>

            {/* Müge D. */}
            <div className="group relative w-full aspect-[3/4] overflow-hidden bg-primary cursor-pointer">
              <Image
                src="/images/about/mugeD.webp"
                alt={t('team.muge.name')}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Name - Left Bottom (Vertical) */}
              <div className="absolute left-0 bottom-0 bg-white px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="writing-vertical-rl text-black font-bold text-base md:text-lg whitespace-nowrap">
                  {t('team.muge.name')}
                </div>
              </div>
              {/* Social Icons - Top Right */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a href="#" className="bg-white p-2 rounded hover:bg-gray-100 transition-colors">
                  <Instagram className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="bg-white p-2 rounded hover:bg-gray-100 transition-colors">
                  <Linkedin className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>

            {/* Zehra A. */}
            <div className="group relative w-full aspect-[3/4] overflow-hidden bg-primary cursor-pointer">
              <Image
                src="/images/about/zehraD.webp"
                alt={t('team.zehra.name')}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Name - Left Bottom (Vertical) */}
              <div className="absolute left-0 bottom-0 bg-white px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="writing-vertical-rl text-black font-bold text-base md:text-lg whitespace-nowrap">
                  {t('team.zehra.name')}
                </div>
              </div>
              {/* Social Icons - Top Right */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a href="#" className="bg-white p-2 rounded hover:bg-gray-100 transition-colors">
                  <Instagram className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="bg-white p-2 rounded hover:bg-gray-100 transition-colors">
                  <Linkedin className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
