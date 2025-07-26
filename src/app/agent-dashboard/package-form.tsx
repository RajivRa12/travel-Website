
"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { packages, destinations as allDestinations } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, PlusCircle, Trash2 } from "lucide-react";

type Package = (typeof packages)[0];

const packageSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  destination: z.string().min(1, "Please select a destination"),
  duration: z.string().min(1, "Duration is required"),
  price: z.string().regex(/^\d+(,\d{3})*$/, "Price must be a number"),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  itinerary: z.array(z.object({
      day: z.number(),
      title: z.string().min(3, "Day title is required"),
      description: z.string().min(10, "Day description is required")
  })),
  isActive: z.boolean(),
});

type PackageFormData = z.infer<typeof packageSchema>;

const ItineraryDayInput = ({ day, title, description, onUpdate, onRemove }: { day: number, title: string, description: string, onUpdate: (field: string, value: string) => void, onRemove: () => void }) => (
    <div className="p-4 border rounded-lg space-y-4 relative">
        <Label className="font-bold">Day {day}</Label>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
        </Button>
        <div>
            <Label htmlFor={`itinerary-title-${day}`}>Title</Label>
            <Input id={`itinerary-title-${day}`} value={title} onChange={(e) => onUpdate('title', e.target.value)} placeholder="e.g., Arrival in Bangkok" />
        </div>
        <div>
            <Label htmlFor={`itinerary-desc-${day}`}>Description</Label>
            <Textarea id={`itinerary-desc-${day}`} value={description} onChange={(e) => onUpdate('description', e.target.value)} placeholder="Describe the day's activities" />
        </div>
    </div>
);

const InclusionExclusionInput = ({ items, onUpdate, onAddItem, label }: { items: string[], onUpdate: (index: number, value: string) => void, onAddItem: () => void, label: string }) => (
    <div className="space-y-2">
        <Label className="font-bold">{label}</Label>
        {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
                <Input value={item} onChange={(e) => onUpdate(index, e.target.value)} placeholder={`Enter an ${label.toLowerCase().slice(0,-1)}`} />
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => onUpdate(index, 'DELETE')}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ))}
        <Button variant="outline" size="sm" onClick={onAddItem}><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
    </div>
);


export function PackageForm({ existingPackage }: { existingPackage?: Package }) {
    const router = useRouter();
    const { toast } = useToast();
    const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<PackageFormData>({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            title: existingPackage?.title || "",
            destination: existingPackage?.destination || "",
            duration: existingPackage?.duration || "",
            price: existingPackage?.price || "",
            inclusions: ["Airport transfers", "Accommodation", "Breakfast"],
            exclusions: ["Flights", "Visa", "Lunch & Dinner"],
            itinerary: [
                { day: 1, title: "Arrival", description: "Arrive and check in." },
                { day: 2, title: "City Tour", description: "Explore the city." },
            ],
            isActive: true,
        },
    });

    const itinerary = watch('itinerary');
    const inclusions = watch('inclusions');
    const exclusions = watch('exclusions');

    const handleItineraryUpdate = (index: number, field: string, value: string) => {
        const newItinerary = [...itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setValue('itinerary', newItinerary, { shouldValidate: true });
    };

    const addItineraryDay = () => {
        const newDay = { day: itinerary.length + 1, title: '', description: ''};
        setValue('itinerary', [...itinerary, newDay]);
    };

    const removeItineraryDay = (index: number) => {
        const newItinerary = itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }));
        setValue('itinerary', newItinerary);
    };

    const handleInclusionExclusionUpdate = (type: 'inclusions' | 'exclusions', index: number, value: string) => {
        const items = watch(type);
        const newItems = [...items];
        if (value === 'DELETE') {
            newItems.splice(index, 1);
        } else {
            newItems[index] = value;
        }
        setValue(type, newItems, { shouldValidate: true });
    }

    const addInclusionExclusionItem = (type: 'inclusions' | 'exclusions') => {
        const items = watch(type);
        setValue(type, [...items, '']);
    }

    const onSubmit = (data: PackageFormData) => {
        console.log(data); // In a real app, you would send this to your backend
        toast({
            title: `Package ${existingPackage ? 'Updated' : 'Created'}!`,
            description: `"${data.title}" has been successfully saved.`,
        });
        router.push('/agent-dashboard');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">{existingPackage ? 'Edit Package' : 'Create New Package'}</h1>
                    <p className="text-muted-foreground">Fill in the details below.</p>
                </div>
                <Button type="submit" size="lg">
                    <Save className="mr-2 h-4 w-4" />
                    {existingPackage ? 'Save Changes' : 'Publish Package'}
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Core Details</CardTitle>
                            <CardDescription>The main information for your travel package.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Package Title</Label>
                                <Input id="title" {...register("title")} />
                                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="destination">Destination</Label>
                                    <Controller
                                        name="destination"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select destination" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allDestinations.filter(d => d.name !== 'All').map(dest => (
                                                        <SelectItem key={dest.name} value={dest.name}>{dest.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.destination && <p className="text-destructive text-sm mt-1">{errors.destination.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input id="duration" {...register("duration")} placeholder="e.g., 5 Days" />
                                    {errors.duration && <p className="text-destructive text-sm mt-1">{errors.duration.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="price">Price (INR)</Label>
                                    <Input id="price" {...register("price")} placeholder="e.g., 35,000" />
                                    {errors.price && <p className="text-destructive text-sm mt-1">{errors.price.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Day-by-Day Itinerary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {itinerary.map((item, index) => (
                                <ItineraryDayInput 
                                    key={index}
                                    day={item.day}
                                    title={item.title}
                                    description={item.description}
                                    onUpdate={(field, value) => handleItineraryUpdate(index, field, value)}
                                    onRemove={() => removeItineraryDay(index)}
                                />
                            ))}
                            <Button type="button" variant="outline" onClick={addItineraryDay}><PlusCircle className="mr-2 h-4 w-4" /> Add Day</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center space-x-2">
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                         <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <Label htmlFor="isActive">Package is Active</Label>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">If disabled, this package will not be visible to customers.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Inclusions & Exclusions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <InclusionExclusionInput items={inclusions} onUpdate={(index, value) => handleInclusionExclusionUpdate('inclusions', index, value)} onAddItem={() => addInclusionExclusionItem('inclusions')} label="Inclusions" />
                             <InclusionExclusionInput items={exclusions} onUpdate={(index, value) => handleInclusionExclusionUpdate('exclusions', index, value)} onAddItem={() => addInclusionExclusionItem('exclusions')} label="Exclusions" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
