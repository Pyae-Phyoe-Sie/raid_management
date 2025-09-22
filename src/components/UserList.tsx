"use client";

import { useEffect, useState } from "react"
import { UserService } from "@/modules/user.service";

export default function UserList({ onClose }: { onClose?: () => void }) {
    const [user, setUser] = useState<IUser[]>([]);
    const userService = new UserService();
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        const data = await userService.getUsers();
        setUser(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900/[0.7] flex justify-center z-50 h-screen p-4">
        <div className="overflow-x-auto bg-gray-100 p-6 rounded-lg shadow-lg max-w-3xl w-full mx-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl mb-4">Our Members</h2>
                <span>{loading ? "Loading..." :  user.length + " members found"} </span>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Sr.</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">User Name</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {user.length > 0 && user.map((s, i) => (
                        <tr key={i} className={`hover:bg-gray-50`}>
                            <td className={`px-4 py-2 text-sm text-gray-800`}>{i + 1}</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{s.name}</td>
                        </tr>
                    ))}
                    {!loading && user.length === 0 && (
                        <tr>
                            <td colSpan={2} className="px-4 py-2 text-center text-sm text-gray-500">No user found.</td>
                        </tr>
                    )}
                    {loading && (
                        <tr>
                            <td colSpan={2} className="px-4 py-2 text-center text-sm text-gray-500">Data fetching please wait.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <button
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-40 mx-auto cursor-pointer"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    </div>
  );
}
