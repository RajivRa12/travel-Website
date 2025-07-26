"use client";

import * as React from "react";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Trip = {
    id: string;
    packageName: string;
    customerName: string;
    tripDate: string;
    totalPaid: number;
    status: "Completed" | "Ongoing";
};

const bookedTrips: Trip[] = [
    { id: 'BOOK-101', packageName: "Enchanting Bali Getaway", customerName: "Rohan Patel", tripDate: "2024-04-10", totalPaid: 90000, status: "Completed" },
    { id: 'BOOK-102', packageName: "Bangkok & Pattaya Discovery", customerName: "Anika Sharma", tripDate: "2024-04-25", totalPaid: 70000, status: "Completed" },
    { id: 'BOOK-103', packageName: "Highlights of Vietnam", customerName: "Vikram Singh", tripDate: "2024-05-05", totalPaid: 84000, status: "Ongoing" },
    { id: 'BOOK-104', packageName: "Singapore City Spectacular", customerName: "Priya Rao", tripDate: "2024-05-15", totalPaid: 110000, status: "Ongoing" },
];

const calculatePayout = (trip: Trip) => {
    const totalCommission = trip.totalPaid * 0.9; // Assuming a 10% platform fee

    if (trip.status === "Completed") {
        return totalCommission; 
    }
    
    // For ongoing trips, release 50% after the trip start date has passed
    if (trip.status === "Ongoing" && new Date(trip.tripDate) < new Date()) {
        return totalCommission / 2;
    }

    // No payout available yet for future trips or other statuses
    return 0;
};

export default function RequestPayoutPage() {
    const { toast } = useToast();
    const [selectedTrips, setSelectedTrips] = React.useState<Set<string>>(new Set());

    const toggleTripSelection = (tripId: string) => {
        setSelectedTrips(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(tripId)) {
                newSelection.delete(tripId);
            } else {
                newSelection.add(tripId);
            }
            return newSelection;
        });
    };
    
    const availablePayouts = bookedTrips.map(trip => ({ ...trip, payout: calculatePayout(trip)}));
    const totalAvailable = availablePayouts.reduce((sum, trip) => sum + trip.payout, 0);

    const handleRequestPayout = () => {
        toast({
            title: "Payout Requested Successfully!",
            description: `A request for ₹${totalAvailable.toLocaleString()} has been submitted.`,
        });
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/agent-dashboard/payouts" passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Request Payout</h1>
                        <p className="text-muted-foreground">Review your eligible trip earnings and request a payout.</p>
                    </div>
                </div>
                <Button onClick={handleRequestPayout} size="lg" disabled={totalAvailable === 0}>
                    Request Payout ({`₹${totalAvailable.toLocaleString()}`})
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Eligible Trips</CardTitle>
                    <CardDescription>Payouts for ongoing trips are released 50% after the trip start date. The rest is released upon completion.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Booking ID</TableHead>
                                <TableHead>Package & Customer</TableHead>
                                <TableHead>Trip Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Available Payout (INR)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {availablePayouts.map((trip) => (
                                <TableRow key={trip.id} className={trip.payout === 0 ? 'opacity-50' : ''}>
                                    <TableCell>{trip.id}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{trip.packageName}</div>
                                        <div className="text-sm text-muted-foreground">{trip.customerName}</div>
                                    </TableCell>
                                    <TableCell>{trip.tripDate}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {trip.status === "Completed" ? <CheckCircle className="h-4 w-4 text-green-500"/> : <Clock className="h-4 w-4 text-amber-500"/>}
                                            {trip.status}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                      <span className="rupee-font">₹</span>
                                      {trip.payout.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                             <TableRow className="bg-muted/50 font-bold">
                                <TableCell colSpan={4} className="text-right">Total Available</TableCell>
                                <TableCell className="text-right text-lg">
                                  <span className="rupee-font">₹</span>
                                  {totalAvailable.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
