import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ CLERK_WEBHOOK_SECRET is missing!");
    return new Response('Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to Vercel', { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // Get the body
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
    console.error('❌ Webhook verification failed:', err.message);
    return new Response('Error: Verification failed', { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`✅ Webhook received: ${eventType} for user ${id}`);

  // 1. HANDLE USER CREATION
  if (eventType === 'user.created') {
    const { email_addresses, image_url, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    await db.insert(profiles).values({
      userId: id,
      username: name || 'Agent',
      email: email,
      imageUrl: image_url,
      xp: 0
    }).onConflictDoNothing();
    
    console.log(`👤 Profile created for ${email}`);
  }

  // 2. HANDLE UPDATES
  if (eventType === 'user.updated') {
    const { image_url, first_name, last_name } = evt.data;
    await db.update(profiles)
      .set({ 
        username: `${first_name} ${last_name}`, 
        imageUrl: image_url 
      })
      .where(eq(profiles.userId, id));
  }

  return new Response('✅ Success', { status: 200 });
}