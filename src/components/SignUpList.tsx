"use client";

import { useEffect, useState } from "react"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import { db } from "@/app/firebase"
import moment from "moment"

export default function SignUpList({ scheduleId, onClose }: { scheduleId: string, onClose?: () => void }) {
  const [list, setList] = useState<ISignUp[]>([]);
  const [schedule, setSchedule] = useState<ISchedule | null>(null);

  useEffect(() => {
    const fetchSignUps = async () => {
      const signUpRef = collection(db, "signups");
      const q = query(signUpRef, where("schedule_id", "==", scheduleId));
      const signUpQuerySnapshot = await getDocs(q);
      const data = signUpQuerySnapshot.docs.map(doc => ({ ...(doc.data() as ISignUp), id: doc.id }));
      data.sort((a, b) => a.time.seconds - b.time.seconds); // Sort by time ascending
      setList(data);

        const scheduleData = await fetchScheduleById(scheduleId);
        console.log("Fetched schedule data:", scheduleData);
        setSchedule(scheduleData);
    };
    fetchSignUps();
  }, [scheduleId]);

    async function fetchScheduleById(scheduleId: string) {
        const docRef = doc(db, "schedules", scheduleId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { ...(docSnap.data() as ISchedule), id: docSnap.id };
        } else {
            console.log("❌ No such schedule!");
            return null;
        }
    }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900/[0.7] flex items-center justify-center z-50">
        <div className="overflow-x-auto bg-gray-100 p-6 rounded-lg shadow-lg max-w-3xl w-full mx-4">
            <h2 className="text-2xl mb-4">Sign-Up List for <span className="font-bold">{schedule ? schedule.raid : "Loading..."}</span></h2>
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">User Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Time</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {list.length > 0 && list.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-800">{s.user_name}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{moment(s.time.seconds * 1000).format("MM-DD-YYYY HH:mm:ss")}</td>
                    </tr>
                ))}
                {list.length === 0 && (
                    <tr>
                    <td colSpan={2} className="px-4 py-2 text-center text-sm text-gray-500">No sign-ups found.</td>
                    </tr>
                )}
                </tbody>
            </table>

            <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    </div>
  );
}
