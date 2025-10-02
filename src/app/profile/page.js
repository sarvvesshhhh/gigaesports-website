import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Image from "next/image";
import styles from './ProfilePage.module.css';

export default async function ProfilePage() {
  // 1. Get the user's session on the server
  const session = await getServerSession(authOptions);

  // 2. If no session exists, redirect to the homepage
  if (!session) {
    redirect('/');
  }

  // 3. If a session exists, display the user's info
  return (
    <div className={styles.page}>
      <div className={styles.profileCard}>
        <h1>User Profile</h1>
        <Image 
          src={session.user.image}
          alt={session.user.name}
          width={100}
          height={100}
          className={styles.profileImage}
        />
        <h2>{session.user.name}</h2>
        <p>{session.user.email}</p>
      </div>
    </div>
  );
}