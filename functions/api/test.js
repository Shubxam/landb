export async function onRequestGet() {
    return new Response(JSON.stringify({ 
        message: "Test endpoint working",
        timestamp: new Date().toISOString()
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function onRequestPost() {
    return new Response(JSON.stringify({ 
        message: "POST endpoint working",
        timestamp: new Date().toISOString()
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}