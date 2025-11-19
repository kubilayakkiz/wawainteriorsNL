'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, Clock, Facebook, Instagram } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full">
      {/* Hero Section with Header Image */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/header.webp"
            alt="Contact"
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

      {/* Contact Section - Two Columns */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Contact Info */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-12">
                {t('title')}
              </h2>
              <div className="space-y-8 md:space-y-10">
                {/* Address */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" strokeWidth={2} />
                    </div>
                    <h3 className="text-xs md:text-sm uppercase tracking-wider font-semibold text-gray-500">
                      {t('address')}
                    </h3>
                  </div>
                  <div className="pl-14 md:pl-16">
                    <p className="text-sm md:text-base text-gray-900 mb-1">{t('addressLine1')}</p>
                    <p className="text-sm md:text-base text-gray-900 mb-1">{t('addressLine2')}</p>
                    <p className="text-sm md:text-base text-gray-900">{t('addressLine3')}</p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" strokeWidth={2} />
                    </div>
                    <h3 className="text-xs md:text-sm uppercase tracking-wider font-semibold text-gray-500">
                      {t('openingHours')}
                    </h3>
                  </div>
                  <div className="pl-14 md:pl-16">
                    <p className="text-sm md:text-base text-gray-900 mb-1">{t('hoursWeekday')}</p>
                    <p className="text-sm md:text-base text-gray-900 mb-1">{t('hoursSaturday')}</p>
                    <p className="text-sm md:text-base text-gray-900">{t('hoursSunday')}</p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" strokeWidth={2} />
                    </div>
                    <h3 className="text-xs md:text-sm uppercase tracking-wider font-semibold text-gray-500">
                      {t('email')}
                    </h3>
                  </div>
                  <div className="pl-14 md:pl-16">
                    <a
                      href="mailto:info@wawainteriors.nl"
                      className="text-sm md:text-base text-gray-900 hover:text-primary transition-colors break-all"
                    >
                      info@wawainteriors.nl
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" strokeWidth={2} />
                    </div>
                    <h3 className="text-xs md:text-sm uppercase tracking-wider font-semibold text-gray-500">
                      {t('phone')}
                    </h3>
                  </div>
                  <div className="pl-14 md:pl-16">
                    <a
                      href="tel:+902127062832"
                      className="text-sm md:text-base text-gray-900 hover:text-primary transition-colors"
                    >
                      +90 212 706 2832
                    </a>
                  </div>
                </div>

                {/* Socials */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Instagram className="w-5 h-5 md:w-6 md:h-6 text-primary" strokeWidth={2} />
                    </div>
                    <h3 className="text-xs md:text-sm uppercase tracking-wider font-semibold text-gray-500">
                      {t('socials')}
                    </h3>
                  </div>
                  <div className="pl-14 md:pl-16 flex flex-col gap-2">
                    <a
                      href="#"
                      className="text-sm md:text-base text-gray-900 hover:text-primary transition-colors"
                    >
                      Facebook
                    </a>
                    <a
                      href="#"
                      className="text-sm md:text-base text-gray-900 hover:text-primary transition-colors"
                    >
                      Instagram
                    </a>
                    <a
                      href="#"
                      className="text-sm md:text-base text-gray-900 hover:text-primary transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Map and Form */}
            <div className="space-y-8">
              {/* Map Section */}
              <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-200 rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.4769617833737!2d4.894153315801807!3d52.37021617978583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c0fc5c8687%3A0x7d9c9932c45d0b0f!2sHerengracht%20280%2C%201016%20BX%20Amsterdam%2C%20Netherlands!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>

              {/* Contact Form */}
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                    {t('form.title')}
                  </h2>
                  <p className="text-base md:text-lg text-gray-600">
                    {t('subtitle')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email - Side by Side */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
                        {t('form.name')} <span className="text-gray-500">(required)</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                        {t('form.email')} <span className="text-gray-500">(required)</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm text-gray-700 mb-2">
                      {t('form.message')}
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      required
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent resize-none"
                    />
                  </div>

                  {/* Send Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-black text-white px-8 py-3 rounded-md font-semibold text-sm md:text-base hover:bg-gray-800 transition-colors"
                    >
                      {t('form.send')}
                    </button>
                  </div>

                  {submitted && (
                    <p className="text-green-600 text-sm mt-4">Message sent successfully!</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
