import { json, type RequestEvent } from '@sveltejs/kit';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJty4VJr_xzkNYd78ACq3P2OPwz6uNwgignnkXEq-o2upbFJ2rosOyUXbwLGO1xCKkoA/exec';

// Helper function to hash a password with a random salt
async function hashPassword(password: string, existingSalt?: string) {
  const salt = existingSalt || crypto.randomUUID();
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return { hash: hashHex, salt };
}

export async function GET() {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    return json(data);
  } catch {
    return json({ users: [], bookings: [] });
  }
}

export async function POST({ request }: RequestEvent) {
  const body = await request.json();

  try {
    // If it's a registration request, hash the password before sending it to the Google Sheet
    if (body.type === 'register') {
      const { hash, salt } = await hashPassword(body.password);
      body.password = `${hash}:${salt}`; // Store as hash:salt in the database
    }

    // If it's a login request, we send the raw password and let the Google Sheet / verification handle it, 
    // OR if your Google Apps Script handles verification, it can split by ':' and re-hash.
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    });

    const result = await res.json();
    return json(result);
  } catch {
    return json({ success: false, message: 'Failed to communicate with external database spreadsheet.' }, { status: 500 });
  }
}