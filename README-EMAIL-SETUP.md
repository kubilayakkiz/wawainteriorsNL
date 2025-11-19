# Email Configuration Guide

## SMTP Settings for Quote Notifications

When a quote request is submitted, an email notification is automatically sent to the specified recipients.

### Environment Variables

Add these to your `.env.local` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@wawainteriors.nl
SMTP_PASSWORD=your_email_password_here
```

### Email Recipients

Emails are sent to:
- info@kubilayakkiz.com
- info@wawainteriors.nl

### Email Content

The email includes:
- Full Name
- Email Address
- Phone Number
- Company Name (if provided)
- Location (if provided)
- Project Area (if provided)
- Project Type(s) (selected checkboxes)
- Budget (if provided)
- Detailed Info & Requests
- Attached File Name (if provided)
- Submission timestamp

### Testing

1. Make sure SMTP credentials are correct in `.env.local`
2. Submit a test quote from the quote page
3. Check both recipient email inboxes
4. Check spam folder if email doesn't arrive

### Troubleshooting

**Email not sending:**
- Verify SMTP credentials are correct
- Check that port 465 is not blocked by firewall
- Ensure SMTP_USER email account exists and password is correct
- Check server logs for error messages

**Email going to spam:**
- Configure SPF/DKIM records for your domain
- Use a verified sender email address
- Avoid spam trigger words in email content

