'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function QuotePage() {
  const t = useTranslations('quote');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    projectArea: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [wantsToRegister, setWantsToRegister] = useState(false);
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');

  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB in bytes
  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/postscript', // .ai
    'image/vnd.adobe.photoshop', // .psd
  ];

  const ALLOWED_FILE_EXTENSIONS = [
    '.pdf',
    '.xlsx',
    '.xls',
    '.docx',
    '.doc',
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.ai',
    '.psd',
  ];

  const projectTypeOptions = [
    { value: 'residential', label: 'Residential Design & Execution' },
    { value: 'office', label: 'Office Design & Execution' },
    { value: 'cafe', label: 'Cafe & Restaurant Design & Execution' },
    { value: 'clinic', label: 'Clinic & Healthcare Design & Execution' },
    { value: 'retail', label: 'Retail Store Design & Execution' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File size exceeds 15 MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB.`);
        e.target.value = ''; // Clear the input
        setSelectedFile(null);
        return;
      }
      
      // Check file type by extension
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
      const isValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
      
      // Also check MIME type
      const isValidMimeType = ALLOWED_FILE_TYPES.includes(file.type);
      
      if (!isValidExtension && !isValidMimeType) {
        setFileError(`File type not allowed. Please upload only: PDF, Excel, Word, JPG, PNG, WebP, AI, or PSD files.`);
        e.target.value = ''; // Clear the input
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let customerId: string | null = null;

      // Only create customer record if user wants to register (checkbox checked)
      if (wantsToRegister) {
        // Check if customer already exists
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('email', formData.email)
          .maybeSingle();

        customerId = existingCustomer?.id || null;
        if (!password || password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        if (!address) {
          throw new Error('Address is required for registration');
        }

        if (!existingCustomer) {
          // Create auth user
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: password,
            options: {
              data: {
                name: formData.name,
                phone: formData.phone,
                company: formData.company,
              },
            },
          });

          if (authError) {
            // If user already exists, try to continue with existing customer
            if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
              // User might already have an account, just create customer record without auth ID
              const { data: newCustomer, error: customerError } = await supabase
                .from('customers')
                .insert({
                  email: formData.email,
                  name: formData.name,
                  phone: formData.phone || null,
                  company: formData.company || null,
                  address: address || formData.location || null,
                })
                .select('id')
                .maybeSingle();

              if (customerError) {
                console.error('Error creating customer:', customerError);
              } else if (newCustomer) {
                customerId = newCustomer.id;
              }
            } else {
              throw new Error(`Failed to create account: ${authError.message}`);
            }
          } else if (authData.user) {
            // Create customer record with auth user ID
            const { data: newCustomer, error: customerError } = await supabase
              .from('customers')
              .insert({
                id: authData.user.id,
                email: formData.email,
                name: formData.name,
                phone: formData.phone || null,
                company: formData.company || null,
                address: address || formData.location || null,
              })
              .select('id')
              .maybeSingle();

            if (customerError) {
              console.error('Error creating customer:', customerError);
              // Continue even if customer creation fails
            } else if (newCustomer) {
              customerId = newCustomer.id;
            }
          }
        } else {
          // Customer already exists - try to create auth account and link it
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: password,
            options: {
              data: {
                name: formData.name,
                phone: formData.phone,
                company: formData.company,
              },
            },
          });

          if (authError && !authError.message.includes('already registered') && !authError.message.includes('already exists')) {
            console.error('Error creating auth account:', authError);
            // Continue with quote creation even if auth fails
          } else if (authData?.user) {
            // Update customer record with auth user ID
            await supabase
              .from('customers')
              .update({
                id: authData.user.id,
                address: address || formData.location || null,
              })
              .eq('email', formData.email);
          }
        }
      }
      // If wantsToRegister is false, don't create customer record
      // customerId will remain null and quote will be saved without customer_id

      // Prepare project description
      const projectDescription = [
        formData.projectType && `Project Type: ${projectTypeOptions.find(opt => opt.value === formData.projectType)?.label || formData.projectType}`,
        formData.location && `Location: ${formData.location}`,
        formData.projectArea && `Project Area: ${formData.projectArea} m²`,
        formData.budget && `Budget: ${formData.budget}`,
        formData.message && `\nDetailed Info & Requests:\n${formData.message}`,
      ].filter(Boolean).join('\n\n');

      // Prepare file data and upload to Supabase Storage first
      let fileDataBase64: string | null = null;
      let fileMimeType: string | null = null;
      let attachmentUrl: string | null = null;

      if (selectedFile) {
        try {
          // Read file as base64 for email
          const reader = new FileReader();
          fileDataBase64 = await new Promise((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(selectedFile);
          });
          fileMimeType = selectedFile.type;

          // Upload to Supabase Storage
          console.log('=== UPLOADING FILE TO SUPABASE STORAGE ===');
          const timestamp = Date.now();
          const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const storageFileName = `quotes/${timestamp}_${sanitizedFileName}`;

          console.log('Storage file name:', storageFileName);
          console.log('File name:', selectedFile.name);
          console.log('File size:', selectedFile.size, 'bytes');
          console.log('File type:', fileMimeType);

          // Convert file to ArrayBuffer for Supabase
          const arrayBuffer = await selectedFile.arrayBuffer();
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('quote-attachments')
            .upload(storageFileName, arrayBuffer, {
              contentType: fileMimeType || 'application/octet-stream',
              upsert: false,
            });

          if (uploadError) {
            console.error('❌ Error uploading file to Supabase:', uploadError);
            console.error('Upload error details:', {
              message: uploadError.message,
              error: uploadError.error || uploadError
            });
            // Don't throw - continue without attachment
          } else if (uploadData) {
            console.log('✅ File uploaded successfully:', uploadData);
            console.log('Upload data path:', uploadData.path);
            
            // Get public URL - bucket is now public, so getPublicUrl should work
            console.log('Getting public URL for path:', uploadData.path);
            
            const urlData = supabase.storage
              .from('quote-attachments')
              .getPublicUrl(uploadData.path);
            
            console.log('getPublicUrl response:', urlData);
            
            if (urlData && urlData.publicUrl) {
              attachmentUrl = urlData.publicUrl;
              console.log('✅ Public URL obtained from getPublicUrl:', attachmentUrl);
            } else {
              // Fallback: construct URL manually
              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
              if (supabaseUrl && uploadData.path) {
                attachmentUrl = `${supabaseUrl}/storage/v1/object/public/quote-attachments/${uploadData.path}`;
                console.log('✅ Constructed public URL manually (fallback):', attachmentUrl);
              } else {
                console.error('❌ Failed to get public URL');
                console.error('Supabase URL:', supabaseUrl);
                console.error('Upload path:', uploadData.path);
                console.error('URL data:', urlData);
              }
            }
          } else {
            console.error('❌ Upload succeeded but no data returned');
          }
        } catch (fileError) {
          console.error('❌ Error processing file:', fileError);
          console.error('File error stack:', fileError instanceof Error ? fileError.stack : 'No stack trace');
          // Continue without attachment if file processing fails
        }
      }

      // Create quote in database with attachment URL
      // Ensure attachment_urls is always an array (PostgreSQL TEXT[] format)
      const attachmentUrlsArray = attachmentUrl ? [attachmentUrl] : [];
      
      console.log('=== CREATING QUOTE IN DATABASE ===');
      console.log('Attachment URL:', attachmentUrl);
      console.log('Attachment URL is null/empty?', !attachmentUrl);
      console.log('Attachment URLs Array:', attachmentUrlsArray);
      console.log('Attachment URLs Array length:', attachmentUrlsArray.length);
      
      if (!attachmentUrl && selectedFile) {
        console.warn('⚠️ WARNING: File was selected but attachmentUrl is null/empty!');
        console.warn('This means the file upload or URL generation failed.');
      }
      
      const insertData = {
        customer_id: customerId,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone || null,
        project_type: formData.projectType || 'Not specified',
        project_description: projectDescription,
        budget: formData.budget || null,
        location: formData.location || null,
        status: 'pending',
        attachment_urls: attachmentUrlsArray,
      };
      
      console.log('Insert data (attachment_urls):', insertData.attachment_urls);
      
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert(insertData)
        .select('*') // Select all fields to verify attachment_urls was saved correctly
        .maybeSingle();
      
      if (quoteData) {
        console.log('=== QUOTE CREATED SUCCESSFULLY ===');
        console.log('Saved quote ID:', quoteData.id);
        console.log('Saved attachment_urls:', quoteData.attachment_urls);
        console.log('Attachment URLs type:', typeof quoteData.attachment_urls);
        console.log('Is array?', Array.isArray(quoteData.attachment_urls));
        console.log('Array length:', Array.isArray(quoteData.attachment_urls) ? quoteData.attachment_urls.length : 'N/A');
        
        if (!quoteData.attachment_urls || (Array.isArray(quoteData.attachment_urls) && quoteData.attachment_urls.length === 0)) {
          console.error('❌ ERROR: attachment_urls is empty in saved quote!');
          console.error('Expected:', attachmentUrlsArray);
          console.error('Got:', quoteData.attachment_urls);
        }
      }

      if (quoteError) {
        console.error('=== QUOTE INSERT ERROR ===');
        console.error('Error:', quoteError);
        console.error('Error code:', quoteError.code);
        console.error('Error message:', quoteError.message);
        console.error('Error details:', quoteError.details);
        console.error('Error hint:', quoteError.hint);
        
        // Provide more helpful error message for RLS errors
        if (quoteError.code === '42501' || quoteError.message?.includes('row-level security')) {
          throw new Error('Permission denied. Please contact support if this error persists.');
        }
        
        throw quoteError;
      }

      // Send email notification
      console.log('=== ATTEMPTING TO SEND EMAIL ===');
      try {
        const emailResponse = await fetch('/api/send-quote-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            location: formData.location,
            projectArea: formData.projectArea,
            projectType: formData.projectType,
            budget: formData.budget,
            message: formData.message,
            fileName: selectedFile?.name || null,
            fileData: fileDataBase64,
            fileMimeType: fileMimeType,
          }),
        });

        const emailResult = await emailResponse.json();
        
        if (!emailResponse.ok) {
          console.error('=== EMAIL SENDING FAILED ===');
          console.error('Status:', emailResponse.status);
          console.error('Response:', emailResult);
          // Log detailed error for debugging
          if (emailResult.details) {
            console.error('Email error details:', emailResult.details);
          }
          if (emailResult.stack) {
            console.error('Error stack:', emailResult.stack);
          }
          // Don't throw - email failure shouldn't block form submission
        } else {
          console.log('=== EMAIL SENT SUCCESSFULLY ===');
          console.log('Response:', emailResult);
          // Attachment URL already saved in quote record above
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't throw - email failure shouldn't block form submission
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          location: '',
          projectArea: '',
          projectType: '',
          budget: '',
          message: '',
        });
        setSelectedFile(null);
        setWantsToRegister(false);
        setPassword('');
        setAddress('');
      }, 5000);
    } catch (err: any) {
      console.error('Error submitting quote:', err);
      setError(err.message || 'Failed to submit quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section with Header Image */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/header.webp"
            alt="Get Quote"
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
              {t('title')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-primary mt-4">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
              <p className="text-lg text-gray-600">{t('success')}</p>
            </div>
          ) : (
            <>
              <div className="mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {t('form.title') || 'Request a Quote'}
                </h2>
                <p className="text-base md:text-lg text-gray-600">
                  {t('form.subtitle') || 'Fill out the form below and we\'ll get back to you as soon as possible.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name, Email, Phone - Side by Side (3 columns) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
                      Full Name <span className="text-gray-500">(required)</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                      Email <span className="text-gray-500">(required)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm text-gray-700 mb-2">
                      Phone <span className="text-gray-500">(required)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                    />
                  </div>
                </div>

                {/* Company Name, Location, Project Area - Side by Side (3 columns) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm text-gray-700 mb-2">
                      Company Name <span className="text-gray-500">(required)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm text-gray-700 mb-2">
                      Location <span className="text-gray-500">(required)</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectArea" className="block text-sm text-gray-700 mb-2">
                      Project Area (m²) <span className="text-gray-500">(required)</span>
                    </label>
                    <input
                      type="text"
                      id="projectArea"
                      name="projectArea"
                      required
                      value={formData.projectArea}
                      onChange={handleChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                    />
                  </div>
                </div>

                {/* Budget and Project Type - Side by Side (2 columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Budget - Range Select */}
                  <div>
                    <label htmlFor="budget" className="block text-sm text-gray-700 mb-2">
                      Budget <span className="text-gray-500">(required)</span>
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      required
                      value={formData.budget}
                      onChange={handleSelectChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                    >
                      <option value="">Select Budget Range</option>
                      <option value="under-10k">Under €10,000</option>
                      <option value="10k-25k">€10,000 - €25,000</option>
                      <option value="25k-50k">€25,000 - €50,000</option>
                      <option value="50k-100k">€50,000 - €100,000</option>
                      <option value="100k-250k">€100,000 - €250,000</option>
                      <option value="250k-500k">€250,000 - €500,000</option>
                      <option value="over-500k">Over €500,000</option>
                    </select>
                  </div>

                  {/* Project Type - Dropdown */}
                  <div>
                    <label htmlFor="projectType" className="block text-sm text-gray-700 mb-2">
                      Project Type <span className="text-gray-500">(required)</span>
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      value={formData.projectType}
                      onChange={handleSelectChange}
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                    >
                      <option value="">Select Project Type</option>
                      {projectTypeOptions.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Detailed Info & Requests */}
                <div>
                  <label htmlFor="message" className="block text-sm text-gray-700 mb-2">
                    Detailed Info & Requests <span className="text-gray-500">(required)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label htmlFor="file" className="block text-sm text-gray-700 mb-2">
                    Attach File (Optional)
                    <span className="text-gray-500 text-xs ml-2">Max 15 MB - PDF, Excel, Word, JPG, PNG, WebP, AI, PSD</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="file"
                        className="bg-gray-100 text-gray-900 px-6 py-3 rounded-md font-semibold text-sm cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        Choose File
                      </label>
                      <input
                        type="file"
                        id="file"
                        accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.webp,.ai,.psd"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <span className="text-sm text-gray-500">
                        {selectedFile ? selectedFile.name : 'No file chosen'}
                      </span>
                    </div>
                    {fileError && (
                      <div className="text-sm text-red-600 mt-1">
                        {fileError}
                      </div>
                    )}
                    {selectedFile && (
                      <div className="text-xs text-gray-500">
                        File size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    )}
                  </div>
                </div>

                {/* Register for Client Panel */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantsToRegister}
                      onChange={(e) => setWantsToRegister(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      {t('form.registerCheckbox')}
                    </span>
                  </label>

                  {wantsToRegister && (
                    <div className="mt-4 space-y-4 pl-7">
                      <div>
                        <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                          {t('form.password')} <span className="text-gray-500">(required)</span>
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          required={wantsToRegister}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                          placeholder="Minimum 6 characters"
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm text-gray-700 mb-2">
                          {t('form.address')} <span className="text-gray-500">(required)</span>
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          required={wantsToRegister}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-0 py-3 border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white px-8 py-3 rounded-md font-semibold text-sm md:text-base hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                    {!isSubmitting && <Send className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
