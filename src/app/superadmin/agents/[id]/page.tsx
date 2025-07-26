
"use client";

import * as React from "react";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Phone, Globe, Star, Save, Edit, Banknote, Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { agents as allAgents } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function SuperAdminAgentDetailPage() {
    const params = useParams();
    const { toast } = useToast();
    const agentId = parseInt(params.id as string, 10);
    const agent = allAgents.find(a => a.id === agentId);

    // State for editable fields
    const [phone, setPhone] = React.useState(agent?.phone || "");
    const [email, setEmail] = React.useState(agent?.email || "");

    const handleSaveChanges = () => {
        toast({
            title: "Details Saved",
            description: "The agent's contact information has been updated.",
        });
    };

    const handleBankUpdate = () => {
        toast({
            title: "Bank Details Updated",
            description: "The request to update bank details has been logged.",
        });
    }

    if (!agent) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Agent not found.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/superadmin/agents" passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Agent Details</h1>
                        <p className="text-muted-foreground">Viewing and editing details for {agent.name}.</p>
                    </div>
                </div>
                <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" /> Save All Changes
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-6">
                                <Avatar className="w-24 h-24 border-4 border-primary">
                                    <AvatarImage src={agent.logo} data-ai-hint={agent.hint} />
                                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-3xl">{agent.name}</CardTitle>
                                    <CardDescription>{agent.specialty}</CardDescription>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Star className="h-5 w-5 text-accent fill-current" />
                                        <span className="font-bold">{agent.rating}</span>
                                        <span className="text-sm text-muted-foreground">({agent.reviews} reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{agent.description}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>Edit agent's contact details below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="pl-10" />
                                    </div>
                                </div>
                                 <div>
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input id="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="website" value={agent.website} disabled className="pl-10" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle>Bank Details</CardTitle>
                            <CardDescription>View and manage payout bank account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-xs text-muted-foreground">Account Number</Label>
                                <p className="font-mono text-lg">**** **** **5432</p>
                            </div>
                             <div>
                                <Label className="text-xs text-muted-foreground">IFSC Code</Label>
                                <p className="font-mono text-lg">ABCDEF12345</p>
                            </div>
                             <div>
                                <Label className="text-xs text-muted-foreground">Bank Name</Label>
                                <p className="font-semibold">Global Bank Ltd.</p>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        <Edit className="mr-2 h-4 w-4" /> Update Bank Details
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Update Bank Account</DialogTitle>
                                        <DialogDescription>
                                            Enter new details and upload proof for verification. This action will be logged.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                         <div>
                                            <Label htmlFor="account-no">New Account Number</Label>
                                            <Input id="account-no" placeholder="Enter new account number" />
                                        </div>
                                         <div>
                                            <Label htmlFor="ifsc">New IFSC Code</Label>
                                            <Input id="ifsc" placeholder="Enter new IFSC code" />
                                        </div>
                                         <div>
                                            <Label htmlFor="comment">Reason for Change (Comment)</Label>
                                            <Textarea id="comment" placeholder="e.g., Agent requested change due to account closure." />
                                        </div>
                                        <div>
                                            <Label htmlFor="proof">Upload Proof</Label>
                                            <Input id="proof" type="file" />
                                            <p className="text-xs text-muted-foreground mt-1">e.g., Scanned copy of a cancelled cheque.</p>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">Cancel</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button onClick={handleBankUpdate}>
                                                <Save className="mr-2 h-4 w-4"/> Submit for Verification
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
