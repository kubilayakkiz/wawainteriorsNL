'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function CafeServicePage() {
  const t = useTranslations('services');
  const locale = useLocale();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: t('cafe.faq1'),
      answer: t('cafe.faq1Answer'),
    },
    {
      question: t('cafe.faq2'),
      answer: t('cafe.faq2Answer'),
    },
    {
      question: t('cafe.faq3'),
      answer: t('cafe.faq3Answer'),
    },
    {
      question: t('cafe.faq4'),
      answer: t('cafe.faq4Answer'),
    },
  ];

  const relatedProjects = [
    { id: 1, title: "Maddie's Cucina", image: "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-1-1536x8641-1.jpg" },
    { id: 2, title: 'Gurme Bahçeşehir Restaurant', image: '/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-1-1536x8641-1.jpg' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/services/restaurant.jpg"
            alt={t('cafe.heroTitle')}
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
              {t('cafe.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
              {t('cafe.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
            {t('cafe.overview')}
          </p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
            {t('cafe.overview2')}
          </p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {t('cafe.overview3')}
          </p>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8">
            {t('cafe.approachTitle')}
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
            {t('cafe.approachText')}
          </p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {t('cafe.approachText2')}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12">
            {t('faqTitle')}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 md:w-6 md:h-6 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 py-4 md:px-8 md:py-6 border-t border-gray-200">
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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
            {t('cafe.cta')}
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
            {t('ctaDescription')}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-black text-white px-8 py-4 rounded-md font-semibold text-base md:text-lg hover:bg-gray-800 transition-colors"
          >
            {t('cafe.ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}
