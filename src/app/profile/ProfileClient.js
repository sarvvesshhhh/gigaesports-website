'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Award, Send, Users, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { sendMessageAction, getSocialDataAction } from './actions';
import styles from './ProfilePage.module.css';

export default function ProfileClient({ user, initialProfile }) {
  const [activeChat, setActiveChat] = useState(null);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  
  // FIX: Properly map the Neon username
  const realName = initialProfile?.username || user?.fullName || "Recruit";
  const currentXP = initialProfile?.xp || 0;
  const currentLevel = Math.floor(currentXP / 100) + 1;

  useEffect(() => {
    async function loadSocial() {
      const data = await getSocialDataAction(user.id);
      if (data?.friends) setFriends(data.friends);
    }
    loadSocial();
  }, [user.id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !activeChat) return;

    const newMsg = { text: chatMsg, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, newMsg]);
    setChatMsg('');

    await sendMessageAction(user.id, activeChat.id, chatMsg);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        
        {/* IDENTITY CARD */}
        <motion.div className={styles.playerCard3D} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <div className={styles.avatarRing}>
            <Image src={initialProfile?.image_url || user?.imageUrl} width={180} height={180} className={styles.avatarImg} alt="P" />
            <div className={styles.levelBadge}>LVL {currentLevel}</div>
          </div>
          <h1 className={styles.username}>{realName}</h1>
          <p className={styles.rankTag}><Shield size={14} color="#00f2ff" /> GIGA ELITE</p>
          
          <div className={styles.statsRow}>
            <div className={styles.statItem}><Zap size={18} color="#00f2ff"/> 0 Scrims</div>
            <div className={styles.statItem}><Award size={18} color="#ff0055"/> 0 Wins</div>
          </div>
        </motion.div>

        {/* SOCIAL & CHAT HUB */}
        <div className={styles.socialCard}>
          <div className={styles.chatArea}>
            {!activeChat ? (
              <div className={styles.emptyChat}>
                <Users size={48} color="rgba(255,255,255,0.1)" />
                <p>Select an Active Agent to start transmission</p>
                <div className={styles.agentList}>
                  {friends.map(f => (
                    <button key={f.id} onClick={() => setActiveChat(f)} className={styles.agentBtn}>
                      <Image src={f.avatar || '/default.png'} width={40} height={40} className={styles.fAvatar} alt="A"/>
                      <span>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={m.sender === 'me' ? styles.myMsg : styles.theirMsg}>
                  {m.text}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className={styles.inputArea}>
            <input 
              className={styles.glowInput}
              placeholder={activeChat ? `Message ${activeChat.name}...` : "Select an agent..."}
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              disabled={!activeChat}
            />
            <button type="submit" className={styles.sendBtn} disabled={!activeChat}>
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}