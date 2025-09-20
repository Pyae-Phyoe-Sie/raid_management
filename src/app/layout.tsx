"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "@/app/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "./firebase";
import { useRoleStore } from "@/store/useRoleStore"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const setRoles = useRoleStore((state) => state.setRoles)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user.uid);
      } else {
        // Sign in anonymously if not signed in
        signInAnonymously(auth)
          .then((result) => {
            console.log("Signed in anonymously:", result.user.uid);
            // fetchUsers will be called automatically via onAuthStateChanged
          })
          .catch((error) => {
            console.error("Error signing in:", error);
          });
      }
    });

    const fetchSchedules = async () => {
      const roleRef = collection(db, "roles");
      const q = query(roleRef);
      const roleQuerySnapshot = await getDocs(q);
      const roles = roleQuerySnapshot.docs.map(doc => ({ ...(doc.data() as IRole), id: doc.id }));
      setRoles(roles);
    };
    fetchSchedules();

    return () => unsubscribe()
  }, [setRoles]);
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
