'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import Image from 'next/image';
import { sendMessageAction, getSocialDataAction, getMessagesAction } from './actions';
import styles from './ProfilePage.module.css';

export default function ProfileClient({ user, initialProfile }) {
  const [activeChat, setActiveChat] = useState(null);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const chatEndRef = useRef(null);

  // FIX: Map the Neon name correctly to remove "Agent"
  const realName = initialProfile?.username || user?.fullName || "Sarvesh Shinde";
  const userLevel = Math.floor((initialProfile?.xp || 0) / 100) + 1;

  // 1. Initial Social Load
  useEffect(() => {
    async function load() {
      const data = await getSocialDataAction(user.id);
      if (data?.friends) setFriends(data.friends);
    }
    load();
  }, [user.id]);

  // 2. Instant Sync Polling (Fixes the "not receiving texts" issue)
  useEffect(() => {
    let interval;
    if (activeChat) {
      const syncChat = async () => {
        const data = await getMessagesAction(user.id, activeChat.id);
        if (data?.success) setMessages(data.messages);
      };
      syncChat();
      interval = setInterval(syncChat, 3000); 
    }
    return () => clearInterval(interval);
  }, [activeChat, user.id]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !activeChat) return;

    const content = chatMsg;
    setChatMsg('');
    await sendMessageAction(user.id, activeChat.id, content);
  };

  return (
    <div className={styles.wrapper}>
      {/* AESTHETIC BANNER */}
      <section className={styles.banner}>
        <Image src={initialProfile?.image_url || user?.imageUrl} width={120} height={120} className={styles.avatar} alt="P" />
        <div className={styles.profileInfo}>
          <h1>{realName}</h1>
          <p className={styles.subText}>Giga Member • Level {userLevel}</p>
        </div>
      </section>

      <div className={styles.mainGrid}>
        <div className={styles.card}>
          <h2>Recent Activity</h2>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🎮</div>
            <div>
              <strong>Joined GigaEsports</strong>
              <p>Welcome to the community!</p>
            </div>
          </div>
        </div>
        
        <div className={styles.card}>
          <h2>Friends Online ({friends.length})</h2>
          {friends.map(f => (
            <div key={f.id} className={styles.friendRow}>
              <div className={styles.statusDot}></div>
              <Image src={f.avatar || '/default.png'} width={35} height={35} className={styles.fAvatar} alt="A"/>
              <span>{f.name}</span>
              <button onClick={() => setActiveChat(f)} className={styles.chatLink}>Chat</button>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING RED CHAT */}
      {activeChat && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div><span className={styles.activeDot}></span> {activeChat.name}</div>
            <X size={18} onClick={() => setActiveChat(null)} style={{cursor:'pointer'}}/>
          </div>
          
          <div className={styles.messageArea}>
            {messages.map((m, i) => (
              <div key={i} className={m.senderId === user.id ? styles.msgMe : styles.msgThem}>
                {m.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className={styles.chatInputArea}>
            <input className={styles.inputField} placeholder="Type a message..." value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} />
            <button type="submit" className={styles.sendBtn}><Send size={18}/></button>
          </form>
        </div>
      )}
    </div>
  );
}