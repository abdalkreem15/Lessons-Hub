import { env } from '$env/dynamic/private';

// 1. GET FUNCTION FOR FETCHING DATA
export async function GET() {
  const GOOGLE_SCRIPT_URL = env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    return new Response(JSON.stringify({ success: false, message: 'Server configuration error: Missing GOOGLE_SCRIPT_URL.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
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


// 2. POST FUNCTION FOR LOGIN/REGISTER/BOOKING
export async function POST({ request }) {
  const GOOGLE_SCRIPT_URL = env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    return new Response(JSON.stringify({ success: false, message: 'Server configuration error: Missing GOOGLE_SCRIPT_URL.' }), {
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
