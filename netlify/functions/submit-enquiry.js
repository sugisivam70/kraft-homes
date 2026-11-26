// Optional Serverless Lead Capture Endpoint (Netlify Functions v2)
// Configure optional environment secrets in Netlify Dashboard (never in React frontend):
//   LEAD_WEBHOOK_URL — CRM / Google Sheets / Zapier / Make webhook URL
//   WHATSAPP_CLOUD_TOKEN & WHATSAPP_PHONE_NUMBER_ID — Optional WhatsApp Business Platform API
//   META_CAPI_ACCESS_TOKEN & META_PIXEL_ID — Optional Meta Conversions API server event

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { name, mobile, email, location, product, budget, message, consent, attribution } = body || {};

    if (!name || !mobile || !/^\d{10}$/.test(String(mobile).trim()) || !location || !product || !consent) {
      return new Response(JSON.stringify({ error: 'Invalid or incomplete enquiry details.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const leadRecord = {
      name: String(name).trim(),
      mobile: String(mobile).trim(),
      email: email ? String(email).trim() : '',
      location: String(location).trim(),
      product: String(product).trim(),
      budget: budget ? String(budget).trim() : '',
      message: message ? String(message).trim() : '',
      attribution: attribution || {},
      receivedAt: new Date().toISOString(),
    };

    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      const hookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadRecord),
      });
      if (!hookRes.ok) {
        return new Response(JSON.stringify({ error: 'Failed to record enquiry upstream.' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ ok: true, id: crypto.randomUUID() }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Malformed JSON payload.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
