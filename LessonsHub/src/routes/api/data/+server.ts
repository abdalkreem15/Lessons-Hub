const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxtiPy1jymnnDHflEhAepciQBTK-69WX59Ahg2rfqUAJbg1l06Kyl38tTuCyJHd99Zyw/exec';

// 1. GET FUNCTION (Optimized to request only specific data)
export async function GET({ url }) {
  try {
    // ✅ Get the ?type= parameter from the frontend (e.g., ?type=teachers,bookings)
    // If no type is provided, it defaults to 'all'
    const typeParam = url.searchParams.get('type') || 'all';
    
    // ✅ Append it to the Google Script URL
    const fetchUrl = `${GOOGLE_SCRIPT_URL}?type=${typeParam}`;

    const response = await fetch(fetchUrl, {
      redirect: 'follow' // Forces Vercel to follow Google's 302 redirects
    });
    
    // ✅ SAFETY CHECK: Ensure Google returned JSON, not an HTML error page
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error("Google GET returned HTML instead of JSON:", text.substring(0, 200));
      return new Response(JSON.stringify({ success: false, message: 'Google Script Error: Returned HTML.' }), {
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


// 2. POST FUNCTION (For Login, Register, Booking)
export async function POST({ request }) {
  try {
    const body = await request.json();
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // Required by Google Apps Script
      },
      body: JSON.stringify(body),
      redirect: 'follow' // Forces Vercel to follow Google's 302 redirects
    });

    // ✅ SAFETY CHECK: Ensure Google returned JSON
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error("Google POST returned HTML:", text.substring(0, 200));
      return new Response(JSON.stringify({ success: false, message: 'Google Script Error: Returned HTML.' }), {
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
