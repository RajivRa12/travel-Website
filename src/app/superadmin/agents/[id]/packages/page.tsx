"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowLeft } from "lucide-react";
import { packages as allPackages, agents } from "@/lib/data";

export default function SuperAdminAgentPackagesPage() {
    const params = useParams();
    const agentId = parseInt(params.id as string, 10);
    const agent = agents.find(a => a.id === agentId);
    const agentPackages = allPackages.filter(p => p.agentId === agentId);

    if (!agent) {
        return <p>Agent not found.</p>;
    }

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                 <Link href="/superadmin/agents" passHref>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Packages by {agent.name}</h1>
                    <p className="text-muted-foreground">A list of all packages submitted by this agent.</p>
                </div>
            </div>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Package Title</TableHead>
                                <TableHead>Destination</TableHead>
                                <TableHead>Price (INR)</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {agentPackages.map((pkg) => (
                                <TableRow key={pkg.id}>
                                    <TableCell className="font-medium">{pkg.title}</TableCell>
                                    <TableCell>{pkg.destination}</TableCell>
                                    <TableCell>
                                      <span className="rupee-font">₹</span>
                                      {pkg.price.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{pkg.rating}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/packages/${pkg.id}`} target="_blank">
                                            <Button variant="outline" size="sm">View Public Page</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
