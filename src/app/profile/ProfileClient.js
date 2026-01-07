'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Zap, Award, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { getSocialDataAction } from './actions';
import styles from './ProfilePage.module.css';

export default function ProfileClient({ user, initialProfile }) {
  const [friends, setFriends] = useState([]);

  // Data mapping from Neon
  const displayName = initialProfile?.username || user?.fullName || "Agent";
  const xp = initialProfile?.xp || 0;
  const level = Math.floor(xp / 100) + 1;

  useEffect(() => {
    async function load() {
      const data = await getSocialDataAction(user.id);
      if (data?.friends) setFriends(data.friends);
    }
    load();
  }, [user.id]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        
        {/* LEFT: IDENTITY SECTION */}
        <motion.div 
          className={styles.playerCard3D}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className={styles.avatarRing}>
            <Image 
              src={initialProfile?.image_url || user?.imageUrl} 
              width={160} height={160} 
              className={styles.avatarImg} 
              alt="Profile" 
            />
            <div className={styles.levelBadge}>LVL {level}</div>
          </div>
          
          <h1 className={styles.username}>{displayName}</h1>
          <div className={styles.rankTag}><Shield size={14} color="#00f2ff" /> GIGA ELITE</div>

          <div className={styles.xpContainer}>
            <div className={styles.xpLabel}>
              <span>XP {xp}</span>
              <span>NEXT LVL</span>
            </div>
            <div className={styles.xpBarBackground}>
              <motion.div 
                className={styles.xpBarFill} 
                initial={{ width: 0 }}
                animate={{ width: `${xp % 100}%` }}
              />
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}><Zap size={18} color="#00f2ff"/> 0 Scrims</div>
            <div className={styles.statItem}><Award size={18} color="#ff0055"/> 0 Wins</div>
          </div>
        </motion.div>

        {/* RIGHT: SOCIAL SECTION */}
        <motion.div 
          className={styles.socialCard}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className={styles.sectionHeader}>
            <Users size={22} color="#00f2ff" />
            <h2>ACTIVE AGENTS ({friends.length})</h2>
          </div>

          <div className={styles.friendList}>
            {friends.map(f => (
              <div key={f.id} className={styles.friendRow}>
                <Image src={f.avatar || '/default.png'} width={45} height={45} className={styles.fAvatar} alt="Agent" />
                <span className={styles.fName}>{f.name}</span>
                <button className={styles.chatBtn}><MessageSquare size={18}/></button>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}