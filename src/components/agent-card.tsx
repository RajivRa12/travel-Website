
"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { agents } from "@/lib/data";

type Agent = (typeof agents)[0];

export const AgentCard = ({ agent }: { agent: Agent }) => {
    return (
        <Link href={`/agents/${agent.id}`} passHref>
            <Card className="overflow-hidden border-none shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col h-full">
                <CardContent className="p-4 flex flex-col flex-grow items-center text-center">
                    <Avatar className="w-20 h-20 mb-4 border-4 border-primary">
                        <AvatarImage src={agent.logo} data-ai-hint={agent.hint} />
                        <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-headline text-lg font-bold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{agent.specialty}</p>
                    <div className="flex items-center gap-1 mt-2">
                        <Star className="h-5 w-5 text-accent fill-current" />
                        <span className="font-bold">{agent.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">({agent.reviews} reviews)</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
