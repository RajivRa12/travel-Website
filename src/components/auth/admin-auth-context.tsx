"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AdminUser = {
    email: string;
    role: 'superadmin';
    loginTime: string;
};

type AdminAuthContextType = {
    adminUser: AdminUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, twoFactorCode: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Demo credentials
    const DEMO_CREDENTIALS = {
        email: "admin@roam.com",
        password: "admin123",
        twoFactorCode: "123456",
    };

    useEffect(() => {
        // Check for existing session on mount
        const checkSession = () => {
            try {
                const session = localStorage.getItem("superadmin_session");
                if (session) {
                    const parsedSession = JSON.parse(session);
                    setAdminUser(parsedSession);
                }
            } catch (error) {
                console.error("Error parsing admin session:", error);
                localStorage.removeItem("superadmin_session");
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = async (email: string, password: string, twoFactorCode: string): Promise<boolean> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (
            email === DEMO_CREDENTIALS.email &&
            password === DEMO_CREDENTIALS.password &&
            twoFactorCode === DEMO_CREDENTIALS.twoFactorCode
        ) {
            const userData: AdminUser = {
                email: email,
                role: 'superadmin',
                loginTime: new Date().toISOString(),
            };

            setAdminUser(userData);
            localStorage.setItem("superadmin_session", JSON.stringify(userData));
            return true;
        }

        return false;
    };

    const logout = () => {
        setAdminUser(null);
        localStorage.removeItem("superadmin_session");
    };

    const value = {
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout,
        isLoading,
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};
