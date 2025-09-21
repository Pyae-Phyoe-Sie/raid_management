import { 
    collection, 
    getDocs, 
    query, 
    addDoc, 
    Timestamp,
    doc,
    deleteDoc,
    updateDoc,
    where
} from "firebase/firestore"
import { db } from "@/app/firebase";

export class ScheduleService {
    // Schedule related methods would go here
    // Example method to fetch schedules
    async fetchSchedules(): Promise<ISchedule[]> {
        const roleRef = collection(db, "schedules");
        const q = query(roleRef);
        const roleQuerySnapshot = await getDocs(q);
        const data = roleQuerySnapshot.docs.map(doc => ({ ...(doc.data() as ISchedule), id: doc.id }));
        return data;
    }

    async createSchedule(raid: string, date: string): Promise<void> {
        try {
            const jsDate = new Date(date);
            const timestamp = Timestamp.fromDate(jsDate);
            const schedulesRef = collection(db, "schedules");

            await addDoc(schedulesRef, {
                raid,
                date: timestamp,
                freeze: false,
            });

            console.log("✅ Schedule created successfully");
        } catch (error) {
            console.error("❌ Error creating schedule:", error);
            throw error;
        }
    }

    async deleteSchedule(scheduleId: string): Promise<void> {
        try {
            const scheduleRef = doc(db, "schedules", scheduleId);
            await deleteDoc(scheduleRef);

            const signupsRef = collection(db, "signups");
            const q = query(signupsRef, where("schedule_id", "==", scheduleId));
            const signupsSnapshot = await getDocs(q);
            const deletePromises = signupsSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            console.log("✅ Schedule deleted successfully");
        } catch (error) {
            console.error("❌ Error deleting schedule:", error);
            throw error;
        }
    }

    async signUpForSchedule(scheduleId: string,userId: string, userName: string): Promise<void> {
        try {
            const signupsRef = collection(db, "signups");
            const timestamp = Timestamp.now();
            await addDoc(signupsRef, {
                schedule_id: scheduleId,
                user_name: userName,
                user_id: userId,
                time: timestamp,
            });
            console.log("✅ Signed up for schedule successfully");
        } catch (error) {
            console.error("❌ Error signing up for schedule:", error);
            throw error;
        }
    }

    async deleteSignUp(signUpId: string): Promise<void> {
        try {
            const signUpRef = doc(db, "signups", signUpId);
            await deleteDoc(signUpRef);
            console.log("✅ Sign-up deleted successfully");
        } catch (error) {
            console.error("❌ Error deleting Sign-up:", error);
            throw error;
        }
    }

    async freezeSchedule(scheduleId: string): Promise<void> {
        try {
            const scheduleRef = doc(db, "schedules", scheduleId);
            await updateDoc(scheduleRef, { freeze: true });
            console.log("✅ Schedule frozen successfully");
        } catch (error) {
            console.error("❌ Error freezing schedule:", error);
            throw error;
        }
    }

    async unfreezeSchedule(scheduleId: string): Promise<void> {
        try {
            const scheduleRef = doc(db, "schedules", scheduleId);
            await updateDoc(scheduleRef, { freeze: false });
            console.log("✅ Schedule unfrozen successfully");
        } catch (error) {
            console.error("❌ Error unfreezing schedule:", error);
            throw error;
        }
    }
}