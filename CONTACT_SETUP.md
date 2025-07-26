# Contact Form Setup Guide

## Overview
The contact form has been implemented using Cloudflare Workers and Email Routing. Here's what was added:

## Files Created/Modified

### 1. Frontend Changes
- **`public/index.html`**: Added contact form section
- **`public/styles/styles.css`**: Added form styling and status messages
- **`public/scripts/contact.js`**: JavaScript for form submission handling

### 2. Backend Changes
- **`functions/api/contact.js`**: Cloudflare Worker function to process form submissions
- **`wrangler.toml`**: Added email binding configuration

## Email Routing Setup Required

Before the contact form will work, you need to complete the Email Routing setup in your Cloudflare dashboard:

### Step 1: Enable Email Routing
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain
3. Go to **Email** > **Email Routing**
4. Click **Enable Email Routing**
5. Follow the setup wizard to add DNS records

### Step 2: Verify Destination Address
1. In Email Routing settings, verify that `shubxam@gmail.com` is added and verified as a destination address
2. If not, add it and complete the verification process

### Step 3: Domain Configuration
Make sure your domain (`loomsandbunkars.com`) is properly configured with:
- MX records pointing to Cloudflare's email servers
- SPF record including Cloudflare's email routing

## How It Works

1. **User submits form** → Frontend JavaScript sends POST request to `/api/contact`
2. **Cloudflare Worker processes** → Validates data and creates email messages
3. **Two emails sent**:
   - Contact details sent to `shubxam@gmail.com`
   - Auto-reply confirmation sent to the user
4. **Status feedback** → User sees success/error message

## Features Implemented

- ✅ Form validation (client and server-side)
- ✅ Email notification to site owner
- ✅ Auto-reply to user
- ✅ Loading states and status messages
- ✅ Responsive design matching site theme
- ✅ Spam protection via Cloudflare

## Testing

To test the contact form:
1. Deploy the changes: `npm run deploy`
2. Fill out the form on your website
3. Check that you receive the email at `shubxam@gmail.com`
4. Verify the user receives an auto-reply

## Configuration

The email binding is configured in `wrangler.toml`:
```toml
[[send_email]]
name = "CONTACT_EMAIL"
destination_address = "shubxam@gmail.com"
```

This restricts the Worker to only send emails to the specified address for security.