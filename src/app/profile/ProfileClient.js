'use client';

import { useState, useEffect } from 'react';
import { X, Send, Shield, Users } from 'lucide-react';
import Image from 'next/image';
import { sendMessageAction, getSocialDataAction } from './actions';
import styles from './ProfilePage.module.css';

export default function ProfileClient({ user, initialProfile }) {
  const [activeChat, setActiveChat] = useState(null);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);

  // Correct Mapping from Neon
  const realName = initialProfile?.username || user?.fullName || "Sarvesh Shinde";
  const userLevel = Math.floor((initialProfile?.xp || 0) / 100) + 1;

  useEffect(() => {
    async function load() {
      const data = await getSocialDataAction(user.id);
      if (data?.friends) setFriends(data.friends);
    }
    load();
  }, [user.id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !activeChat) return;

    const newMsg = { text: chatMsg, sender: 'me' };
    setMessages(prev => [...prev, newMsg]);
    setChatMsg('');

    await sendMessageAction(user.id, activeChat.id, chatMsg);
  };

  return (
    <div className={styles.wrapper}>
      {/* 1. HORIZONTAL BANNER */}
      <section className={styles.banner}>
        <Image 
          src={initialProfile?.image_url || user?.imageUrl} 
          width={120} height={120} 
          className={styles.avatar} 
          alt="Profile" 
        />
        <div className={styles.profileInfo}>
          <h1>{realName}</h1>
          <p className={styles.subText}>Giga Member • Level {userLevel}</p>
        </div>
      </section>

      {/* 2. ACTIVITY GRID */}
      <div className={styles.mainGrid}>
        <div className={styles.card}>
          <h2>Recent Activity</h2>
          <div style={{color: '#666'}}>Welcome to the community!</div>
        </div>
        
        <div className={styles.card}>
          <h2>Friends Online</h2>
          {friends.map(f => (
            <div key={f.id} style={{display:'flex', alignItems:'center', gap: '10px', marginTop: '10px'}}>
              <Image src={f.avatar || '/default.png'} width={30} height={30} style={{borderRadius: '50%'}} alt="A"/>
              <span>{f.name}</span>
              <button onClick={() => setActiveChat(f)} style={{marginLeft:'auto', background:'none', border:'none', color:'#ff4d4d', cursor:'pointer'}}>Chat</button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FLOATING CHAT BOX */}
      {activeChat && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div><span className={styles.statusDot}></span> {activeChat.name}</div>
            <X size={18} onClick={() => setActiveChat(null)} style={{cursor:'pointer'}}/>
          </div>
          
          <div className={styles.messageArea}>
            {messages.map((m, i) => (
              <div key={i} className={m.sender === 'me' ? styles.msgMe : styles.msgThem}>
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className={styles.chatInputArea}>
            <input 
              className={styles.inputField}
              placeholder="Type a message..."
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
            />
            <button type="submit" className={styles.sendBtn}><Send size={18}/></button>
          </form>
        </div>
      )}
    </div>
  );
}