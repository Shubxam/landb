export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        console.log('Contact form endpoint hit');
        const data = await request.json();
        const { name, email, subject, message } = data;

        console.log('Form data received:', { name, email, subject });

        // Basic validation
        if (!name || !email || !subject || !message) {
            return new Response('Missing required fields', { status: 400 });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response('Invalid email format', { status: 400 });
        }

        // Check if email binding exists
        if (!env.CONTACT_EMAIL) {
            console.error('CONTACT_EMAIL binding not found');
            return new Response('Email service not configured', { status: 500 });
        }

        // Import EmailMessage dynamically to avoid import issues
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
            `contact@${new URL(request.url).hostname}`, // Use the actual domain
            "shubxam@gmail.com",
            emailBody
        );

        console.log('Sending email...');
        await env.CONTACT_EMAIL.send(emailMessage);
        console.log('Email sent successfully');

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