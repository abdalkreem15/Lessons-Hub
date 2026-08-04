export async function GET() {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyY7ivyJYKlrR_s0r17lJP52qbkKSCcXSilkuvdVuBtgosp7cKEVSEQi8JS_DpUImFufg/exec';

  if (!GOOGLE_SCRIPT_URL) {
    return new Response(JSON.stringify({ success: false, message: 'Missing API URL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    
    // ✅ SAFETY CHECK: Ensure Google returned JSON, not HTML
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error("Google returned HTML instead of JSON:", text.substring(0, 200));
      return new Response(JSON.stringify({ success: false, message: 'Google Script Error: Returned HTML instead of JSON. Check your Script Deployment settings.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


export async function POST({ request }) {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyY7ivyJYKlrR_s0r17lJP52qbkKSCcXSilkuvdVuBtgosp7cKEVSEQi8JS_DpUImFufg/exec';

  if (!GOOGLE_SCRIPT_URL) {
    return new Response(JSON.stringify({ success: false, message: 'Missing API URL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', 
      },
      body: JSON.stringify(body)
    });

    // ✅ SAFETY CHECK: Ensure Google returned JSON, not HTML
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error("Google POST returned HTML:", text.substring(0, 200));
      return new Response(JSON.stringify({ success: false, message: 'Google Script Error: Returned HTML. Is your Web App set to "Anyone"?' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
