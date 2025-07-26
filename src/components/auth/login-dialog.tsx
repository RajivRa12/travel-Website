"use client";

import * as React from "react";
import Link from 'next/link';
import {
    UserRound,
    Mail,
    KeyRound,
    Sparkles,
    LogOut,
    Briefcase,
    LifeBuoy,
    Share2,
    Star,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./auth-context";

type AuthMode = 'login' | 'signup' | 'magic';

export function LoginDialog() {
    const { user, login, logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);
    const [mode, setMode] = React.useState<AuthMode>('login');
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // This is a placeholder for actual login logic
        login({ 
            name: "Priya Singh",
            email: "priya@example.com", 
            avatar: "https://placehold.co/100x100.png"
        });
        setIsOpen(false);
    };
    
    const openDialog = (authMode: AuthMode) => {
        setMode(authMode);
        setIsOpen(true);
    };

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 xs:h-10 xs:w-10 rounded-full touch-target">
                        <Avatar className="h-8 w-8 xs:h-10 xs:w-10">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="woman smiling"/>
                            <AvatarFallback className="text-xs xs:text-sm">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 xs:w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                         <Link href="/profile" className="block">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </Link>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                         <Link href="/my-trips">
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>My Trips</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Customer Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Share App</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        <span>Rate Us</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
    
    const titles = {
        login: "Welcome Back",
        signup: "Create an Account",
        magic: "Magic Link Login"
    };
    
    const descriptions = {
        login: "Enter your credentials to access your account.",
        signup: "Join us to start your next adventure.",
        magic: "We'll email you a link to log in instantly."
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="touch-target">
                        <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="sr-only">Profile</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => openDialog('login')}>
                        <KeyRound className="mr-2 h-4 w-4" />
                        <span>Login</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => openDialog('signup')}>
                        <UserRound className="mr-2 h-4 w-4" />
                        <span>Sign Up</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => openDialog('magic')}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span>Magic Link</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto agent-modal-mobile">
                    <DialogHeader className="p-mobile-3">
                        <DialogTitle className="text-responsive-lg">{titles[mode]}</DialogTitle>
                        <DialogDescription className="text-responsive-sm">{descriptions[mode]}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLogin}>
                        <div className="grid gap-2 xs:gap-4 py-2 xs:py-4 space-mobile-2">
                            {mode === 'signup' && (
                                <div className="grid grid-cols-1 xs:grid-cols-4 items-center gap-2 xs:gap-4">
                                    <Label htmlFor="name" className="xs:text-right text-responsive-sm">Name</Label>
                                    <Input id="name" placeholder="Priya Singh" className="col-span-1 xs:col-span-3 h-9 sm:h-10 text-responsive-sm" required/>
                                </div>
                            )}
                            <div className="grid grid-cols-1 xs:grid-cols-4 items-center gap-2 xs:gap-4">
                                <Label htmlFor="email" className="xs:text-right text-responsive-sm">Email</Label>
                                <Input id="email" type="email" placeholder="priya@example.com" className="col-span-1 xs:col-span-3 h-9 sm:h-10 text-responsive-sm" required/>
                            </div>
                            {mode !== 'magic' && (
                                <div className="grid grid-cols-1 xs:grid-cols-4 items-center gap-2 xs:gap-4">
                                    <Label htmlFor="password" className="xs:text-right text-responsive-sm">Password</Label>
                                    <Input id="password" type="password" className="col-span-1 xs:col-span-3 h-9 sm:h-10 text-responsive-sm" required/>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="p-mobile-3">
                            <Button type="submit" className="w-full xs:w-auto h-9 sm:h-10 touch-target text-responsive-sm">
                                {mode === 'login' && <KeyRound className="mr-1 xs:mr-2 h-3 w-3 xs:h-4 xs:w-4" />}
                                {mode === 'signup' && <UserRound className="mr-1 xs:mr-2 h-3 w-3 xs:h-4 xs:w-4" />}
                                {mode === 'magic' && <Sparkles className="mr-1 xs:mr-2 h-3 w-3 xs:h-4 xs:w-4" />}
                                {mode === 'login' ? 'Log In' : mode === 'signup' ? 'Sign Up' : 'Send Magic Link'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
