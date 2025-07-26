export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        // Handle contact form API
        if (url.pathname === '/api/contact' && request.method === 'POST') {
            return handleContactForm(request, env);
        }
        
        // Handle all other requests as static assets
        return env.ASSETS.fetch(request);
    }
};

async function handleContactForm(request, env) {
    try {
        console.log('Contact form endpoint hit');
        const data = await request.json();
        const { name, email, subject, message } = data;

        console.log('Form data received:', { name, email, subject });

        // Basic validation
        if (!name || !email || !subject || !message) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Missing required fields'
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid email format'
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // For now, let's test without email and just log the data
        console.log('Contact form data:', { name, email, subject, message });
        
        // Check if email binding exists
        if (!env.CONTACT_EMAIL) {
            console.error('CONTACT_EMAIL binding not found');
            // Return success for now to test the form, but log that email wasn't sent
            console.log('Email would have been sent to shubxam@gmail.com:', {
                from: name,
                email: email,
                subject: subject,
                message: message
            });
            
            return new Response(JSON.stringify({
                success: true,
                message: 'Form submitted successfully (email service not configured yet)'
            }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            // Import EmailMessage
            const { EmailMessage } = await import("cloudflare:email");

            // Create email content with proper MIME structure
            const emailBody = `From: ${name} <${email}>
To: shubxam@gmail.com
Subject: [Contact Form] ${subject}
Content-Type: text/plain; charset=utf-8

New contact form submission from Looms & Bunkars website:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from Looms & Bunkars Contact Form`;

            console.log('Creating email message');
            
            // Create and send email
            const emailMessage = new EmailMessage(
                `contact@${new URL(request.url).hostname}`,
                "shubxam@gmail.com",
                emailBody
            );

            console.log('Sending email...');
            await env.CONTACT_EMAIL.send(emailMessage);
            console.log('Email sent successfully');
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Still return success but note the email failure
            return new Response(JSON.stringify({
                success: true,
                message: 'Form submitted successfully (email delivery failed)'
            }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ 
            success: true, 
            message: 'Message sent successfully' 
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            message: 'Internal server error: ' + error.message 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}