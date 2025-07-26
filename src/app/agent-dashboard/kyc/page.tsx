
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Document = {
  name: string;
  type: string;
  status: "Pending" | "Verified";
  date: string;
};

export default function AgentKycPage() {
    const { toast } = useToast();
    const [documents, setDocuments] = React.useState<Document[]>([
        { name: "business_registration.pdf", type: "Business Registration", status: "Verified", date: "2023-10-15" },
        { name: "director_id.pdf", type: "Director ID Proof", status: "Pending", date: "2023-11-01" },
    ]);
    const [docType, setDocType] = React.useState("");
    const [file, setFile] = React.useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !docType) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please select a file and enter the document type.",
            });
            return;
        }

        const newDocument: Document = {
            name: file.name,
            type: docType,
            status: "Pending",
            date: new Date().toISOString().split('T')[0],
        };

        setDocuments(prevDocs => [...prevDocs, newDocument]);
        toast({
            title: "Document Uploaded",
            description: `${file.name} is now pending verification.`,
        });

        // Reset form
        setFile(null);
        setDocType("");
        (document.getElementById('file-upload') as HTMLInputElement).value = "";
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">KYC Status</h1>
                    <p className="text-muted-foreground">Manage your verification documents.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                         <CardHeader>
                            <CardTitle>Uploaded Documents</CardTitle>
                            <CardDescription>A list of your submitted documents and their status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Document Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Upload Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.map((doc, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium flex items-center gap-2"><FileText className="h-4 w-4"/> {doc.name}</TableCell>
                                            <TableCell>{doc.type}</TableCell>
                                            <TableCell>{doc.date}</TableCell>
                                            <TableCell>
                                                <Badge variant={doc.status === 'Verified' ? "default" : "secondary"} className={doc.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                                                    {doc.status === 'Verified' ? <CheckCircle className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
                                                    {doc.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    <Card>
                         <CardHeader>
                            <CardTitle>Upload New Document</CardTitle>
                            <CardDescription>Submit documents for verification.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <Label htmlFor="doc-type">Document Type</Label>
                                    <Input id="doc-type" placeholder="e.g. ID Proof" value={docType} onChange={(e) => setDocType(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="file-upload">File</Label>
                                    <Input id="file-upload" type="file" onChange={handleFileChange} />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
