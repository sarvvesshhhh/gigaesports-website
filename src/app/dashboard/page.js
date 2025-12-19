'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/nextjs";
import { supabase } from '../../lib/supabase';
import styles from './Dashboard.module.css';
import Image from 'next/image';

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  // Dashboard State
  const [friends, setFriends] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [userXP, setUserXP] = useState(0); // New State for XP

  // Chat State
  const [activeFriend, setActiveFriend] = useState(null); 
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatScrollRef = useRef(null);

  // LEVEL CALCULATION
  const currentLevel = Math.floor(userXP / 100) + 1;
  const xpProgress = userXP % 100; // 0 to 99%

  // 1. SYNC USER & FETCH DATA
  useEffect(() => {
    async function initData() {
      if (!user) return;

      // Check if user exists to get their current XP
      let { data: profile } = await supabase.from('profiles').select('xp').eq('user_id', user.id).single();
      
      // If no profile, we create one with 0 XP. If exists, we keep their XP.
      const currentXP = profile ? profile.xp : 0;
      setUserXP(currentXP);

      await supabase.from('profiles').upsert({
          user_id: user.id,
          username: user.fullName || user.firstName,
          email: user.primaryEmailAddress?.emailAddress,
          avatar_url: user.imageUrl,
          xp: currentXP, // Don't reset XP to 0
          status: 'online'
      }, { onConflict: 'user_id' });

      fetchFriends();
    }
    if (user) initData();
  }, [user]);

  // 2. FETCH FRIENDS LIST
  async function fetchFriends() {
    if (!user) return;
    const { data } = await supabase
      .from('friendships')
      .select(`
        user_a_profile:profiles!user_a(*),
        user_b_profile:profiles!user_b(*)
      `)
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
      .eq('status', 'accepted');

    if (data) {
      const formatted = data.map(f => 
        f.user_a_profile.user_id === user.id ? f.user_b_profile : f.user_a_profile
      );
      setFriends(formatted);
    }
  }

  // HELPER: ADD XP
  async function awardXP(amount) {
    const newXP = userXP + amount;
    setUserXP(newXP); // Update UI instantly
    await supabase.from('profiles').update({ xp: newXP }).eq('user_id', user.id);
  }

  // 3. SEND FRIEND REQUEST (+50 XP)
  async function sendRequest() {
    if (!searchEmail) return;
    setMsg("Searching...");
    
    const { data: foundUser } = await supabase.from('profiles').select('user_id').eq('email', searchEmail).single();
    
    if (!foundUser) { setMsg("User not found."); return; }
    if (foundUser.user_id === user.id) { setMsg("Can't add yourself."); return; }

    await supabase.from('friendships').insert({ user_a: user.id, user_b: foundUser.user_id, status: 'accepted' });
    
    setMsg("Friend Added! +50 XP 🚀");
    awardXP(50); // GAMIFICATION
    
    setSearchEmail("");
    fetchFriends();
  }

  // --- CHAT LOGIC ---

  useEffect(() => {
    if (!activeFriend || !user) return;

    async function fetchHistory() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${activeFriend.user_id},receiver_id.eq.${activeFriend.user_id}`)
        .order('created_at', { ascending: true });
      
      const filtered = data.filter(m => 
        (m.sender_id === user.id && m.receiver_id === activeFriend.user_id) ||
        (m.sender_id === activeFriend.user_id && m.receiver_id === user.id)
      );
      setChatMessages(filtered || []);
      scrollToBottom();
    }
    fetchHistory();

    const channel = supabase
      .channel('chat_room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new;
        if (
          (newMsg.sender_id === activeFriend.user_id && newMsg.receiver_id === user.id) ||
          (newMsg.sender_id === user.id && newMsg.receiver_id === activeFriend.user_id)
        ) {
          setChatMessages((prev) => [...prev, newMsg]);
          scrollToBottom();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeFriend, user]);

  function scrollToBottom() {
    setTimeout(() => {
      chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // SEND MESSAGE (+5 XP)
  async function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: activeFriend.user_id,
      content: newMessage
    });
    
    awardXP(5); // GAMIFICATION: Chatting grants XP
    setNewMessage("");
  }

  if (!isLoaded || !isSignedIn) return <div className={styles.loadingContainer}>Loading...</div>;

  return (
    <div className={styles.pageContainer}>
      
      {/* HEADER */}
      <section className={styles.profileHeader}>
        <div className={styles.headerContent}>
          <div className={styles.avatarWrapper}>
            <Image src={user.imageUrl} alt="Profile" width={100} height={100} className={styles.avatar} unoptimized />
            <div className={styles.statusDot}></div>
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.username}>{user.fullName || user.firstName}</h1>
            
            {/* NEW LEVEL UI */}
            <div className={styles.levelContainer}>
              <div className={styles.levelInfo}>
                 <span className={styles.levelBadge}>LVL {currentLevel}</span>
                 <span className={styles.xpText}>{userXP} XP</span>
              </div>
              <div className={styles.xpBarBackground}>
                 <div className={styles.xpBarFill} style={{ width: `${xpProgress}%` }}></div>
              </div>
              <p className={styles.nextLevelMsg}>{100 - xpProgress} XP to Level {currentLevel + 1}</p>
            </div>

          </div>
        </div>
      </section>

      {/* GRID */}
      <div className={styles.grid}>
        
        {/* LEFT: Activity */}
        <div className={styles.mainColumn}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Recent Activity</h2>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>🔥</div>
              <div className={styles.activityContent}>
                 <h4>Current Rank</h4>
                 <p>Level {currentLevel} • {userXP} Total XP</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Friends */}
        <div className={styles.sideColumn}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Friends Online ({friends.length})</h2>
            
            <div className={styles.addFriendBox}>
              <input type="text" placeholder="Friend's email..." className={styles.input}
                value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
              <button className={styles.addBtn} onClick={sendRequest}>Add</button>
            </div>
            {msg && <p className={styles.statusMsg}>{msg}</p>}

            <div className={styles.friendList}>
              {friends.length > 0 ? friends.map((f, i) => (
                <div key={i} className={styles.friendItem}>
                  <div className={styles.friendAvatar}>
                    <Image src={f.avatar_url} width={32} height={32} className={styles.smallAvatar} unoptimized />
                    <div className={styles.smallDot}></div>
                  </div>
                  <span className={styles.friendName}>{f.username}</span>
                  <button className={styles.chatBtn} onClick={() => setActiveFriend(f)}>💬</button>
                </div>
              )) : (
                 <p className={styles.emptyText}>No friends yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CHAT WINDOW */}
      {activeFriend && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatUser}>
               <div className={styles.onlineDot}></div>
               <span>{activeFriend.username}</span>
            </div>
            <button className={styles.closeChat} onClick={() => setActiveFriend(null)}>✕</button>
          </div>
          
          <div className={styles.messagesArea}>
            {chatMessages.length > 0 ? (
               chatMessages.map((m, i) => {
                 const isMe = m.sender_id === user.id;
                 return (
                   <div 
                     key={i} 
                     className={`${styles.messageRow} ${isMe ? styles.rowSent : styles.rowReceived}`}
                   >
                     {!isMe && (
                       <Image 
                         src={activeFriend.avatar_url} 
                         width={28} 
                         height={28} 
                         className={styles.friendMsgAvatar}
                         alt="friend" 
                         unoptimized
                       />
                     )}
                     <div className={`${styles.messageBubble} ${isMe ? styles.sent : styles.received}`}>
                       {m.content}
                     </div>
                   </div>
                 );
               })
            ) : (
               <p className={styles.startChatting}>Start a conversation with {activeFriend.username}!</p>
            )}
            <div ref={chatScrollRef} />
          </div>

          <form className={styles.chatInputArea} onSubmit={sendMessage}>
             <input 
               type="text" 
               placeholder="Type a message (+5 XP)..." 
               className={styles.chatInput}
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
             />
             <button type="submit" className={styles.sendBtn}>➤</button>
          </form>
        </div>
      )}

    </div>
  );
}