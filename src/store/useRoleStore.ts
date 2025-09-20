import { create } from "zustand";

interface RoleState {
  roles?: IRole[];
  setRoles: (role: IRole[]) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: undefined,
  setRoles: (roles) => {
    set({ roles });
  },
}));
