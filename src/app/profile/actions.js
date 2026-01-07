'use server'

import { db } from '@/db';
import { profiles, friendships, messages } from '@/db/schema';
import { eq, and, or, asc } from 'drizzle-orm';

// 1. Fetch Chat History
export async function getMessagesAction(myId, friendId) {
  try {
    const chatHistory = await db.select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, myId), eq(messages.receiverId, friendId)),
          and(eq(messages.senderId, friendId), eq(messages.receiverId, myId))
        )
      )
      .orderBy(asc(messages.createdAt));

    return { success: true, messages: chatHistory };
  } catch (error) {
    return { success: false, messages: [] };
  }
}

// 2. Send a Message (The missing export fix)
export async function sendMessageAction(senderId, receiverId, content) {
  try {
    await db.insert(messages).values({ 
      senderId, 
      receiverId, 
      content 
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false };
  }
}

// 3. Fetch Friends
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
    return { friends: [] };
  }
}