'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const serviceSlugs = ['residential', 'office', 'cafe', 'clinic', 'retail'];

// Get related projects for each service
const getRelatedProjects = (slug: string) => {
  const projectMap: { [key: string]: { id: number; title: string; image: string }[] } = {
    residential: [
      { id: 6, title: 'M.B Residential Design and Implementation', image: '/images/projects/Residential/M.B Residential Design and Implementation/MB_Konut_Tasarimi_2-1536x8641-1.jpg' },
      { id: 7, title: 'Caddebostan Residential Project', image: '/images/projects/Residential/Caddebostan Residential Project/ic-mimar-ev-tasarimlari-0.jpg' },
      { id: 8, title: 'The Germany Residential Project', image: '/images/projects/Residential/The Germany Residential Project/almanya-icmimar-2-1536x8641-1.jpg' },
    ],
    office: [
      { id: 5, title: 'Tatbik-i Office Project', image: '/images/projects/Office/Tatbik-i Office Project/acik-ofis-tasarimlari-0.jpg' },
    ],
    cafe: [
      { id: 1, title: "Maddie's Cucina", image: "/images/projects/CafeRestaurant/Maddie's Cucina/otantik-cafe-dekorasyon-1-1536x8641-1.jpg" },
      { id: 2, title: 'Gurme Bahçeşehir Restaurant', image: '/images/projects/CafeRestaurant/Gurme Bahçeşehir Restaurant/Gurme-restoran-icmimari-1-1536x8641-1.jpg' },
    ],
    clinic: [
      { id: 3, title: 'Halide Akıncı Clinic', image: '/images/projects/Clinic/Halide Akıncı Clinic/Halide_Akinci_Klinik_Tasarim_1-1536x8641-1.jpg' },
      { id: 4, title: 'Fulya Clinic', image: '/images/projects/Clinic/Fulya Clinic/Fulya_Klinik_Tasarim_1-1-1536x8641-1.jpg' },
    ],
    retail: [],
  };
  return projectMap[slug] || [];
};

export default function ServiceDetailPage({ params }: { params: { slug: string; locale: string } }) {
  const t = useTranslations('services');
  const locale = useLocale();
  const { slug } = params;
  
  // React Hooks must be called before any early returns
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!serviceSlugs.includes(slug)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <Link href={`/${locale}/services`} className="text-primary hover:underline">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const service = {
    slug,
    title: t(`${slug}.title`),
    heroTitle: t(`${slug}.heroTitle`),
    heroSubtitle: t(`${slug}.heroSubtitle`),
    overview: t(`${slug}.overview`),
    overview2: t(`${slug}.overview2`, { defaultValue: '' }),
    overview3: t(`${slug}.overview3`, { defaultValue: '' }),
    approachTitle: t(`${slug}.approachTitle`, { defaultValue: '' }),
    approachText: t(`${slug}.approachText`, { defaultValue: '' }),
    approachText2: t(`${slug}.approachText2`, { defaultValue: '' }),
    image: `/images/services/${slug === 'cafe' ? 'restaurant' : slug === 'retail' ? 'store' : slug}.jpg`,
  };

  const getServiceItems = () => {
    const items = [];
    for (let i = 1; i <= 5; i++) {
      const item = t(`${slug}.service${i}`, { defaultValue: '' });
      if (item) {
        items.push(item);
      }
    }
    return items;
  };

  const getApproachItems = () => {
    const items = [];
    for (let i = 1; i <= 5; i++) {
      const item = t(`${slug}.approach${i}`, { defaultValue: '' });
      if (item) {
        items.push(item);
      }
    }
    return items;
  };

  const getFAQs = () => {
    const faqs = [];
    for (let i = 1; i <= 4; i++) {
      const question = t(`${slug}.faq${i}`, { defaultValue: '' });
      const answer = t(`${slug}.faq${i}Answer`, { defaultValue: '' });
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
    return faqs;
  };

  const serviceItems = getServiceItems();
  const approachItems = getApproachItems();
  const faqs = getFAQs();
  const relatedProjects = getRelatedProjects(slug);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image}
            alt={service.heroTitle}
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
              {service.heroTitle}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
              {service.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
              {service.overview}
            </p>
            {service.overview2 && (
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                {service.overview2}
              </p>
            )}
            {service.overview3 && (
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {service.overview3}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      {serviceItems.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12">
              {t(`${slug}.whatWeOffer`, { defaultValue: 'What We Offer' })}
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
      )}

      {/* Approach Section */}
      {service.approachTitle && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8">
              {service.approachTitle}
            </h2>
            <div className="max-w-3xl mb-8 md:mb-12">
              {service.approachText && (
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                  {service.approachText}
                </p>
              )}
              {service.approachText2 && (
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {service.approachText2}
                </p>
              )}
            </div>
            {approachItems.length > 0 && (
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
            )}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gray-50">
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
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
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
      )}

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
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
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            {t(`${slug}.cta`, { defaultValue: 'Ready to get started?' })}
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
            {t('ctaDescription')}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-black text-white px-8 py-4 rounded-md font-semibold text-base md:text-lg hover:bg-gray-800 transition-colors"
          >
            {t(`${slug}.ctaButton`, { defaultValue: 'Get a Free Quote' })}
          </Link>
        </div>
      </section>
    </div>
  );
}

