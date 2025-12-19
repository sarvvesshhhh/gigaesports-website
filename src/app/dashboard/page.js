'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { supabase } from '../../lib/supabase'; // Import our new helper
import styles from './Dashboard.module.css';
import Image from 'next/image';

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [friends, setFriends] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [msg, setMsg] = useState("");

  // 1. SYNC USER TO SUPABASE ON LOAD
  useEffect(() => {
    async function syncUser() {
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: user.fullName || user.firstName,
          email: user.primaryEmailAddress?.emailAddress, // We need email to find friends
          avatar_url: user.imageUrl,
          level: 1,
          status: 'online'
        }, { onConflict: 'user_id' });

      if (error) console.error("Sync Error:", error);
    }
    
    if (user) {
      syncUser();
      fetchFriends();
    }
  }, [user]);

  // 2. FETCH FRIENDS LIST
  async function fetchFriends() {
    if (!user) return;
    
    // Find requests where I am either Sender (user_a) or Receiver (user_b) AND status is 'accepted'
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        status,
        user_a_profile:profiles!user_a(username, avatar_url, status),
        user_b_profile:profiles!user_b(username, avatar_url, status)
      `)
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
      .eq('status', 'accepted');

    if (data) {
      // Clean up the data to just get "The Other Person"
      const formattedFriends = data.map(f => 
        f.user_a_profile.username === (user.fullName || user.firstName) ? f.user_b_profile : f.user_a_profile
      );
      setFriends(formattedFriends);
    }
    setLoadingFriends(false);
  }

  // 3. SEND FRIEND REQUEST
  async function sendRequest() {
    if (!searchEmail) return;
    setMsg("Searching...");

    // First, find the user ID by email
    const { data: foundUser, error: searchError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', searchEmail)
      .single();

    if (searchError || !foundUser) {
      setMsg("User not found. Ask them to visit their Dashboard first!");
      return;
    }

    if (foundUser.user_id === user.id) {
      setMsg("You can't add yourself, bro.");
      return;
    }

    // Create the friendship
    const { error: addError } = await supabase
      .from('friendships')
      .insert({
        user_a: user.id,
        user_b: foundUser.user_id,
        status: 'accepted' // Auto-accept for now to make testing easier!
      });

    if (addError) {
      setMsg("Error adding friend.");
    } else {
      setMsg("Friend Added!");
      setSearchEmail("");
      fetchFriends(); // Refresh list
    }
  }

  if (!isLoaded || !isSignedIn) {
    return <div className={styles.loadingContainer}>Loading Profile...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      
      {/* PROFILE HEADER */}
      <section className={styles.profileHeader}>
        <div className={styles.headerContent}>
          <div className={styles.avatarWrapper}>
            <Image src={user.imageUrl} alt="Profile" width={164} height={164} className={styles.avatar} unoptimized />
            <div className={styles.statusDot}></div>
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.username}>{user.fullName || user.firstName}</h1>
            <p className={styles.userTag}>Giga Member • Level 1</p>
            <div className={styles.badges}>
               <span className={styles.badge}>🛡️ Beta Tester</span>
               <span className={styles.badge}>🇮🇳 India</span>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD GRID */}
      <div className={styles.grid}>
        
        {/* LEFT: Activity */}
        <div className={styles.mainColumn}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Recent Activity</h2>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>🎮</div>
              <div className={styles.activityContent}>
                 <h4>Joined GigaEsports</h4>
                 <p>Welcome to the community!</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Friends Manager */}
        <div className={styles.sideColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
               <h2 className={styles.panelTitle}>Friends Online ({friends.length})</h2>
            </div>
            
            {/* ADD FRIEND INPUT */}
            <div className={styles.addFriendBox}>
              <input 
                type="text" 
                placeholder="Enter friend's email..." 
                className={styles.input}
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <button className={styles.addBtn} onClick={sendRequest}>Add</button>
            </div>
            {msg && <p className={styles.statusMsg}>{msg}</p>}

            {/* FRIEND LIST */}
            <div className={styles.friendList}>
              {friends.length > 0 ? (
                friends.map((f, i) => (
                  <div key={i} className={styles.friendItem}>
                    <div className={styles.friendAvatar}>
                      <Image src={f.avatar_url || "/default-avatar.png"} width={40} height={40} className={styles.smallAvatar} />
                      <div className={styles.smallDot}></div>
                    </div>
                    <span>{f.username}</span>
                    <button className={styles.chatBtn}>💬</button>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>No friends yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}