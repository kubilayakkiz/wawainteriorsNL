'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResidentialServicePage() {
  const t = useTranslations('services');
  const locale = useLocale();

  const serviceItems = [
    t('residential.service1'),
    t('residential.service2'),
    t('residential.service3'),
    t('residential.service4'),
    t('residential.service5'),
  ];

  const approachItems = [
    t('residential.approach1'),
    t('residential.approach2'),
    t('residential.approach3'),
    t('residential.approach4'),
    t('residential.approach5'),
  ];

  const relatedProjects = [
    { id: 6, title: 'M.B Residential Design and Implementation', image: '/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_2-1536x8641-1.jpg' },
    { id: 7, title: 'Caddebostan Residential Project', image: '/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-0.jpg' },
    { id: 8, title: 'The Germany Residential Project', image: '/images/projects/Residential/The Germany Residential Project/almanya-icmimar-2-1536x8641-1.jpg' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/services/residantel.jpg"
            alt={t('residential.heroTitle')}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Back Button */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8 z-10">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 bg-white/90 hover:bg-white px-4 py-2 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('backToServices')}</span>
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t('residential.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
              {t('residential.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
            {t('residential.overview')}
          </p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {t('residential.overview2')}
          </p>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12">
            {t('residential.whatWeOffer')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {serviceItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8">
            {t('residential.approachTitle')}
          </h2>
          <div className="mb-8 md:mb-12">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
              {t('residential.approachText')}
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              {t('residential.approachText2')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {approachItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12">
              {t('relatedProjects')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/${locale}/projects/${project.id}`}
                  className="group"
                >
                  <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden bg-gray-200 rounded-lg">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-black group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            {t('residential.cta')}
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
            {t('ctaDescription')}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-black text-white px-8 py-4 rounded-md font-semibold text-base md:text-lg hover:bg-gray-800 transition-colors"
          >
            {t('residential.ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}
