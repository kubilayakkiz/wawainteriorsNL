'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/types/database';

export default function BlogPostPage() {
  const params = useParams();
  const locale = useLocale();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        const postId = params.id as string;

        // Try to load from Supabase first
        const { data, error: supabaseError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .eq('locale', locale)
          .eq('published', true)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          setPost({
            ...data,
            date: data.date || data.created_at,
          });
        } else {
          // Fallback to localStorage
          const storedPosts = localStorage.getItem('blogPosts');
          if (storedPosts) {
            const allPosts = JSON.parse(storedPosts);
            const foundPost = allPosts.find((p: BlogPost) => 
              p.id === postId && p.locale === locale
            );
            setPost(foundPost || null);
          }
        }
      } catch (err: any) {
        console.error('Error loading blog post:', err);
        // Fallback to localStorage on error
        const storedPosts = localStorage.getItem('blogPosts');
        if (storedPosts) {
          const allPosts = JSON.parse(storedPosts);
          const postId = params.id as string;
          const foundPost = allPosts.find((p: BlogPost) => 
            p.id === postId && p.locale === locale
          );
          setPost(foundPost || null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [params.id, locale]);

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

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link href={`/${locale}/blog`} className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image || 'https://placehold.co/1200x600/000000/bfca02?text=Blog+Post'}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4" />
          {new Date(post.date).toLocaleDateString()}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}

