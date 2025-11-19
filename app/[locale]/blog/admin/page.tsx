'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, LogOut, Save, X } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  locale: string;
}

const ADMIN_PASSWORD = 'admin123'; // In production, use proper authentication

export default function BlogAdminPage() {
  const t = useTranslations('blog.admin');
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    locale: 'en',
  });

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('blogAdminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadPosts();
    }
  }, []);

  const loadPosts = () => {
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('blogAdminAuth', 'true');
      loadPosts();
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('blogAdminAuth');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BlogPost = {
      id: editingPost?.id || Date.now().toString(),
      ...formData,
      date: editingPost?.date || new Date().toISOString(),
    };

    const existingPosts = localStorage.getItem('blogPosts')
      ? JSON.parse(localStorage.getItem('blogPosts')!)
      : [];

    let updatedPosts;
    if (editingPost) {
      updatedPosts = existingPosts.map((p: BlogPost) =>
        p.id === editingPost.id ? newPost : p
      );
    } else {
      updatedPosts = [...existingPosts, newPost];
    }

    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    loadPosts();
    resetForm();
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      category: post.category,
      locale: post.locale,
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const existingPosts = localStorage.getItem('blogPosts')
        ? JSON.parse(localStorage.getItem('blogPosts')!)
        : [];
      const updatedPosts = existingPosts.filter((p: BlogPost) => p.id !== id);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      loadPosts();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      category: '',
      locale: 'en',
    });
    setEditingPost(null);
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">{t('login')}</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors"
            >
              {t('loginButton')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentLocale = typeof window !== 'undefined' 
    ? window.location.pathname.split('/')[1] || 'en'
    : 'en';
  const localePosts = posts.filter((p) => p.locale === currentLocale);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-black-light transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {isEditing ? t('editPost') : t('addPost')}
            </h2>
            {isEditing && (
              <button
                onClick={resetForm}
                className="flex items-center gap-2 text-gray-600 hover:text-black"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold mb-2">
                  {t('titleLabel')} *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold mb-2">
                  {t('categoryLabel')}
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-semibold mb-2">
                {t('excerptLabel')} *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                required
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-semibold mb-2">
                {t('contentLabel')} *
              </label>
              <textarea
                id="content"
                name="content"
                rows={8}
                required
                value={formData.content}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="You can use HTML tags for formatting"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="image" className="block text-sm font-semibold mb-2">
                  {t('imageLabel')}
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://via.placeholder.com/800x600"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="locale" className="block text-sm font-semibold mb-2">
                  Language
                </label>
                <select
                  id="locale"
                  name="locale"
                  value={formData.locale}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="nl">Dutch</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors"
            >
              <Save className="w-4 h-4" />
              {t('save')}
            </button>
          </form>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Posts ({localePosts.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {localePosts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No posts yet. Create your first post above!
              </div>
            ) : (
              localePosts.map((post) => (
                <div key={post.id} className="p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-2">{post.excerpt}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString()} • {post.category || 'Uncategorized'}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





