import * as React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { packages, agents as allAgents } from "@/lib/data";
import { AgentPageClientContent } from "./client-page";

const AgentHeader = () => (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-2 sm:p-4">
            <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sr-only">Back</span>
                </Button>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-foreground font-headline">
                Agent Profile
            </h1>
            <div className="w-8 sm:w-10"></div>
        </div>
    </header>
);

export default function AgentProfilePage({ params }: { params: { id: string } }) {
    const agentId = parseInt(params.id, 10);
    const agent = allAgents.find(a => a.id === agentId);
    const agentPackages = packages.filter(p => p.agentId === agentId);

    if (!agent) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Agent not found.
            </div>
        );
    }
    
    return (
        <div className="bg-background text-foreground">
            <div className="mx-auto max-w-6xl">
                <div className="flex min-h-screen w-full flex-col">
                    <AgentHeader />
                    <div className="px-2 sm:px-4">
                        <AgentPageClientContent agent={agent} agentPackages={agentPackages} />
                    </div>
                </div>
            </div>
        </div>
    );
}
