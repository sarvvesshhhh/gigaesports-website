'use server'

import { db } from '@/db';
import { profiles, friendships, messages } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';

// 1. Fetch Friends and Profiles
export async function getSocialDataAction(userId) {
  try {
    const userFriends = await db.select({
      id: profiles.userId,
      name: profiles.username,
      avatar: profiles.imageUrl
    })
    .from(friendships)
    .innerJoin(profiles, eq(friendships.friendId, profiles.userId))
    .where(eq(friendships.userId, userId));

    return { friends: userFriends };
  } catch (error) {
    console.error("Failed to fetch friends:", error);
    return { friends: [] };
  }
}

// 2. Add Friend by Email
export async function addFriendAction(myId, friendEmail) {
  try {
    // Find the friend in our Neon DB
    const [foundFriend] = await db.select().from(profiles).where(eq(profiles.email, friendEmail));

    if (!foundFriend) return { success: false, error: "Agent not found." };
    if (foundFriend.userId === myId) return { success: false, error: "You cannot add yourself." };

    // Create bi-directional friendship
    await db.insert(friendships).values([
      { userId: myId, friendId: foundFriend.userId },
      { userId: foundFriend.userId, friendId: myId }
    ]).onConflictDoNothing();

    return { 
      success: true, 
      friend: { id: foundFriend.userId, name: foundFriend.username, avatar: foundFriend.imageUrl } 
    };
  } catch (error) {
    return { success: false, error: "Database error." };
  }
}

// 3. Send Message
export async function sendMessageAction(senderId, receiverId, content) {
  try {
    await db.insert(messages).values({ senderId, receiverId, content });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}