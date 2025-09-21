"use client";

import { useEffect, useState } from "react"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import { db } from "@/app/firebase"
import moment from "moment"
import { ScheduleService } from "@/modules/schedule.service"

export default function SignUpList({ isAdmin, scheduleId, onClose }: { isAdmin: boolean, scheduleId: string, onClose?: () => void }) {
  const [list, setList] = useState<ISignUp[]>([]);
  const [schedule, setSchedule] = useState<ISchedule | null>(null);
    const scheduleService = new ScheduleService();

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
    }

  useEffect(() => {
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

    async function deleteSignUp(id: string) {
        if (confirm("Are you sure you want to delete this sign-up?")) {
            await scheduleService.deleteSignUp(id);
            await fetchSignUps();
        }
    }

    async function freezeSchedule() {
        if (schedule && !schedule.freeze) {
            if (confirm("Are you sure you want to freeze this schedule?")) {
                await scheduleService.freezeSchedule(schedule.id);
                await fetchSignUps();
            }
        }
    }

    async function unfreezeSchedule() {
        if (schedule && schedule.freeze) {
            if (confirm("Are you sure you want to unfreeze this schedule?")) {
                await scheduleService.unfreezeSchedule(schedule.id);
                await fetchSignUps();
            }
        }
    }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900/[0.7] flex justify-center z-50 h-screen overflow-auto p-4">
        <div className="overflow-x-auto bg-gray-100 p-6 rounded-lg shadow-lg max-w-3xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl mb-4">Sign-Up List for <span className="font-bold">{schedule ? schedule.raid : "Loading..."}</span></h2>
                {isAdmin && <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={schedule?.freeze ? unfreezeSchedule : freezeSchedule}
                >{schedule?.freeze ? "Unfreeze" : "Freeze"}</button>}
            </div>
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Sr.</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">User Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Time</th>
                    {isAdmin && <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {list.length > 0 && list.map((s, i) => (
                    <tr key={i} className={`hover:bg-gray-50 ${i > 14 ? "bg-yellow-100" : "bg-green-100"}`}>
                        <td className={`px-4 py-2 text-sm text-gray-800`}>{i + 1}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{s.user_name}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{moment(s.time.seconds * 1000).format("MM-DD-YYYY HH:mm:ss")}</td>
                        {isAdmin && <td className="px-4 py-2 text-sm text-gray-800">
                            <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                onClick={() => deleteSignUp(s.id)}
                            >Delete</button>
                        </td>}
                    </tr>
                ))}
                {list.length === 0 && (
                    <tr>
                        <td colSpan={isAdmin ? 4 : 3} className="px-4 py-2 text-center text-sm text-gray-500">No sign-ups found.</td>
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
