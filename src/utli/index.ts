"use client";

import { useRoleStore } from "@/store/useRoleStore";

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
}

export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0].slice(0, 5);
}

export function getRoleName(roleId: string): string | null {
    const roles = useRoleStore.getState().roles;
    const role = roles?.find(r => r.id === roleId);
    return role ? role.name : null;
}