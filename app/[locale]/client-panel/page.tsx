'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogIn, LogOut, FileText, Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Mail, Phone, Building, ExternalLink } from 'lucide-react';
import type { Quote, Job, Customer } from '@/types/database';

export default function ClientPanelPage() {
  const locale = useLocale();
  const router = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    address: '',
  });
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        await loadCustomerData(session.user.email!);
      }
    } catch (err: any) {
      console.error('Auth check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomerData = async (userEmail: string) => {
    try {
      console.log('Loading customer data for:', userEmail);
      
      // Load customer info
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();

      if (customerError && customerError.code !== 'PGRST116') {
        console.error('Customer error:', customerError);
        // Don't throw, just log - customer might not exist yet
      }

      if (customerData) {
        console.log('Customer found:', customerData);
        setCustomer(customerData);
      }

      // Always load quotes by email (regardless of customer record)
      // This ensures quotes from quote page are visible
      console.log('Loading quotes for email:', userEmail);
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .eq('customer_email', userEmail)
        .order('created_at', { ascending: false });

      if (quotesError) {
        console.error('Quotes error:', quotesError);
        console.error('Error details:', {
          message: quotesError.message,
          code: quotesError.code,
          details: quotesError.details,
        });
      } else {
        console.log('Quotes loaded:', quotesData?.length || 0, 'quotes');
        console.log('Quotes data:', quotesData);
        setQuotes(quotesData || []);
      }

      // Also try to load quotes by customer_id if customer exists
      if (customerData?.id) {
        const { data: quotesByCustomerId, error: quotesByIdError } = await supabase
          .from('quotes')
          .select('*')
          .eq('customer_id', customerData.id)
          .order('created_at', { ascending: false });

        if (!quotesByIdError && quotesByCustomerId) {
          // Merge quotes, avoiding duplicates
          const allQuotes = [...(quotesData || []), ...quotesByCustomerId];
          const uniqueQuotes = Array.from(
            new Map(allQuotes.map(q => [q.id, q])).values()
          );
          setQuotes(uniqueQuotes);
        }

        // Load jobs only if customer exists
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('customer_id', customerData.id)
          .order('created_at', { ascending: false });

        if (jobsError) {
          console.error('Jobs error:', jobsError);
        } else {
          console.log('Jobs loaded:', jobsData?.length || 0, 'jobs');
          setJobs(jobsData || []);
        }
      }
    } catch (err: any) {
      console.error('Error loading customer data:', err);
      setError(err.message || 'Failed to load data');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        setIsAuthenticated(true);
        await loadCustomerData(data.user.email!);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      setError('Please fill in all required fields (Name, Email, Password).');
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!signUpData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      console.log('Attempting signup with email:', signUpData.email);
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signUpData.email.trim(),
        password: signUpData.password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/${locale}/client-panel` : undefined,
          data: {
            role: 'customer',
            name: signUpData.name,
          },
        },
      });

      console.log('Signup response:', { data, error: signUpError });

      if (signUpError) {
        console.error('Signup error details:', {
          message: signUpError.message,
          status: signUpError.status,
          name: signUpError.name,
        });

        // Better error handling for common Supabase errors
        if (signUpError.message.includes('anonymous') || signUpError.message.includes('Anonymous')) {
          setError('Email signup is not properly configured. Please check Supabase settings or contact support.');
        } else if (signUpError.message.includes('email') || signUpError.message.includes('Email')) {
          setError('Invalid email address or email already registered.');
        } else if (signUpError.message.includes('password') || signUpError.message.includes('Password')) {
          setError('Password is too weak. Please use a stronger password (minimum 6 characters).');
        } else if (signUpError.message.includes('rate limit')) {
          setError('Too many signup attempts. Please try again later.');
        } else {
          setError(signUpError.message || 'Failed to create account. Please try again.');
        }
        return;
      }

      if (data.user) {
        // Create customer record with all information
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            email: signUpData.email.trim(),
            name: signUpData.name.trim(),
            phone: signUpData.phone.trim() || null,
            company: signUpData.company.trim() || null,
            address: signUpData.address.trim() || null,
            user_id: data.user.id,
          });

        if (customerError) {
          console.error('Error creating customer:', customerError);
          // Don't throw - customer record might already exist
        }

        // Check if email confirmation is required
        if (data.session) {
          // Email confirmation not required, user is logged in
          setIsAuthenticated(true);
          await loadCustomerData(data.user.email!);
          setError(null);
          // Reset form
          setSignUpData({
            name: '',
            email: '',
            password: '',
            phone: '',
            company: '',
            address: '',
          });
          setIsSignUp(false);
        } else {
          // Email confirmation required or email sending failed
          // Show success message and switch to login
          setError(null);
          
          // Reset form and switch to login
          const userEmail = signUpData.email;
          setSignUpData({
            name: '',
            email: '',
            password: '',
            phone: '',
            company: '',
            address: '',
          });
          setIsSignUp(false);
          
          // Pre-fill email for login
          setEmail(userEmail);
          
          // Show success message (non-blocking)
          setSuccess('✅ Account created successfully! If email confirmation is enabled, check your email. Otherwise, try logging in with your credentials.');
          
          // Auto-clear success message after 8 seconds
          setTimeout(() => {
            setSuccess(null);
          }, 8000);
        }
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up. Please try again or contact support.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCustomer(null);
    setQuotes([]);
    setJobs([]);
    setEmail('');
    setPassword('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
      case 'reviewed':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
      case 'planning':
        return 'text-yellow-600 bg-yellow-50';
      case 'on_hold':
        return 'text-orange-600 bg-orange-50';
      case 'rejected':
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Client Portal</h1>
            <p className="text-gray-600">
              {isSignUp ? 'Create your account' : 'Sign in to view your projects and quotes'}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
                setSuccess(null);
                setSignUpData({
                  name: '',
                  email: '',
                  password: '',
                  phone: '',
                  company: '',
                  address: '',
                });
              }}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                !isSignUp
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
                setSuccess(null);
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                isSignUp
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Login Form */}
          {!isSignUp && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Sign In
              </button>
            </form>
          )}

          {/* Signup Form */}
          {isSignUp && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="signup-name"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="signup-email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  id="signup-password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
              <div>
                <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="signup-phone"
                  value={signUpData.phone}
                  onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="signup-company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="signup-company"
                  value={signUpData.company}
                  onChange={(e) => setSignUpData({ ...signUpData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="signup-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="signup-address"
                  value={signUpData.address}
                  onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {customer?.name || email}</h1>
              <div className="space-y-1 text-gray-600">
                {customer?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer?.company && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{customer.company}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{quotes.length}</p>
                <p className="text-sm text-gray-600">Total Quotes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {jobs.filter(j => j.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quotes Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Quotes ({quotes.length})
          </h2>
          {quotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No quotes yet.</p>
              <p className="text-sm text-gray-400">
                Submit a quote request from the <a href={`/${locale}/quote`} className="text-primary hover:underline">Get Quote</a> page.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{quote.project_type}</h3>
                      <p className="text-sm text-gray-600">{quote.location || 'Location not specified'}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        quote.status
                      )}`}
                    >
                      {getStatusIcon(quote.status)}
                      {quote.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Project Description */}
                  {quote.project_description && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Your Request:</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.project_description}</p>
                    </div>
                  )}

                  {/* Our Proposal */}
                  {quote.proposal_description && (
                    <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Our Proposal:</p>
                      <p className="text-sm text-blue-900 whitespace-pre-wrap">{quote.proposal_description}</p>
                    </div>
                  )}

                  {/* Quote Amount */}
                  {quote.quote_amount && (
                    <div className="mb-3 p-3 bg-green-50 rounded border border-green-200">
                      <p className="text-xs font-semibold text-green-900 mb-1">Quote Amount:</p>
                      <p className="text-lg font-bold text-green-700">
                        €{quote.quote_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}

                  {/* Requested Budget vs Quote */}
                  {quote.budget && (
                    <div className="mb-3 text-sm">
                      <span className="text-gray-600">Your Budget: </span>
                      <span className="font-medium">{quote.budget}</span>
                      {quote.quote_amount && (
                        <span className="text-gray-500 text-xs ml-2">
                          (Our Quote: €{quote.quote_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Proposed Timeline */}
                  {quote.proposed_timeline && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Proposed Timeline: </span>
                        <span className="font-medium">{quote.proposed_timeline}</span>
                      </div>
                    </div>
                  )}

                  {/* Proposal Document */}
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

                  {/* Attachments */}
                  {quote.attachment_urls && quote.attachment_urls.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
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
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs hover:bg-blue-100 transition-colors border border-blue-200"
                              title={url}
                            >
                              <FileText className="w-3 h-3" />
                              <span className="max-w-[150px] truncate">{fileName}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Customer Visible Notes */}
                  {quote.customer_visible_notes && (
                    <div className="mb-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-xs font-semibold text-yellow-900 mb-1">Note from WAWA Interiors:</p>
                      <p className="text-sm text-yellow-900">{quote.customer_visible_notes}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200 mt-3">
                    <span>Created: {new Date(quote.created_at).toLocaleDateString()}</span>
                    {quote.updated_at !== quote.created_at && (
                      <span>Updated: {new Date(quote.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Jobs Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Active Projects
          </h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No active projects yet.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      {job.description && (
                        <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {getStatusIcon(job.status)}
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
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
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
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
                  </div>

                  {/* Customer Visible Notes */}
                  {job.customer_visible_notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-900">{job.customer_visible_notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

