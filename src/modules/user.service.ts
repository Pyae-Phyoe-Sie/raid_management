import { 
    collection,
    addDoc,
    getDocs
} from "firebase/firestore"
import { db } from "@/app/firebase";

export class UserService {

    async getUsers(): Promise<IUser[]> {
        const usersRef = collection(db, "users");
        const userSnapshot = await getDocs(usersRef);
        const users = userSnapshot.docs.map(doc => ({ ...(doc.data() as IUser), id: doc.id }));
        return users;
    }

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