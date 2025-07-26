document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        statusDiv.className = 'form-status';
        statusDiv.style.display = 'none';

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers));

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.log('Response was not JSON:', responseText);
                throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}`);
            }

            console.log('Parsed result:', result);

            if (response.ok && result.success) {
                statusDiv.className = 'form-status success';
                statusDiv.textContent = 'Thank you for your message! We\'ll get back to you soon.';
                form.reset();
            } else {
                throw new Error(result.message || `HTTP ${response.status}: Failed to send message`);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            statusDiv.className = 'form-status error';
            statusDiv.textContent = 'Sorry, there was an error sending your message. Please try again. Error: ' + error.message;
        }

        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    });
});