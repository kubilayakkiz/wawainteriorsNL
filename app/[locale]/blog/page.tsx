'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/types/database';

export default function BlogPage() {
  const t = useTranslations('blog');
  const locale = useLocale();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to load from Supabase first
        const { data, error: supabaseError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('locale', locale)
          .eq('published', true)
          .order('date', { ascending: false });

        if (supabaseError) {
          throw supabaseError;
        }

        if (data && data.length > 0) {
          // Map database format to component format
          const formattedPosts = data.map((post) => ({
            ...post,
            // Ensure date is in correct format
            date: post.date || post.created_at,
          }));
          setPosts(formattedPosts);
        } else {
          // Fallback to localStorage if Supabase is empty
          const storedPosts = localStorage.getItem('blogPosts');
          if (storedPosts) {
            const allPosts = JSON.parse(storedPosts);
            const localePosts = allPosts.filter((post: BlogPost) => post.locale === locale);
            setPosts(localePosts.sort((a: BlogPost, b: BlogPost) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
          }
        }
      } catch (err: any) {
        console.error('Error loading blog posts:', err);
        setError(err.message || 'Failed to load blog posts');
        
        // Fallback to localStorage on error
        const storedPosts = localStorage.getItem('blogPosts');
        if (storedPosts) {
          const allPosts = JSON.parse(storedPosts);
          const localePosts = allPosts.filter((post: BlogPost) => post.locale === locale);
          setPosts(localePosts.sort((a: BlogPost, b: BlogPost) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ));
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [locale]);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section with Header Image */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/header.webp"
            alt="Blog"
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
              {t('subtitle')}
            </h1>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <p className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-2">BLOG</p>
          </div>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg md:text-xl text-gray-600">{t('noPosts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48 sm:h-56 md:h-64">
                    <Image
                      src={post.image || 'https://placehold.co/800x600/000000/bfca02?text=Blog+Post'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3">{post.title}</h2>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-3">{post.excerpt}</p>
                    <Link
                      href={`/${locale}/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-sm md:text-base text-primary font-semibold hover:gap-3 transition-all"
                    >
                      {t('readMore')}
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

