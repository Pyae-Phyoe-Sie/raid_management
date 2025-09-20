import { 
    collection,
    getDocs
} from "firebase/firestore"
import { db } from "@/app/firebase";

export class RoleService {
    async fetchRoles(): Promise<IRole[]> {
        const roleRef = collection(db, "roles");
        const roleQuerySnapshot = await getDocs(roleRef);
        const data = roleQuerySnapshot.docs.map(doc => ({ ...(doc.data() as IRole), id: doc.id }));
        return data;
    }

    async getRoleName(roleId: string): Promise<string> {
        const roles = await this.fetchRoles();
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : "Unknown Role";
    }
}