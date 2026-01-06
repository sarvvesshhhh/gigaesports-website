'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Plus, X, Send, Award, Zap, Shield } from 'lucide-react';
import Image from 'next/image';
import { addFriendAction, sendMessageAction, getSocialDataAction } from './actions';
import styles from './ProfilePage.module.css';

export default function ProfileClient({ user, initialProfile }) {
  const [friends, setFriends] = useState([]);
  const [friendInput, setFriendInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Safely calculate level and XP progress
  const currentXP = initialProfile?.xp || 0;
  const currentLevel = Math.floor(currentXP / 100) + 1;
  const progressToNextLevel = currentXP % 100;

  // --- 1. LOAD SOCIAL DATA FROM NEON ---
  useEffect(() => {
    async function loadSocial() {
      if (!user?.id) return;
      const data = await getSocialDataAction(user.id);
      if (data?.friends) setFriends(data.friends);
    }
    loadSocial();
  }, [user.id]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 2. ADD FRIEND (Neon Server Action) ---
  const handleAddFriend = async (e) => {
    e.preventDefault();
    const term = friendInput.trim();
    if (!term) return;
    
    setIsSearching(true);
    const result = await addFriendAction(user.id, term);
    
    if (result.success) {
      setFriends(prev => [...prev, result.friend]);
      setFriendInput('');
    } else {
      alert(result.error || "Agent not found in global database.");
    }
    setIsSearching(false);
  };

  // --- 3. CHAT LOGIC ---
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !activeChat) return;
    
    const newMsg = { sender: 'me', text: chatMsg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setChatMsg('');

    await sendMessageAction(user.id, activeChat.id, chatMsg);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        
        {/* PLAYER CARD SECTION */}
        <section className={styles.cardSection}>
           <motion.div 
             className={styles.playerCard3D}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
           >
              <div className={styles.avatarRing}>
                <Image 
                  src={user?.imageUrl || '/default-avatar.png'} 
                  width={120} height={120} 
                  alt="Avatar" 
                  className={styles.avatarImg} 
                />
                <div className={styles.levelBadge}>{currentLevel}</div>
              </div>
              
              <div className={styles.infoBox}>
                <h1 className={styles.username}>{user?.fullName || 'Anonymous Agent'}</h1>
                <div className={styles.rankTag}><Shield size={14} /> GIGA ELITE</div>
              </div>

              <div className={styles.xpContainer}>
                <div className={styles.xpLabel}>
                  <span>XP {currentXP}</span>
                  <span>NEXT LEVEL</span>
                </div>
                <div className={styles.xpBarBackground}>
                  <motion.div 
                    className={styles.xpBarFill} 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNextLevel}%` }}
                  />
                </div>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.statItem}><Zap size={16}/> <span>0 Scrims</span></div>
                <div className={styles.statItem}><Award size={16}/> <span>0 Wins</span></div>
              </div>
           </motion.div>
        </section>

        {/* SOCIAL & FRIENDS PANEL */}
        <section className={styles.rightColumn}>
          <motion.div 
            className={styles.socialCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.sectionHeader}>
              <Users size={20} /> 
              <h2>ACTIVE AGENTS ({friends.length})</h2>
            </div>
            
            <form onSubmit={handleAddFriend} className={styles.addFriendRow}>
              <input 
                type="text" 
                placeholder="Find agent by email..." 
                value={friendInput} 
                onChange={(e) => setFriendInput(e.target.value)}
                className={styles.friendInput} 
                disabled={isSearching}
              />
              <button type="submit" className={styles.addBtn}>
                {isSearching ? <div className={styles.loader} /> : <Plus size={20}/>}
              </button>
            </form>

            <div className={styles.friendList}>
              {friends.length === 0 ? (
                <p className={styles.emptyMsg}>No agents in your network yet.</p>
              ) : (
                friends.map(f => (
                  <div key={f.id} className={styles.friendRow}>
                    <div className={styles.fAvatar}>
                      <Image src={f.avatar || '/default-avatar.png'} width={40} height={40} className={styles.avatarImg} alt="P" />
                      <div className={styles.onlineStatus} />
                    </div>
                    <span className={styles.fName}>{f.name}</span>
                    <button className={styles.chatBtn} onClick={() => setActiveChat(f)}>
                      <MessageSquare size={18}/>
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </section>

      </div>

      {/* FLOATING CHAT POPUP */}
      <AnimatePresence>
        {activeChat && (
          <motion.div 
            className={styles.chatPopup} 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
          >
            <div className={styles.cpHeader}>
              <div className={styles.headerInfo}>
                <div className={styles.tinyStatus} />
                <span>{activeChat.name}</span>
              </div>
              <button onClick={() => setActiveChat(null)} className={styles.closeBtn}><X size={18}/></button>
            </div>
            
            <div className={styles.cpBody}>
              {messages.length === 0 && <p className={styles.chatHint}>Start of transmission with {activeChat.name}</p>}
              {messages.map((m, i) => (
                <div key={i} className={`${styles.msgRow} ${m.sender === 'me' ? styles.msgRowMe : styles.msgRowThem}`}>
                  <div className={styles.msgBubble}>
                    {m.text}
                    <span className={styles.msgTime}>{m.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className={styles.cpInputArea}>
              <input 
                type="text" 
                value={chatMsg} 
                onChange={(e) => setChatMsg(e.target.value)} 
                placeholder="Type a message..." 
              />
              <button type="submit" className={styles.sendBtn}><Send size={18}/></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}