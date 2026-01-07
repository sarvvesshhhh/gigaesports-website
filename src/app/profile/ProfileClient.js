'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import Image from 'next/image';
import { sendMessageAction, getSocialDataAction, getMessagesAction } from './actions'; // Ensure getMessagesAction exists
import styles from './ProfilePage.module.css';

export default function ProfileClient({ user, initialProfile }) {
  const [activeChat, setActiveChat] = useState(null);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const chatEndRef = useRef(null);

  const realName = initialProfile?.username || user?.fullName || "Sarvesh Shinde";
  const userLevel = Math.floor((initialProfile?.xp || 0) / 100) + 1;

  // 1. INITIAL LOAD OF FRIENDS
  useEffect(() => {
    async function load() {
      const data = await getSocialDataAction(user.id);
      if (data?.friends) setFriends(data.friends);
    }
    load();
  }, [user.id]);

  // 2. AUTO-POLLING FOR NEW MESSAGES (Every 3 seconds)
  useEffect(() => {
    let interval;
    if (activeChat) {
      const fetchMsgs = async () => {
        const data = await getMessagesAction(user.id, activeChat.id);
        if (data?.success) setMessages(data.messages);
      };
      
      fetchMsgs(); // Initial fetch
      interval = setInterval(fetchMsgs, 3000); // Poll every 3s
    }
    return () => clearInterval(interval);
  }, [activeChat, user.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !activeChat) return;

    // Optimistic UI Update
    const tempMsg = { content: chatMsg, senderId: user.id, createdAt: new Date() };
    setMessages(prev => [...prev, tempMsg]);
    setChatMsg('');

    await sendMessageAction(user.id, activeChat.id, chatMsg);
  };

  return (
    <div className={styles.wrapper}>
      {/* BANNER UI */}
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

      <div className={styles.mainGrid}>
        <div className={styles.card}>
          <h2>Recent Activity</h2>
          <div style={{color: '#666'}}>Joined GigaEsports: Welcome to the community!</div>
        </div>
        
        <div className={styles.card}>
          <h2>Friends Online</h2>
          {friends.map(f => (
            <div key={f.id} className={styles.friendListItem}>
              <Image src={f.avatar || '/default.png'} width={30} height={30} style={{borderRadius: '50%'}} alt="A"/>
              <span>{f.name}</span>
              <button onClick={() => setActiveChat(f)} className={styles.chatLinkBtn}>Chat</button>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING RED CHAT */}
      {activeChat && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div><span className={styles.statusDot}></span> {activeChat.name}</div>
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