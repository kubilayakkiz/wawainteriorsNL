'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Globe, ChevronDown, LogIn } from 'lucide-react';

export default function Navigation() {
  const t = useTranslations('nav');
  const tServices = useTranslations('services');
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);

  const servicesSubmenu = [
    { href: `/${locale}/services/residential`, label: tServices('residential.title') },
    { href: `/${locale}/services/office`, label: tServices('office.title') },
    { href: `/${locale}/services/cafe`, label: tServices('cafe.title') },
    { href: `/${locale}/services/clinic`, label: tServices('clinic.title') },
    { href: `/${locale}/services/retail`, label: tServices('retail.title') },
  ];

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/projects`, label: t('projects') },
    { href: `/${locale}/services`, label: t('services'), hasSubmenu: true },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const getLocalizedPath = (newLocale: string) => {
    const path = pathname.replace(`/${locale}`, '') || '/';
    return `/${newLocale}${path}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Left */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/logo.webp"
              alt="Wawa Interiors"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.hasSubmenu) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`text-sm font-medium transition-colors flex items-center gap-1 py-2 ${
                        pathname === link.href || pathname.startsWith(`${link.href}/`)
                          ? 'text-black'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                    </Link>
                    {isServicesOpen && (
                      <div className="absolute top-full left-0 w-56">
                        {/* Invisible bridge to maintain hover area */}
                        <div className="h-2 w-full"></div>
                        <div className="bg-white border border-gray-200 shadow-lg -mt-2">
                          {servicesSubmenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`block px-4 py-3 text-sm transition-colors ${
                                pathname === subItem.href
                                  ? 'text-black bg-gray-50 font-semibold'
                                  : 'text-gray-600 hover:text-black hover:bg-gray-50'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Language & Actions */}
          <div className="hidden md:flex items-center gap-6">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black"
              >
                <Globe className="w-4 h-4" />
                {locale.toUpperCase()}
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-20 bg-white border border-gray-200 shadow-lg">
                  <Link
                    href={getLocalizedPath('en')}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setIsLangOpen(false)}
                  >
                    EN
                  </Link>
                  <Link
                    href={getLocalizedPath('nl')}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setIsLangOpen(false)}
                  >
                    NL
                  </Link>
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/quote`}
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              {t('quote')}
            </Link>
            <Link
              href={`/${locale}/client-panel`}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black"
            >
              <LogIn className="w-4 h-4" />
              {t('clientPanel')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => {
              if (link.hasSubmenu) {
                return (
                  <div key={link.href}>
                    <button
                      onClick={() => setIsServicesMobileOpen(!isServicesMobileOpen)}
                      className={`w-full flex items-center justify-between text-base font-medium ${
                        pathname === link.href || pathname.startsWith(`${link.href}/`)
                          ? 'text-primary'
                          : 'text-gray-700'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isServicesMobileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isServicesMobileOpen && (
                      <div className="pl-4 mt-2 space-y-2">
                        {servicesSubmenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`block text-sm py-2 ${
                              pathname === subItem.href
                                ? 'text-primary font-semibold'
                                : 'text-gray-600'
                            }`}
                            onClick={() => {
                              setIsOpen(false);
                              setIsServicesMobileOpen(false);
                            }}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block text-base font-medium ${
                    pathname === link.href
                      ? 'text-primary'
                      : 'text-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <Link
                href={getLocalizedPath('en')}
                className={`text-sm ${locale === 'en' ? 'text-primary font-semibold' : 'text-gray-600'}`}
                onClick={() => setIsOpen(false)}
              >
                EN
              </Link>
              <Link
                href={getLocalizedPath('nl')}
                className={`text-sm ${locale === 'nl' ? 'text-primary font-semibold' : 'text-gray-600'}`}
                onClick={() => setIsOpen(false)}
              >
                NL
              </Link>
            </div>
            <Link
              href={`/${locale}/quote`}
              className="block bg-primary text-black px-6 py-3 rounded-lg font-semibold text-center mb-2"
              onClick={() => setIsOpen(false)}
            >
              {t('quote')}
            </Link>
            <Link
              href={`/${locale}/client-panel`}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold text-center"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="w-4 h-4" />
              {t('clientPanel')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

