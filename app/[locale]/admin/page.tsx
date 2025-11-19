'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, LogOut, Save, X, FileText, Briefcase, Users, CheckCircle, XCircle, Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { supabase, createServerClient } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import type { BlogPost as SupabaseBlogPost, Project as SupabaseProject, Quote, Job, Customer } from '@/types/database';

// Admin client with service role key (bypasses RLS)
const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  // Try both NEXT_PUBLIC and regular env variable names
  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  console.log('🔍 Checking admin client configuration...');
  console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Service Role Key:', serviceRoleKey ? `✅ Set (${serviceRoleKey.substring(0, 20)}...)` : '❌ Missing');
  
  if (serviceRoleKey) {
    console.log('✅ Using service role key for admin operations (RLS bypassed)');
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    // Test connection
    adminClient.from('customers').select('count', { count: 'exact', head: true })
      .then(({ error }) => {
        if (error) {
          console.error('❌ Admin client connection error:', error);
        } else {
          console.log('✅ Admin client connection successful');
        }
      });
    
    return adminClient;
  }
  
  console.warn('⚠️ Service role key not found. Admin operations may fail due to RLS policies.');
  console.warn('Please add NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY to .env.local');
  console.warn('Get your service_role key from: Supabase Dashboard > Settings > API > service_role (secret)');
  // Fallback to regular client if service role key is not available
  return supabase;
};

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

interface Project {
  id: string;
  slug: string;
  title: string;
  titleKey: string;
  description: string;
  descriptionKey: string;
  category: string;
  year: string;
  location: string;
  client: string;
  heroImage: string;
  galleryImages: string[];
  locale: string;
}

const ADMIN_PASSWORD = 'admin123'; // In production, use proper authentication

export default function AdminPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'blog' | 'project' | 'customers'>('blog');
  
  // Blog states
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    locale: locale,
  });

  // Project states
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    slug: '',
    title: '',
    titleKey: '',
    description: '',
    descriptionKey: '',
    category: '',
    year: '',
    location: '',
    client: '',
    heroImage: '',
    galleryImages: '',
    locale: locale,
  });

  // Customers states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    quote_id: '',
    customer_id: '',
    title: '',
    description: '',
    status: 'planning' as Job['status'],
    start_date: '',
    estimated_end_date: '',
    progress_percentage: 0,
    customer_visible_notes: '',
    admin_notes: '',
  });

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadBlogPosts();
      loadProjects();
      loadCustomers();
      loadQuotes();
      loadJobs();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'customers') {
      loadCustomers();
      loadQuotes();
      loadJobs();
    }
  }, [isAuthenticated, activeTab]);

  const loadBlogPosts = async () => {
    try {
      // Try to load from Supabase first
      const adminClient = getAdminClient();
      const { data, error } = await adminClient
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map database format to component format
        const formattedPosts = data.map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          image: post.image,
          category: post.category,
          date: post.date || post.created_at,
          locale: post.locale,
        }));
        setBlogPosts(formattedPosts);
      } else {
        // Fallback to localStorage
        const storedPosts = localStorage.getItem('blogPosts');
        if (storedPosts) {
          setBlogPosts(JSON.parse(storedPosts));
        }
      }
    } catch (err: any) {
      console.error('Error loading blog posts:', err);
      // Fallback to localStorage on error
      const storedPosts = localStorage.getItem('blogPosts');
      if (storedPosts) {
        setBlogPosts(JSON.parse(storedPosts));
      }
    }
  };

  const loadProjects = async () => {
    try {
      // Try to load from Supabase first
      const adminClient = getAdminClient();
      const { data, error } = await adminClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map database format to component format
        const formattedProjects = data.map((proj) => ({
          id: proj.id,
          slug: proj.slug,
          title: proj.title,
          titleKey: proj.title_key || '',
          description: proj.description,
          descriptionKey: proj.description_key || '',
          category: proj.category,
          year: proj.year,
          location: proj.location,
          client: proj.client,
          heroImage: proj.hero_image,
          galleryImages: proj.gallery_images || [],
          locale: proj.locale,
        }));
        setProjects(formattedProjects);
      } else {
        // Fallback to localStorage
        const storedProjects = localStorage.getItem('adminProjects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        }
      }
    } catch (err: any) {
      console.error('Error loading projects:', err);
      // Fallback to localStorage on error
      const storedProjects = localStorage.getItem('adminProjects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      loadBlogPosts();
      loadProjects();
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  // Blog handlers
  const handleBlogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBlogFormData({
      ...blogFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = {
        title: blogFormData.title,
        excerpt: blogFormData.excerpt,
        content: blogFormData.content,
        image: blogFormData.image,
        category: blogFormData.category,
        locale: blogFormData.locale,
        date: editingBlogPost?.date || new Date().toISOString().split('T')[0],
        published: true,
      };

      const adminClient = getAdminClient();
      if (editingBlogPost) {
        // Update existing post
        const { error } = await adminClient
          .from('blog_posts')
          .update(postData)
          .eq('id', editingBlogPost.id);

        if (error) throw error;
      } else {
        // Create new post
        const { error } = await adminClient
          .from('blog_posts')
          .insert(postData);

        if (error) throw error;
      }

      await loadBlogPosts();
      resetBlogForm();
    } catch (err: any) {
      console.error('Error saving blog post:', err);
      alert('Failed to save blog post. Error: ' + err.message);
    }
  };

  const handleBlogEdit = (post: BlogPost) => {
    setEditingBlogPost(post);
    setBlogFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      category: post.category,
      locale: post.locale,
    });
    setIsEditingBlog(true);
  };

  const handleBlogDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const adminClient = getAdminClient();
        const { error } = await adminClient
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await loadBlogPosts();
      } catch (err: any) {
        console.error('Error deleting blog post:', err);
        alert('Failed to delete blog post. Error: ' + err.message);
      }
    }
  };

  const resetBlogForm = () => {
    setBlogFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      category: '',
      locale: locale,
    });
    setEditingBlogPost(null);
    setIsEditingBlog(false);
  };

  // Project handlers
  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProjectFormData({
      ...projectFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const galleryArray = projectFormData.galleryImages
        .split(',')
        .map(img => img.trim())
        .filter(img => img.length > 0);

      const projectData = {
        slug: projectFormData.slug,
        title: projectFormData.title,
        title_key: projectFormData.titleKey || null,
        description: projectFormData.description,
        description_key: projectFormData.descriptionKey || null,
        category: projectFormData.category,
        year: projectFormData.year,
        location: projectFormData.location,
        client: projectFormData.client,
        hero_image: projectFormData.heroImage,
        gallery_images: galleryArray,
        locale: projectFormData.locale,
        published: true,
      };

      const adminClient = getAdminClient();
      if (editingProject) {
        // Update existing project
        const { error } = await adminClient
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
      } else {
        // Create new project
        const { error } = await adminClient
          .from('projects')
          .insert(projectData);

        if (error) throw error;
      }

      await loadProjects();
      resetProjectForm();
    } catch (err: any) {
      console.error('Error saving project:', err);
      alert('Failed to save project. Error: ' + err.message);
    }
  };

  const handleProjectEdit = (project: Project) => {
    setEditingProject(project);
    setProjectFormData({
      slug: project.slug,
      title: project.title,
      titleKey: project.titleKey,
      description: project.description,
      descriptionKey: project.descriptionKey,
      category: project.category,
      year: project.year,
      location: project.location,
      client: project.client,
      heroImage: project.heroImage,
      galleryImages: project.galleryImages.join(', '),
      locale: project.locale,
    });
    setIsEditingProject(true);
  };

  const handleProjectDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const adminClient = getAdminClient();
        const { error } = await adminClient
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await loadProjects();
      } catch (err: any) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project. Error: ' + err.message);
      }
    }
  };

  const resetProjectForm = () => {
    setProjectFormData({
      slug: '',
      title: '',
      titleKey: '',
      description: '',
      descriptionKey: '',
      category: '',
      year: '',
      location: '',
      client: '',
      heroImage: '',
      galleryImages: '',
      locale: locale,
    });
    setEditingProject(null);
    setIsEditingProject(false);
  };

  // Customer management functions
  const loadCustomers = async () => {
    try {
      console.log('Loading customers...');
      const adminClient = getAdminClient();
      
      // First, let's check if we can access the table at all
      const { data, error, count } = await adminClient
        .from('customers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error loading customers:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        
        // If it's a permission error, suggest checking RLS policies
        if (error.message.includes('permission') || error.message.includes('denied')) {
          throw new Error('Permission denied. Please run the SQL script in supabase-policy-fix.sql in your Supabase SQL Editor to fix RLS policies.');
        }
        
        throw error;
      }
      
      console.log('✅ Customers loaded successfully:', data?.length || 0, 'customers');
      console.log('Customers data:', data);
      setCustomers(data || []);
      
      if (!data || data.length === 0) {
        console.warn('⚠️ No customers found in database. Customers will be created automatically when quotes are submitted.');
      }
    } catch (err: any) {
      console.error('❌ Error loading customers:', err);
      alert('Failed to load customers: ' + err.message + '\n\nCheck console for more details.');
    }
  };

  const loadQuotes = async () => {
    try {
      console.log('🔍 Loading quotes...');
      const adminClient = getAdminClient();
      const { data, error } = await adminClient
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading quotes:', error);
        alert('Failed to load quotes: ' + error.message);
        throw error;
      }
      
      console.log('✅ Quotes loaded:', data?.length || 0, 'quotes');
      console.log('Quotes data:', data);
      
      // Ensure new fields have default values if they don't exist
      const formattedQuotes = (data || []).map((quote: any) => {
        // Handle attachment_urls - PostgreSQL TEXT[] can come in different formats
        let attachmentUrls: string[] = [];
        
        // Check if attachment_urls exists and is not null/undefined
        if (quote.attachment_urls != null && quote.attachment_urls !== '') {
          // Case 1: Already an array (most common)
          if (Array.isArray(quote.attachment_urls)) {
            attachmentUrls = quote.attachment_urls
              .filter((url: any) => url != null && url !== '' && typeof url === 'string' && url.length > 0)
              .map((url: string) => url.trim());
          } 
          // Case 2: JSON string that needs parsing
          else if (typeof quote.attachment_urls === 'string') {
            try {
              // Try parsing as JSON first
              const parsed = JSON.parse(quote.attachment_urls);
              if (Array.isArray(parsed)) {
                attachmentUrls = parsed
                  .filter((url: any) => url != null && url !== '' && typeof url === 'string' && url.length > 0)
                  .map((url: string) => url.trim());
              } else if (typeof parsed === 'string' && parsed.length > 0) {
                // Single URL as string
                attachmentUrls = [parsed.trim()];
              }
            } catch (e) {
              // Not JSON, try comma-separated or single URL
              const trimmed = quote.attachment_urls.trim();
              if (trimmed.includes(',')) {
                attachmentUrls = trimmed.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
              } else if (trimmed.length > 0 && (trimmed.startsWith('http://') || trimmed.startsWith('https://'))) {
                // Single URL
                attachmentUrls = [trimmed];
              }
            }
          }
        }
        
        console.log(`Quote ${quote.id} - attachment_urls DEBUG:`, {
          original: quote.attachment_urls,
          originalType: typeof quote.attachment_urls,
          isArray: Array.isArray(quote.attachment_urls),
          isNull: quote.attachment_urls == null,
          isEmpty: quote.attachment_urls === '',
          parsed: attachmentUrls,
          count: attachmentUrls.length,
          urls: attachmentUrls
        });
        
        return {
          ...quote,
          proposal_document_url: quote.proposal_document_url || null,
          quote_amount: quote.quote_amount || null,
          attachment_urls: attachmentUrls,
          customer_visible_notes: quote.customer_visible_notes || null,
          proposal_description: quote.proposal_description || null,
          proposed_timeline: quote.proposed_timeline || null,
        };
      });
      
      setQuotes(formattedQuotes);
      
      // NOTE: We do NOT automatically create customer records from quotes
      // Customers are only created when they explicitly check the "Register for Client Panel" checkbox
      // in the quote form. This ensures only users who want client panel access are registered.
    } catch (err: any) {
      console.error('❌ Error loading quotes:', err);
      alert('Failed to load quotes: ' + (err.message || 'Unknown error'));
    }
  };

  const loadJobs = async () => {
    try {
      const adminClient = getAdminClient();
      const { data, error } = await adminClient
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err: any) {
      console.error('Error loading jobs:', err);
    }
  };

  // Quote editing states
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    status: 'pending' as Quote['status'],
    admin_notes: '',
    proposal_document_url: '',
    quote_amount: '',
    attachment_urls: '',
    customer_visible_notes: '',
    proposal_description: '',
    proposed_timeline: '',
  });

  const handleQuoteStatusUpdate = async (quoteId: string, newStatus: Quote['status'], adminNotes?: string) => {
    try {
      const adminClient = getAdminClient();
      const updateData: any = { status: newStatus };
      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      const { error } = await adminClient
        .from('quotes')
        .update(updateData)
        .eq('id', quoteId);

      if (error) throw error;
      await loadQuotes();
    } catch (err: any) {
      console.error('Error updating quote:', err);
      alert('Failed to update quote: ' + err.message);
    }
  };

  const handleQuoteEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setQuoteFormData({
      status: quote.status,
      admin_notes: quote.admin_notes || '',
      proposal_document_url: quote.proposal_document_url || '',
      quote_amount: quote.quote_amount?.toString() || '',
      attachment_urls: quote.attachment_urls?.join(', ') || '',
      customer_visible_notes: quote.customer_visible_notes || '',
      proposal_description: quote.proposal_description || '',
      proposed_timeline: quote.proposed_timeline || '',
    });
    setIsEditingQuote(true);
  };

  const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setQuoteFormData({
      ...quoteFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuote) return;

    try {
      const adminClient = getAdminClient();
      const attachmentArray = quoteFormData.attachment_urls
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const updateData = {
        status: quoteFormData.status,
        admin_notes: quoteFormData.admin_notes || null,
        proposal_document_url: quoteFormData.proposal_document_url || null,
        quote_amount: quoteFormData.quote_amount ? parseFloat(quoteFormData.quote_amount) : null,
        attachment_urls: attachmentArray,
        customer_visible_notes: quoteFormData.customer_visible_notes || null,
        proposal_description: quoteFormData.proposal_description || null,
        proposed_timeline: quoteFormData.proposed_timeline || null,
      };

      const { error } = await adminClient
        .from('quotes')
        .update(updateData)
        .eq('id', editingQuote.id);

      if (error) throw error;

      await loadQuotes();
      resetQuoteForm();
    } catch (err: any) {
      console.error('Error updating quote:', err);
      alert('Failed to update quote: ' + err.message);
    }
  };

  const resetQuoteForm = () => {
    setQuoteFormData({
      status: 'pending',
      admin_notes: '',
      proposal_document_url: '',
      quote_amount: '',
      attachment_urls: '',
      customer_visible_notes: '',
      proposal_description: '',
      proposed_timeline: '',
    });
    setEditingQuote(null);
    setIsEditingQuote(false);
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobFormData({
      ...jobFormData,
      [name]: name === 'progress_percentage' ? parseInt(value) || 0 : value,
    });
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const adminClient = getAdminClient();
      const jobData = {
        quote_id: jobFormData.quote_id,
        customer_id: jobFormData.customer_id,
        title: jobFormData.title,
        description: jobFormData.description || null,
        status: jobFormData.status,
        start_date: jobFormData.start_date || null,
        estimated_end_date: jobFormData.estimated_end_date || null,
        progress_percentage: jobFormData.progress_percentage,
        customer_visible_notes: jobFormData.customer_visible_notes || null,
        admin_notes: jobFormData.admin_notes || null,
      };

      if (editingJob) {
        const { error } = await adminClient
          .from('jobs')
          .update(jobData)
          .eq('id', editingJob.id);

        if (error) throw error;
      } else {
        const { error } = await adminClient
          .from('jobs')
          .insert(jobData);

        if (error) throw error;
      }

      await loadJobs();
      resetJobForm();
    } catch (err: any) {
      console.error('Error saving job:', err);
      alert('Failed to save job: ' + err.message);
    }
  };

  const handleJobEdit = (job: Job) => {
    setEditingJob(job);
    setJobFormData({
      quote_id: job.quote_id,
      customer_id: job.customer_id,
      title: job.title,
      description: job.description || '',
      status: job.status,
      start_date: job.start_date ? job.start_date.split('T')[0] : '',
      estimated_end_date: job.estimated_end_date ? job.estimated_end_date.split('T')[0] : '',
      progress_percentage: job.progress_percentage,
      customer_visible_notes: job.customer_visible_notes || '',
      admin_notes: job.admin_notes || '',
    });
    setIsEditingJob(true);
  };

  const handleJobDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        const adminClient = getAdminClient();
        const { error } = await adminClient
          .from('jobs')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await loadJobs();
      } catch (err: any) {
        console.error('Error deleting job:', err);
        alert('Failed to delete job: ' + err.message);
      }
    }
  };

  const handleCreateJobFromQuote = (quote: Quote) => {
    const customer = customers.find(c => c.id === quote.customer_id || c.email === quote.customer_email);
    if (customer) {
      setSelectedCustomer(customer);
      setJobFormData({
        ...jobFormData,
        quote_id: quote.id,
        customer_id: customer.id,
        title: `${quote.project_type} - ${customer.name}`,
      });
      setIsEditingJob(false);
      setActiveTab('customers');
      // Scroll to job form
      setTimeout(() => {
        document.getElementById('job-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const resetJobForm = () => {
    setJobFormData({
      quote_id: '',
      customer_id: selectedCustomer?.id || '',
      title: '',
      description: '',
      status: 'planning',
      start_date: '',
      estimated_end_date: '',
      progress_percentage: 0,
      customer_visible_notes: '',
      admin_notes: '',
    });
    setEditingJob(null);
    setIsEditingJob(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Password
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
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentLocalePosts = blogPosts.filter((p) => p.locale === locale);
  const currentLocaleProjects = projects.filter((p) => p.locale === locale);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'blog'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            Blog Posts ({currentLocalePosts.length})
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'project'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Projects ({currentLocaleProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'customers'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5" />
            Customers & Jobs ({customers.length})
          </button>
        </div>

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <>
            {/* Add/Edit Blog Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {isEditingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
                </h2>
                {isEditingBlog && (
                  <button
                    onClick={resetBlogForm}
                    className="flex items-center gap-2 text-gray-600 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="blog-title" className="block text-sm font-semibold mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="blog-title"
                      name="title"
                      required
                      value={blogFormData.title}
                      onChange={handleBlogChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="blog-category" className="block text-sm font-semibold mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      id="blog-category"
                      name="category"
                      value={blogFormData.category}
                      onChange={handleBlogChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="blog-excerpt" className="block text-sm font-semibold mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    id="blog-excerpt"
                    name="excerpt"
                    rows={2}
                    required
                    value={blogFormData.excerpt}
                    onChange={handleBlogChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="blog-content" className="block text-sm font-semibold mb-2">
                    Content *
                  </label>
                  <textarea
                    id="blog-content"
                    name="content"
                    rows={8}
                    required
                    value={blogFormData.content}
                    onChange={handleBlogChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="You can use HTML tags for formatting"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="blog-image" className="block text-sm font-semibold mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="blog-image"
                      name="image"
                      value={blogFormData.image}
                      onChange={handleBlogChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="blog-locale" className="block text-sm font-semibold mb-2">
                      Language *
                    </label>
                    <select
                      id="blog-locale"
                      name="locale"
                      value={blogFormData.locale}
                      onChange={handleBlogChange}
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
                  {isEditingBlog ? 'Update' : 'Save'} Blog Post
                </button>
              </form>
            </div>

            {/* Blog Posts List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold">Blog Posts ({currentLocalePosts.length})</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {currentLocalePosts.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No blog posts yet. Create your first post above!
                  </div>
                ) : (
                  currentLocalePosts.map((post) => (
                    <div key={post.id} className="p-6 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-2">{post.excerpt}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(post.date).toLocaleDateString()} • {post.category || 'Uncategorized'} • {post.locale.toUpperCase()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleBlogEdit(post)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleBlogDelete(post.id)}
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
          </>
        )}

        {/* Project Tab */}
        {activeTab === 'project' && (
          <>
            {/* Add/Edit Project Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {isEditingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                {isEditingProject && (
                  <button
                    onClick={resetProjectForm}
                    className="flex items-center gap-2 text-gray-600 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="project-slug" className="block text-sm font-semibold mb-2">
                      Slug (URL) *
                    </label>
                    <input
                      type="text"
                      id="project-slug"
                      name="slug"
                      required
                      value={projectFormData.slug}
                      onChange={handleProjectChange}
                      placeholder="my-project-name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="project-category" className="block text-sm font-semibold mb-2">
                      Category *
                    </label>
                    <select
                      id="project-category"
                      name="category"
                      required
                      value={projectFormData.category}
                      onChange={handleProjectChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Category</option>
                      <option value="residential">Residential</option>
                      <option value="office">Office</option>
                      <option value="cafe">Cafe & Restaurant</option>
                      <option value="clinic">Clinic</option>
                      <option value="retail">Retail</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="project-title" className="block text-sm font-semibold mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="project-title"
                      name="title"
                      required
                      value={projectFormData.title}
                      onChange={handleProjectChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="project-titleKey" className="block text-sm font-semibold mb-2">
                      Translation Key (optional)
                    </label>
                    <input
                      type="text"
                      id="project-titleKey"
                      name="titleKey"
                      value={projectFormData.titleKey}
                      onChange={handleProjectChange}
                      placeholder="projects.myProject.title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="project-description" className="block text-sm font-semibold mb-2">
                    Description *
                  </label>
                  <textarea
                    id="project-description"
                    name="description"
                    rows={4}
                    required
                    value={projectFormData.description}
                    onChange={handleProjectChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="project-descriptionKey" className="block text-sm font-semibold mb-2">
                    Description Translation Key (optional)
                  </label>
                  <input
                    type="text"
                    id="project-descriptionKey"
                    name="descriptionKey"
                    value={projectFormData.descriptionKey}
                    onChange={handleProjectChange}
                    placeholder="projects.myProject.description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="project-year" className="block text-sm font-semibold mb-2">
                      Year *
                    </label>
                    <input
                      type="text"
                      id="project-year"
                      name="year"
                      required
                      value={projectFormData.year}
                      onChange={handleProjectChange}
                      placeholder="2024"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="project-location" className="block text-sm font-semibold mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="project-location"
                      name="location"
                      required
                      value={projectFormData.location}
                      onChange={handleProjectChange}
                      placeholder="Istanbul, Turkey"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="project-client" className="block text-sm font-semibold mb-2">
                      Client *
                    </label>
                    <input
                      type="text"
                      id="project-client"
                      name="client"
                      required
                      value={projectFormData.client}
                      onChange={handleProjectChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="project-heroImage" className="block text-sm font-semibold mb-2">
                      Hero Image URL *
                    </label>
                    <input
                      type="url"
                      id="project-heroImage"
                      name="heroImage"
                      required
                      value={projectFormData.heroImage}
                      onChange={handleProjectChange}
                      placeholder="/images/projects/..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="project-locale" className="block text-sm font-semibold mb-2">
                      Language *
                    </label>
                    <select
                      id="project-locale"
                      name="locale"
                      required
                      value={projectFormData.locale}
                      onChange={handleProjectChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="en">English</option>
                      <option value="nl">Dutch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="project-galleryImages" className="block text-sm font-semibold mb-2">
                    Gallery Images (comma-separated URLs)
                  </label>
                  <textarea
                    id="project-galleryImages"
                    name="galleryImages"
                    rows={3}
                    value={projectFormData.galleryImages}
                    onChange={handleProjectChange}
                    placeholder="/images/projects/...1.jpg, /images/projects/...2.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isEditingProject ? 'Update' : 'Save'} Project
                </button>
              </form>
            </div>

            {/* Projects List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold">Projects ({currentLocaleProjects.length})</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {currentLocaleProjects.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No projects yet. Create your first project above!
                  </div>
                ) : (
                  currentLocaleProjects.map((project) => (
                    <div key={project.id} className="p-6 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                        <p className="text-sm text-gray-500">
                          {project.year} • {project.location} • {project.category} • {project.locale.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Slug: {project.slug}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleProjectEdit(project)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleProjectDelete(project.id)}
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
          </>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{customers.length}</p>
                    <p className="text-sm text-gray-600">Total Customers</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{quotes.length}</p>
                    <p className="text-sm text-gray-600">Total Quotes</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{jobs.length}</p>
                    <p className="text-sm text-gray-600">Active Jobs</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{quotes.filter(q => q.status === 'pending').length}</p>
                    <p className="text-sm text-gray-600">Pending Quotes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Form */}
            <div id="job-form" className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {isEditingJob ? 'Edit Job' : 'Create New Job'}
                </h2>
                {isEditingJob && (
                  <button
                    onClick={resetJobForm}
                    className="flex items-center gap-2 text-gray-600 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="job-customer" className="block text-sm font-semibold mb-2">
                      Customer *
                    </label>
                    <select
                      id="job-customer"
                      name="customer_id"
                      required
                      value={jobFormData.customer_id}
                      onChange={handleJobChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Customer {customers.length > 0 ? `(${customers.length} available)` : '(Loading...)'}</option>
                      {customers.length === 0 ? (
                        <option disabled>No customers found. Create a quote first.</option>
                      ) : (
                        customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name || customer.email} ({customer.email})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="job-quote" className="block text-sm font-semibold mb-2">
                      Related Quote (Optional)
                    </label>
                    <select
                      id="job-quote"
                      name="quote_id"
                      value={jobFormData.quote_id}
                      onChange={handleJobChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">No Quote</option>
                      {quotes
                        .filter(q => !jobFormData.customer_id || q.customer_id === jobFormData.customer_id || q.customer_email === customers.find(c => c.id === jobFormData.customer_id)?.email)
                        .map((quote) => (
                          <option key={quote.id} value={quote.id}>
                            {quote.project_type} - {new Date(quote.created_at).toLocaleDateString()}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="job-title" className="block text-sm font-semibold mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="job-title"
                    name="title"
                    required
                    value={jobFormData.title}
                    onChange={handleJobChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="job-description" className="block text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    id="job-description"
                    name="description"
                    rows={3}
                    value={jobFormData.description}
                    onChange={handleJobChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="job-status" className="block text-sm font-semibold mb-2">
                      Status *
                    </label>
                    <select
                      id="job-status"
                      name="status"
                      required
                      value={jobFormData.status}
                      onChange={handleJobChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="planning">Planning</option>
                      <option value="in_progress">In Progress</option>
                      <option value="on_hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="job-start-date" className="block text-sm font-semibold mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="job-start-date"
                      name="start_date"
                      value={jobFormData.start_date}
                      onChange={handleJobChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="job-end-date" className="block text-sm font-semibold mb-2">
                      Estimated End Date
                    </label>
                    <input
                      type="date"
                      id="job-end-date"
                      name="estimated_end_date"
                      value={jobFormData.estimated_end_date}
                      onChange={handleJobChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="job-progress" className="block text-sm font-semibold mb-2">
                    Progress: {jobFormData.progress_percentage}%
                  </label>
                  <input
                    type="range"
                    id="job-progress"
                    name="progress_percentage"
                    min="0"
                    max="100"
                    value={jobFormData.progress_percentage}
                    onChange={handleJobChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="job-customer-notes" className="block text-sm font-semibold mb-2">
                    Customer Visible Notes
                  </label>
                  <textarea
                    id="job-customer-notes"
                    name="customer_visible_notes"
                    rows={3}
                    value={jobFormData.customer_visible_notes}
                    onChange={handleJobChange}
                    placeholder="These notes will be visible to the customer in their panel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="job-admin-notes" className="block text-sm font-semibold mb-2">
                    Admin Notes (Private)
                  </label>
                  <textarea
                    id="job-admin-notes"
                    name="admin_notes"
                    rows={3}
                    value={jobFormData.admin_notes}
                    onChange={handleJobChange}
                    placeholder="These notes are only visible to admins"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isEditingJob ? 'Update' : 'Create'} Job
                </button>
              </form>
            </div>

            {/* Quote Edit Modal */}
            {isEditingQuote && editingQuote && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Edit Quote: {editingQuote.project_type}</h2>
                    <button
                      onClick={resetQuoteForm}
                      className="flex items-center gap-2 text-gray-600 hover:text-black p-2 hover:bg-gray-100 rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="quote-status" className="block text-sm font-semibold mb-2">
                            Status *
                          </label>
                          <select
                            id="quote-status"
                            name="status"
                            required
                            value={quoteFormData.status}
                            onChange={handleQuoteChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="quote-amount" className="block text-sm font-semibold mb-2">
                            Quote Amount (€)
                          </label>
                          <input
                            type="number"
                            id="quote-amount"
                            name="quote_amount"
                            step="0.01"
                            value={quoteFormData.quote_amount}
                            onChange={handleQuoteChange}
                            placeholder="50000.00"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="quote-proposal-doc" className="block text-sm font-semibold mb-2">
                          Proposal Document URL
                        </label>
                        <input
                          type="url"
                          id="quote-proposal-doc"
                          name="proposal_document_url"
                          value={quoteFormData.proposal_document_url}
                          onChange={handleQuoteChange}
                          placeholder="https://example.com/proposal.pdf"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label htmlFor="quote-attachments" className="block text-sm font-semibold mb-2">
                          Attachment URLs (comma-separated)
                        </label>
                        <input
                          type="text"
                          id="quote-attachments"
                          name="attachment_urls"
                          value={quoteFormData.attachment_urls}
                          onChange={handleQuoteChange}
                          placeholder="https://example.com/file1.pdf, https://example.com/file2.jpg"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label htmlFor="quote-proposal-description" className="block text-sm font-semibold mb-2">
                          Proposal Description
                        </label>
                        <textarea
                          id="quote-proposal-description"
                          name="proposal_description"
                          rows={4}
                          value={quoteFormData.proposal_description}
                          onChange={handleQuoteChange}
                          placeholder="Detailed proposal description..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="quote-timeline" className="block text-sm font-semibold mb-2">
                          Proposed Timeline
                        </label>
                        <input
                          type="text"
                          id="quote-timeline"
                          name="proposed_timeline"
                          value={quoteFormData.proposed_timeline}
                          onChange={handleQuoteChange}
                          placeholder="e.g., 3-4 months"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label htmlFor="quote-customer-notes" className="block text-sm font-semibold mb-2">
                          Customer Visible Notes
                        </label>
                        <textarea
                          id="quote-customer-notes"
                          name="customer_visible_notes"
                          rows={3}
                          value={quoteFormData.customer_visible_notes}
                          onChange={handleQuoteChange}
                          placeholder="These notes will be visible to the customer in their panel"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="quote-admin-notes" className="block text-sm font-semibold mb-2">
                          Admin Notes (Private)
                        </label>
                        <textarea
                          id="quote-admin-notes"
                          name="admin_notes"
                          rows={3}
                          value={quoteFormData.admin_notes}
                          onChange={handleQuoteChange}
                          placeholder="Internal notes (not visible to customer)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                          type="submit"
                          className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Update Quote
                        </button>
                        <button
                          type="button"
                          onClick={resetQuoteForm}
                          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Quote List Header */}

            {/* Quotes List - Compact Table View */}
            <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold">Quotes ({quotes.length})</h2>
                <button
                  onClick={() => loadQuotes()}
                  className="px-3 py-1.5 bg-primary text-black rounded-md font-semibold hover:bg-primary-light transition-colors text-sm flex items-center gap-1"
                >
                  <TrendingUp className="w-4 h-4" />
                  Refresh
                </button>
              </div>
              {quotes.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No quotes yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Budget</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Attachments</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {quotes.map((quote) => {
                        const customer = customers.find(c => c.id === quote.customer_id || c.email === quote.customer_email);
                        return (
                          <>
                            <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="font-semibold text-sm">{quote.project_type}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm">
                                  <div className="font-medium">{customer?.name || quote.customer_name}</div>
                                  <div className="text-xs text-gray-500">{quote.customer_email}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{quote.location || '-'}</td>
                              <td className="px-4 py-3">
                                <div className="text-sm">
                                  {quote.quote_amount ? (
                                    <span className="font-semibold text-green-600">€{quote.quote_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  ) : (
                                    <span className="text-gray-500">{quote.budget || '-'}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={quote.status}
                                  onChange={(e) => handleQuoteStatusUpdate(quote.id, e.target.value as Quote['status'])}
                                  className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(quote.status)}`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="reviewed">Reviewed</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                {quote.attachment_urls && quote.attachment_urls.length > 0 ? (
                                  <div className="flex items-center gap-1">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs font-semibold text-blue-600">{quote.attachment_urls.length}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500">
                                {new Date(quote.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      if (expandedQuote === quote.id) {
                                        setExpandedQuote(null);
                                      } else {
                                        setExpandedQuote(quote.id);
                                      }
                                    }}
                                    className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
                                    title="View Details"
                                  >
                                    {expandedQuote === quote.id ? (
                                      <X className="w-4 h-4" />
                                    ) : (
                                      <FileText className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleQuoteEdit(quote)}
                                    className="p-1.5 text-primary hover:bg-primary-light rounded transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  {quote.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handleQuoteStatusUpdate(quote.id, 'approved')}
                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                        title="Approve"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleQuoteStatusUpdate(quote.id, 'rejected')}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Reject"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                  {!jobs.find(j => j.quote_id === quote.id) && quote.status === 'approved' && (
                                    <button
                                      onClick={() => handleCreateJobFromQuote(quote)}
                                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                      title="Create Job"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                            {expandedQuote === quote.id && (
                              <tr>
                                <td colSpan={8} className="px-4 py-4 bg-gray-50">
                                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="font-semibold mb-2">Project Description:</p>
                                      <p className="text-gray-700 whitespace-pre-wrap mb-4">{quote.project_description || '-'}</p>
                                      {quote.proposal_description && (
                                        <>
                                          <p className="font-semibold mb-2">Our Proposal:</p>
                                          <p className="text-gray-700 whitespace-pre-wrap mb-4">{quote.proposal_description}</p>
                                        </>
                                      )}
                                    </div>
                                    <div>
                                      {quote.proposal_document_url && (
                                        <div className="mb-3">
                                          <a
                                            href={quote.proposal_document_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold"
                                          >
                                            <FileText className="w-4 h-4" />
                                            View Proposal Document
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        </div>
                                      )}
                                      {quote.attachment_urls && quote.attachment_urls.length > 0 && (
                                        <div className="mb-3">
                                          <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Attachments ({quote.attachment_urls.length}):
                                          </p>
                                          <div className="flex flex-wrap gap-2">
                                            {quote.attachment_urls.map((url, idx) => {
                                              const fileName = url.split('/').pop() || `Attachment ${idx + 1}`;
                                              return (
                                                <a
                                                  key={idx}
                                                  href={url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition-colors border border-blue-200"
                                                  title={url}
                                                >
                                                  <FileText className="w-3 h-3" />
                                                  <span className="max-w-[200px] truncate">{fileName}</span>
                                                  <ExternalLink className="w-3 h-3" />
                                                </a>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                      {quote.customer_visible_notes && (
                                        <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                                          <p className="text-sm font-semibold mb-1">Note for Customer:</p>
                                          <p className="text-sm text-blue-900">{quote.customer_visible_notes}</p>
                                        </div>
                                      )}
                                      {quote.admin_notes && (
                                        <div className="mb-3 p-3 bg-gray-50 rounded border border-gray-200">
                                          <p className="text-sm font-semibold mb-1">Admin Notes:</p>
                                          <p className="text-sm text-gray-700">{quote.admin_notes}</p>
                                        </div>
                                      )}
                                      {quote.proposed_timeline && (
                                        <p className="text-sm text-gray-600 mb-2">
                                          <span className="font-semibold">Timeline:</span> {quote.proposed_timeline}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Jobs List */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold">Jobs ({jobs.length})</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {jobs.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No jobs yet. Create a job from an approved quote!</div>
                ) : (
                  jobs.map((job) => {
                    const customer = customers.find(c => c.id === job.customer_id);
                    return (
                      <div key={job.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">{job.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                                {job.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            {customer && <p className="text-gray-600 mb-2">{customer.name} ({customer.email})</p>}
                            {job.description && <p className="text-gray-700 mb-2">{job.description}</p>}
                            
                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{job.progress_percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${job.progress_percentage}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Dates */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                              {job.start_date && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Started: {new Date(job.start_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {job.estimated_end_date && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Est. End: {new Date(job.estimated_end_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {job.actual_end_date && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Completed: {new Date(job.actual_end_date).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>

                            {job.customer_visible_notes && (
                              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                <p className="text-sm font-semibold mb-1">Customer Notes:</p>
                                <p className="text-sm text-blue-900">{job.customer_visible_notes}</p>
                              </div>
                            )}
                            {job.admin_notes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                                <p className="text-sm font-semibold mb-1">Admin Notes:</p>
                                <p className="text-sm text-gray-700">{job.admin_notes}</p>
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">Created: {new Date(job.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleJobEdit(job)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleJobDelete(job.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


