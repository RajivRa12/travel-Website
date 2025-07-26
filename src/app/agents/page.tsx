
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { agents as allAgents } from "@/lib/data";
import { AgentCard } from "@/components/agent-card";

const AllAgentsHeader = () => (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
            <Link href="/" passHref>
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back</span>
                </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground font-headline">
                All Travel Agents
            </h1>
            <div className="w-10"></div>
        </div>
    </header>
);

export default function AllAgentsPage() {
    return (
        <div className="bg-background text-foreground">
            <div className="mx-auto max-w-4xl">
                <div className="flex min-h-screen w-full flex-col">
                    <AllAgentsHeader />
                    <main className="flex-1 overflow-y-auto p-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allAgents.map((agent) => (
                                <AgentCard key={agent.id} agent={agent} />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
