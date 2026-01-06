import { Webhook } from 'svix';
import { db } from '@/db';
import { profiles } from '@/db/schema';

export async function POST(req) {
  console.log("--- WEBHOOK ARRIVED ---"); // Add this
  
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response('Missing Webhook Secret', { status: 400 });
  }

  // Get headers for Svix verification
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Verification Error', { status: 400 });
  }

  // Handle "User Created" Event
  if (evt.type === 'user.created') {
    const { id, first_name, last_name, image_url, email_addresses } = evt.data;
    
    await db.insert(profiles).values({
      userId: id, // This is the Clerk ID (Text)
      username: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    }).onConflictDoNothing(); // Prevents crashes if user already exists
    
    console.log(`Agent ${id} synced to Neon database.`);
  }

  return new Response('Sync Success', { status: 200 });
}