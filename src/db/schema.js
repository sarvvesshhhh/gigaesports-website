import { pgTable, text, timestamp, integer, unique, serial } from 'drizzle-orm/pg-core';

// 1. Profiles (Sync'd from Clerk via Webhooks)
export const profiles = pgTable('profiles', {
  userId: text('user_id').primaryKey(), // Matches Clerk ID exactly
  username: text('username').unique(),
  email: text('email').unique(),
  imageUrl: text('image_url'),
  xp: integer('xp').default(0),
});

// 2. Friendships (Bi-directional Logic)
export const friendships = pgTable('friendships', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => profiles.userId, { onDelete: 'cascade' }),
  friendId: text('friend_id').references(() => profiles.userId, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.friendId), // Prevents duplicate friendship rows
}));

// 3. Messages (Real-time Chat Foundation)
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderId: text('sender_id').references(() => profiles.userId, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').references(() => profiles.userId, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});