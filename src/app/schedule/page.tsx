"use client";

import { useState, useEffect } from "react";
import { ScheduleService } from "@/modules/schedule.service";
import moment from "moment";
import { RolesType } from "@/enum";
import SignUpList from "@/components/SignUpList";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebase"
import { useRouter } from "next/navigation"
import { RoleService } from "@/modules/role.service";

export default function Schedule() {
  const [role, setRole] = useState<string | null>("");
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const scheduleService = new ScheduleService();
  const [raidName, setRaidName] = useState("");
  const [raidTime, setRaidTime] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const router = useRouter();
  const [signedUp, setSignedUp] = useState<string[]>()
  const [loading, setLoading] = useState(false)
  const roleService = new RoleService();

  useEffect(() => {
    const fetchRoleAndData = async () => {
      const storedRole = localStorage.getItem("role") || "";
      setRole(await roleService.getRoleName(storedRole));
      await fetchData();
    };
    fetchRoleAndData();
  }, []);

  const fetchData = async () => {
    const data = await scheduleService.fetchSchedules();

    const schedulesWithSignups = await Promise.all(
      data.map(async (schedule) => ({
        ...schedule,
        signups: await fetchScheduleById(schedule.id),
      }))
    );

    setSchedules(schedulesWithSignups)
    checkAlreadySignedUp()
  };

  function createSchedule() {
    if (!raidName || !raidTime) {
      alert("Please provide both raid name and time.");
      return;
    }

    setLoading(true)
    scheduleService.createSchedule(raidName, raidTime)
      .then(async () => {
        // Refresh schedules after creation
        await fetchData()
        setRaidName("")
        setRaidTime("")
        setLoading(false)
      })
      .catch(error => {
        console.error("Error creating schedule:", error)
        setLoading(false)
      });
  }

  async function fetchScheduleById(scheduleId: string): Promise<number> {
    const signUpRef = collection(db, "signups");
    const q = query(signUpRef, where("schedule_id", "==", scheduleId));
    const signUpQuerySnapshot = await getDocs(q);
    const data = signUpQuerySnapshot.docs.map(doc => ({ ...(doc.data() as ISignUp), id: doc.id }));
    return data.length;
  }

  async function signUp(scheduleId: string) {
    setLoading(true)
    const userId = localStorage.getItem("token") || "";
    const userName = localStorage.getItem("username") || "Unknown User";
    await scheduleService.signUpForSchedule(scheduleId, userId, userName)
    setLoading(false)
    await fetchData()
  }

  async function checkAlreadySignedUp() {
    const userId = localStorage.getItem("token") || "";
    const signUpRef = collection(db, "signups");
    const q = query(signUpRef, where("user_id", "==", userId));
    const signUpQuerySnapshot = await getDocs(q);
    const data = signUpQuerySnapshot.docs.map(doc => ({ ...(doc.data() as ISignUp), id: doc.id }));
    const signedUpScheduleIds = data.map(signUp => signUp.schedule_id);
    setSignedUp(signedUpScheduleIds);
  }

  return (
    <>
      <div className="h-screen flex justify-center bg-gray-100 w-full">
        {/* Your schedule content */}
        <div className="p-8 shadow-md w-full max-w-4xl overflow-auto">
          <div className="flex justify-between items-center mb-6 w-full">
            <h1 className="text-2xl font-bold">Active schedules</h1>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition cursor-pointer"
            >
              Switch User
            </button>
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {schedules.map((schedule, i) => ( <div key={i} className="md:w-[48%] lg:w-[32%] p-4 border border-gray-300 text-center rounded-lg shadow-md bg-white flex flex-col justify-between">
              <h2 className="text-xl font-semibold mb-2">{ schedule.raid }</h2>
              <div>
                <p className="mb-2">{ moment(schedule.date.seconds * 1000).format("DD MMM YYYY HH:mm:ss") }</p>
                <p className="mb-4">Sign-Ups: 
                  <span className={`${schedule.signups < 12 ? "text-red-500" : "text-green-500" }`}> { schedule.signups ?? 0 }</span>
                </p>
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mb-2"
                  onClick={() => setSelectedScheduleId(schedule.id)}
                >Check Lists</button>
                {role !== RolesType.SuperAdmin && !signedUp?.includes(schedule.id) && <button 
                  className={`w-full text-white px-4 py-2 rounded ${schedule.freeze ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"}`}
                  onClick={() => !schedule.freeze && signUp(schedule.id)}
                  disabled={loading || schedule.freeze}
                >{schedule.freeze ? 'No more accept' : 'Sign-Up'}</button>}
                {role !== RolesType.SuperAdmin && signedUp?.includes(schedule.id) && <button 
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >Signed-Up</button>}
                {role === RolesType.SuperAdmin && <button className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete this schedule?")) {
                        await scheduleService.deleteSchedule(schedule.id)
                        await fetchData()
                      }
                    }}
                  >Delete</button>}
              </div>
            </div>))}
            {role === RolesType.SuperAdmin && <div className="md:w-[48%] lg:w-[32%] p-4 border border-gray-300 text-center flex flex-col rounded-lg shadow-md bg-white">
              <input 
                type="text" 
                placeholder="Raid Name" 
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                onChange={(e) => setRaidName(e.target.value)}
              />
              <input 
                onChange={(e) => setRaidTime(e.target.value)} 
                type="datetime-local" 
                className="w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-auto"
                onClick={createSchedule}
                disabled={loading}
              > + Create New Schedule</button>
            </div>}
          </div>
        </div>
      </div>

      {selectedScheduleId !== "" && <SignUpList isAdmin={role === RolesType.SuperAdmin} scheduleId={selectedScheduleId} onClose={() => setSelectedScheduleId("")} />}
    </>
  );
}
