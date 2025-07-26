"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { packages as allPackages } from "@/lib/data";
import { notFound } from "next/navigation";
import { AuthCheck } from "./auth-check";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, MapPin, Clock, ArrowLeft, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BookingDetailsPage({ params }: { params: { packageId: string } }) {
  const router = useRouter();
  // Next.js 15+ params may be a promise, so unwrap with React.use if needed
  let packageId: string;
  // Type guard for promise
  if (typeof (params as any).then === "function") {
    const unwrapped = React.use(params as unknown as Promise<{ packageId: string }>);
    packageId = unwrapped?.packageId;
  } else {
    packageId = params.packageId;
  }
  const pkg = allPackages.find(p => p.id === Number(packageId));
  
  if (!pkg) return notFound();

  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    
    // Travel Details
    travelDate: "",
    numberOfTravelers: "1",
    roomType: "",
    specialRequests: "",
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    
    // Additional Services
    airportPickup: false,
    travelInsurance: false,
    extraMeals: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProceedToPayment = () => {
    setIsLoading(true);
    
    // Store booking details in localStorage
    localStorage.setItem('bookingDetails', JSON.stringify(formData));
    
    // Navigate to payment gateway
    router.push(`/payment/gateway/${pkg.id}`);
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phone && formData.travelDate;

  return (
    <AuthCheck packageId={packageId}>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Packages
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Please fill in your details to proceed with the booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Travel Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Travel Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="travelDate">Travel Date *</Label>
                    <Input
                      id="travelDate"
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => handleInputChange("travelDate", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="numberOfTravelers">Number of Travelers</Label>
                    <Select value={formData.numberOfTravelers} onValueChange={(value) => handleInputChange("numberOfTravelers", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Person' : 'People'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="roomType">Room Type Preference</Label>
                  <Select value={formData.roomType} onValueChange={(value) => handleInputChange("roomType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Room</SelectItem>
                      <SelectItem value="double">Double Room</SelectItem>
                      <SelectItem value="twin">Twin Sharing</SelectItem>
                      <SelectItem value="family">Family Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                    placeholder="Any dietary requirements, accessibility needs, or special requests"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proceed Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={handleProceedToPayment}
                  disabled={!isFormValid || isLoading}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  You will be redirected to secure payment gateway
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Package Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <div>
                  <h3 className="font-bold text-lg">{pkg.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{pkg.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Package Price</span>
                    <span><span className="rupee-font">₹</span>{pkg.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Travelers</span>
                    <span>{formData.numberOfTravelers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span><span className="rupee-font">₹</span>{(parseFloat(pkg.price.replace(/,/g, '')) * parseInt(formData.numberOfTravelers)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span><span className="rupee-font">₹</span>{Math.round(parseFloat(pkg.price.replace(/,/g, '')) * parseInt(formData.numberOfTravelers) * 0.18).toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span><span className="rupee-font">₹</span>{Math.round(parseFloat(pkg.price.replace(/,/g, '')) * parseInt(formData.numberOfTravelers) * 1.18).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Free Cancellation</strong> up to 24 hours before travel date
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </AuthCheck>
  );
}
