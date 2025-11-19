import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log('=== EMAIL API ROUTE CALLED ===');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    const body = await request.json();
    console.log('Request body received:', {
      name: body.name,
      email: body.email,
      hasMessage: !!body.message,
    });
    const {
      name,
      email,
      phone,
      company,
      location,
      projectArea,
      projectType,
      budget,
      message,
      fileName,
      fileData, // Base64 encoded file data
      fileMimeType, // MIME type of the file
    } = body;

    // SMTP Configuration
    const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    const smtpUser = process.env.SMTP_USER || 'info@wawainteriors.nl';
    
    // Get password and clean it
    let smtpPassword = process.env.SMTP_PASSWORD || '';
    
    // Remove quotes from password if present (handle both single and double quotes)
    if (smtpPassword.startsWith('"') && smtpPassword.endsWith('"')) {
      smtpPassword = smtpPassword.slice(1, -1);
    }
    if (smtpPassword.startsWith("'") && smtpPassword.endsWith("'")) {
      smtpPassword = smtpPassword.slice(1, -1);
    }
    
    // Trim whitespace
    smtpPassword = smtpPassword.trim();

    console.log('=== SMTP CONFIGURATION ===');
    console.log('Host:', smtpHost);
    console.log('Port:', smtpPort);
    console.log('User:', smtpUser);
    console.log('Password set:', !!smtpPassword);
    console.log('Password length:', smtpPassword.length);
    console.log('Password first 3 chars:', smtpPassword.substring(0, 3));
    console.log('Password last 3 chars:', smtpPassword.substring(smtpPassword.length - 3));
    console.log('Password contains $:', smtpPassword.includes('$'));

    if (!smtpPassword) {
      console.error('SMTP_PASSWORD is not set in environment variables');
      return NextResponse.json(
        { success: false, error: 'SMTP configuration is missing' },
        { status: 500 }
      );
    }

    // Port 465 uses SSL/TLS (secure: true), Port 587 uses STARTTLS (secure: false)
    const isSecure = smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isSecure, // true for 465, false for 587 (STARTTLS)
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      debug: true, // Enable debug output
      logger: true, // Enable logging
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      },
      // For port 587, require STARTTLS
      requireTLS: !isSecure,
      // Additional options for Hostinger
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify SMTP connection
    try {
      console.log('=== VERIFYING SMTP CONNECTION ===');
      await transporter.verify();
      console.log('✓ SMTP connection verified successfully');
    } catch (verifyError: any) {
      console.error('✗ SMTP verification failed');
      console.error('Error code:', verifyError.code);
      console.error('Error command:', verifyError.command);
      console.error('Error response:', verifyError.response);
      console.error('Error responseCode:', verifyError.responseCode);
      console.error('Full error:', verifyError);
      
      // More detailed error message
      let errorMessage = verifyError.message || verifyError.toString();
      if (verifyError.response) {
        errorMessage += ` (Response: ${verifyError.response})`;
      }
      if (verifyError.code) {
        errorMessage += ` (Code: ${verifyError.code})`;
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'SMTP connection failed',
          details: errorMessage,
          code: verifyError.code,
          response: verifyError.response
        },
        { status: 500 }
      );
    }

    // Email recipients
    const recipients = [
      'info@wawainteriors.nl',
      'info@kubilayakkiz.com',
    ];

    // Map project type values to labels
    const projectTypeLabels: { [key: string]: string } = {
      'residential': 'Residential Design & Execution',
      'office': 'Office Design & Execution',
      'cafe': 'Cafe & Restaurant Design & Execution',
      'clinic': 'Clinic & Healthcare Design & Execution',
      'retail': 'Retail Store Design & Execution',
    };

    // Format project type
    const projectTypeText = projectType 
      ? (projectTypeLabels[projectType] || projectType)
      : 'Not specified';

    // Email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: #bfca02; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #000; }
            .value { margin-top: 5px; color: #333; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Quote Request</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Full Name:</div>
                <div class="value">${name || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${phone || 'Not provided'}</div>
              </div>
              ${company ? `
              <div class="field">
                <div class="label">Company Name:</div>
                <div class="value">${company}</div>
              </div>
              ` : ''}
              ${location ? `
              <div class="field">
                <div class="label">Location:</div>
                <div class="value">${location}</div>
              </div>
              ` : ''}
              ${projectArea ? `
              <div class="field">
                <div class="label">Project Area (m²):</div>
                <div class="value">${projectArea}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Project Type:</div>
                <div class="value">${projectTypeText}</div>
              </div>
              ${budget ? `
              <div class="field">
                <div class="label">Budget:</div>
                <div class="value">${budget}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Detailed Info & Requests:</div>
                <div class="value" style="white-space: pre-wrap;">${message || 'Not provided'}</div>
              </div>
              ${fileName ? `
              <div class="field">
                <div class="label">Attached File:</div>
                <div class="value">${fileName}</div>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>This quote request was submitted from the WAWA Interiors website.</p>
              <p>Submitted at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
New Quote Request

Full Name: ${name || 'Not provided'}
Email: ${email || 'Not provided'}
Phone: ${phone || 'Not provided'}
${company ? `Company Name: ${company}\n` : ''}
${location ? `Location: ${location}\n` : ''}
${projectArea ? `Project Area (m²): ${projectArea}\n` : ''}
Project Type: ${projectTypeText}
${budget ? `Budget: ${budget}\n` : ''}

Detailed Info & Requests:
${message || 'Not provided'}

${fileName ? `Attached File: ${fileName}\n` : ''}

Submitted at: ${new Date().toLocaleString()}
    `;

    // Upload file to Supabase Storage if provided
    let attachmentUrl: string | null = null;
    let attachmentBuffer: Buffer | null = null;

    if (fileData && fileName) {
      try {
        console.log('=== UPLOADING FILE TO SUPABASE STORAGE ===');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
          console.error('Supabase credentials not found');
        } else {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          
          // Convert base64 to buffer
          const base64Data = fileData.replace(/^data:.*,/, '');
          attachmentBuffer = Buffer.from(base64Data, 'base64');
          
          // Generate unique filename
          const timestamp = Date.now();
          const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
          const storageFileName = `quotes/${timestamp}_${sanitizedFileName}`;
          
          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('quote-attachments')
            .upload(storageFileName, attachmentBuffer, {
              contentType: fileMimeType || 'application/octet-stream',
              upsert: false,
            });

          if (uploadError) {
            console.error('Error uploading file to Supabase:', uploadError);
          } else {
            // Get public URL
            const { data: urlData } = supabase.storage
              .from('quote-attachments')
              .getPublicUrl(storageFileName);
            
            attachmentUrl = urlData.publicUrl;
            console.log('File uploaded successfully:', attachmentUrl);
          }
        }
      } catch (uploadError: any) {
        console.error('Error in file upload process:', uploadError);
        // Continue without attachment if upload fails
      }
    }

    // Prepare email attachments
    const emailAttachments: any[] = [];
    if (attachmentBuffer && fileName) {
      emailAttachments.push({
        filename: fileName,
        content: attachmentBuffer,
        contentType: fileMimeType || 'application/octet-stream',
      });
    }

    // Send email to all recipients
    const emailResults = [];
    for (const recipient of recipients) {
      try {
        console.log(`Attempting to send email to: ${recipient}`);
        const info = await transporter.sendMail({
          from: `"WAWA Interiors" <${smtpUser}>`,
          to: recipient,
          subject: `New Quote Request from ${name || email}`,
          text: emailText,
          html: emailHtml,
          attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
        });
        console.log(`Email sent successfully to ${recipient}:`, info.messageId);
        emailResults.push({ recipient, success: true, messageId: info.messageId });
      } catch (emailError: any) {
        console.error(`Failed to send email to ${recipient}:`, emailError);
        emailResults.push({ recipient, success: false, error: emailError.message });
      }
    }

    // Check if at least one email was sent successfully
    const successCount = emailResults.filter(r => r.success).length;
    if (successCount === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send email to all recipients',
          details: emailResults 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Email sent successfully to ${successCount} recipient(s)`,
        results: emailResults,
        attachmentUrl: attachmentUrl || null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('=== ERROR IN EMAIL API ROUTE ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Error stack:', error?.stack);
    console.error('Full error:', error);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Failed to send email',
        errorType: error?.constructor?.name,
        errorCode: error?.code,
        details: error?.toString(),
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

