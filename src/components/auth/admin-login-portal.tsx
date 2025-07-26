"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Shield, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from './admin-auth-context';
import { useRouter } from 'next/navigation';

export default function AdminLoginPortal() {
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useAdminAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<'login' | '2fa'>('login');
    const [isLoading, setIsLoading] = useState(false);

    const handleInitialLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate checking credentials (first step)
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (email === 'admin@roam.com' && password === 'admin123') {
            setStep('2fa');
            toast({
                title: "Authentication Required",
                description: "Please enter your two-factor authentication code.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Invalid Credentials",
                description: "Please check your email and password.",
            });
        }
        setIsLoading(false);
    };

    const handleFinalLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await login(email, password, twoFactorCode);
            
            if (success) {
                toast({
                    title: "Login Successful",
                    description: "Welcome to the Super Admin Dashboard!",
                });
                router.push('/superadmin/dashboard');
            } else {
                toast({
                    variant: "destructive",
                    title: "Authentication Failed",
                    description: "Invalid two-factor authentication code.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Login Error",
                description: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setStep('login');
        setTwoFactorCode('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="text-center pb-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                        <Shield className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Admin Portal
                    </CardTitle>
                    <p className="text-gray-600 text-sm">
                        {step === 'login' 
                            ? 'Secure access to admin dashboard' 
                            : 'Two-factor authentication required'
                        }
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Demo credentials helper */}
                    <Alert className="bg-blue-50 border-blue-200">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 text-sm">
                            <strong>Demo Access:</strong><br />
                            Email: admin@roam.com<br />
                            Password: admin123<br />
                            2FA Code: 123456
                        </AlertDescription>
                    </Alert>

                    {step === 'login' ? (
                        <form onSubmit={handleInitialLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 pr-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Signing In...
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleFinalLogin} className="space-y-4">
                            <div className="text-center mb-4">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                                <p className="text-sm text-gray-600">
                                    Enter the 6-digit code from your authenticator app
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="twoFactorCode" className="text-gray-700 font-medium">
                                    Authentication Code
                                </Label>
                                <Input
                                    id="twoFactorCode"
                                    type="text"
                                    placeholder="000000"
                                    value={twoFactorCode}
                                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    className="text-center text-xl tracking-widest py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    maxLength={6}
                                />
                            </div>

                            <div className="flex space-x-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="flex-1 border-gray-300"
                                    disabled={isLoading}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
                                    disabled={isLoading || twoFactorCode.length !== 6}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Verifying...
                                        </div>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
