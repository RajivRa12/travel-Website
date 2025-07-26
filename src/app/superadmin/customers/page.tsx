
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function SuperAdminCustomersPage() {
    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">All Customers</h1>
                    <p className="text-muted-foreground">View and manage all registered customer accounts.</p>
                </div>
            </div>
            <Card className="flex-1">
                 <CardHeader>
                    <CardTitle>Customer Database</CardTitle>
                    <CardDescription>This feature is coming soon.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center py-20">
                     <Users className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold font-headline">No Customer Data</h2>
                    <p className="text-muted-foreground mt-2">Customer account information will appear here.</p>
                </CardContent>
            </Card>
        </>
    );
}
