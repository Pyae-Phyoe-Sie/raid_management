import { 
    collection,
    addDoc,
} from "firebase/firestore"
import { db } from "@/app/firebase";

export class UserService {
    async createUser(name: string, password: string): Promise<void> {
        try {
            const usersRef = collection(db, "users");
            await addDoc(usersRef, {
                name,
                password,
                role: '4ltIYxYZ3HtDDxFiLqqi',
            });
            console.log("✅ User created successfully");
        } catch (error) {
            console.error("❌ Error creating user:", error);
            throw error;
        }
    }
}