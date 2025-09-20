import { create } from "zustand";

interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
