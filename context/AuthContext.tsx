'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from "@/lib/api";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    profilePicture?: string;
    gender?: string;
    rank?: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            const parsedUser = JSON.parse(storedUser);
            // Normalize _id
            if (!parsedUser._id && parsedUser.id) {
                parsedUser._id = parsedUser.id;
            }
            setUser(parsedUser);

            // Fetch latest user data to get rank and updates
            fetch(`${API_URL}/api/user/${parsedUser._id}`)
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Failed to fetch user');
                })
                .then(updatedUser => {
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                })
                .catch(err => {
                    console.error("Failed to refresh user data", err);
                    // If 404 or auth error, maybe logout? For now just keep local data
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token: string, userData: any) => {
        // Normalize _id
        const userWithId = { ...userData, _id: userData._id || userData.id };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithId));
        setUser(userWithId);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
