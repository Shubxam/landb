import { EmailMessage } from "cloudflare:email";

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const data = await request.json();
        const { name, email, subject, message } = data;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return new Response('Missing required fields', { status: 400 });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response('Invalid email format', { status: 400 });
        }

        // Create email content
        const emailContent = `
New contact form submission from Looms & Bunkars website:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from Looms & Bunkars Contact Form
        `.trim();

        // Create and send email
        const emailMessage = new EmailMessage(
            "noreply@loomsandbunkars.com", // sender (your domain)
            "shubxam@gmail.com", // recipient
            emailContent
        );

        await env.CONTACT_EMAIL.send(emailMessage);

        // Send auto-reply to the user
        const autoReplyContent = `
Dear ${name},

Thank you for contacting Looms & Bunkars! We have received your message and will get back to you as soon as possible.

Your message:
Subject: ${subject}
${message}

We appreciate your interest in our handwoven Banarasi sarees and our mission to support the artisans of Banaras.

Best regards,
The Looms & Bunkars Team

---
This is an automated response. Please do not reply to this email.
        `.trim();

        const autoReply = new EmailMessage(
            "noreply@loomsandbunkars.com",
            email,
            autoReplyContent
        );

        await env.CONTACT_EMAIL.send(autoReply);

        return new Response('Message sent successfully', { status: 200 });

    } catch (error) {
        console.error('Contact form error:', error);
        return new Response('Internal server error', { status: 500 });
    }
}