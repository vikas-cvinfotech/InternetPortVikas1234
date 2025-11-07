export async function POST(req) {
  try {
    const body = await req.json();
    if (!body) {
      return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
    }

    // HostBill API credentials and settings from environment variables.
    const API_ID = process.env.HOSTBILL_API_ID;
    const API_KEY = process.env.HOSTBILL_API_KEY;
    const API_URL = process.env.HOSTBILL_API_ENDPOINT;
    const API_SUPPORT_DEPARTMENT = process.env.HOSTBILL_SUPPORT_DEPARTMENT_ID;

    // Construct the transformed message body.
    let transformedBody = `
  ${body.message}
  
  Name: ${body.firstName} ${body.lastName},
  Email: ${body.email}`;

    if (body.phoneNumber) {
      transformedBody += `,
  Tel: ${body.phoneNumber}`;
    }

    const POST = {
      api_id: API_ID,
      api_key: API_KEY,
      call: 'addTicket',
      dept_id: body.dept_id || API_SUPPORT_DEPARTMENT,
      name: `${body.firstName} ${body.lastName}`,
      subject: body.subject || 'Meddelande via kontaktformulär',
      email: body.email,
      body: transformedBody,
      asclient: 1,
      notes: `Automatiskt genererat ärende från internetport.se`,
    };

    // Create URL-encoded form data.
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(POST)) {
      formData.append(key, value);
    }

    // Call the HostBill API to create the ticket.
    const hostBillResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });


    const data = await hostBillResponse.json();

    if (hostBillResponse.status !== 200) {
      throw new Error('Failed to submit form');
    }

    // Return the response from HostBill API
    return new Response(JSON.stringify({ statusCode: 200, ...data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
