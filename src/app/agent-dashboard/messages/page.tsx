
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function AgentMessagesPage() {
    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Messages</h1>
                    <p className="text-muted-foreground">Communicate with your customers directly.</p>
                </div>
            </div>
             <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Inbox</CardTitle>
                    <CardDescription>This feature is coming soon.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center py-20">
                     <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold font-headline">No Messages</h2>
                    <p className="text-muted-foreground mt-2">Your conversations with customers will appear here.</p>
                </CardContent>
            </Card>
        </>
    );
}
