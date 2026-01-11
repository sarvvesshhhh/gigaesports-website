import { pgTable, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// --- THE IDENTITY LAYER (Cross-Game) ---
export const profiles = pgTable('profiles', {
  userId: text('user_id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  
  // Giga Identity (Universal)
  gigaScore: integer('giga_score').default(500),
  archetype: text('archetype').default('Silent Grinder'), //
  streakCount: integer('streak_count').default(0),
  
  // Game-Specific Stats
  valoAccuracy: integer('valo_accuracy').default(0),
  bgmiInsight: integer('bgmi_insight').default(0),
  
  lastRitualAt: timestamp('last_ritual_at').defaultNow(),
  isDecaying: boolean('is_decaying').default(false), //
});

// --- THE VALORANT CHAPTERS (Normalization Layer) ---
export const valorantMatches = pgTable('valorant_matches', {
  id: text('id').primaryKey(), 
  vctStage: text('vct_stage'), // Kickoff, Masters Santiago, etc.
  teamA: text('team_a').notNull(),
  teamB: text('team_b').notNull(),
  
  // Narrative Layer
  chapterTheme: text('chapter_theme'), // "The Redemption of Americas"
  pressureIndex: integer('pressure_index'), // AI-calculated
  
  status: text('status').default('scheduled'),
  winner: text('winner'),
  startTime: timestamp('start_time').notNull(),
});

// --- THE ACCOUNTABILITY ENGINE (Receipts) ---
export const receipts = pgTable('receipts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => profiles.userId),
  matchId: text('match_id').notNull(),
  game: text('game').notNull(), // "valorant", "bgmi", etc.
  prediction: text('prediction').notNull(),
  aiVerdict: text('ai_verdict'), // The cheeky "smart af" comment
  lockedAt: timestamp('locked_at').defaultNow(),
});