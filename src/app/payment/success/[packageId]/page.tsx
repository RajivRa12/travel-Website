"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { packages as allPackages } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Home,
  Calendar,
  Users,
  MapPin,
  Phone,
  Star,
  Copy,
  Clock,
  CreditCard,
  Shield,
  Bell,
  FileText
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccessPage({ params }: { params: { packageId: string } }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get('ref');
  const pkg = allPackages.find(p => p.id === Number(params.packageId));
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  if (!pkg) return notFound();

  // Generate consistent booking details
  const bookingId = bookingRef || `RST${params.packageId.padStart(3, '0')}${Date.now().toString().slice(-6)}`;
  const confirmationNumber = `CNF-${Date.now().toString().slice(-8)}`;
  const bookingDate = new Date().toLocaleDateString('en-IN');
  const bookingTime = new Date().toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  useEffect(() => {
    // Try to get booking details from localStorage
    const storedDetails = localStorage.getItem('bookingDetails');
    if (storedDetails) {
      try {
        const details = JSON.parse(storedDetails);
        setBookingDetails(details);
      } catch (e) {
        console.error('Error parsing booking details:', e);
      }
    }
    
    // Store this successful booking for future reference
    const successfulBooking = {
      packageId: params.packageId,
      bookingId,
      confirmationNumber,
      bookingDate,
      bookingTime,
      packageTitle: pkg.title,
      destination: pkg.destination,
      price: pkg.price,
      status: 'confirmed'
    };
    
    localStorage.setItem('lastSuccessfulBooking', JSON.stringify(successfulBooking));

    // Show success toast if we have a booking reference
    if (bookingRef) {
      setTimeout(() => {
        toast({
          title: "🎉 Payment Successful!",
          description: `Booking confirmed! Reference: ${bookingId}`,
          duration: 6000,
        });
      }, 1500);
    }

    setIsLoading(false);
  }, [params.packageId, bookingId, confirmationNumber, bookingDate, bookingTime, pkg, bookingRef, toast]);

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    toast({
      title: "Copied!",
      description: "Booking ID copied to clipboard",
    });
  };

  const copyConfirmationNumber = () => {
    navigator.clipboard.writeText(confirmationNumber);
    toast({
      title: "Copied!",
      description: "Confirmation number copied to clipboard",
    });
  };

  const downloadReceipt = () => {
    toast({
      title: "Receipt Generated",
      description: "Your booking receipt has been downloaded",
    });
  };

  const emailReceipt = () => {
    toast({
      title: "Receipt Sent",
      description: "Booking receipt has been sent to your email",
    });
  };

  const totalAmount = bookingDetails 
    ? Math.round(parseFloat(pkg.price.replace(/,/g, '')) * parseInt(bookingDetails.numberOfTravelers || 1) * 1.18)
    : Math.round(parseFloat(pkg.price.replace(/,/g, '')) * 1.18);

  const baseAmount = bookingDetails 
    ? parseFloat(pkg.price.replace(/,/g, '')) * parseInt(bookingDetails.numberOfTravelers || 1)
    : parseFloat(pkg.price.replace(/,/g, ''));

  const taxAmount = Math.round(baseAmount * 0.18);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">🎉 Payment Successful!</h1>
          <p className="text-gray-600 mt-3 text-lg">Your booking has been confirmed and is ready to go!</p>
          
          {/* Status Badges */}
          <div className="flex justify-center gap-3 mt-6">
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Payment Confirmed
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Booking Secured
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Booking Confirmation Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Booking Info */}
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Booking Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                {/* Booking ID Section */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
                  <div className="text-center">
                    <h2 className="text-sm font-medium text-gray-600 mb-2">Your Booking ID</h2>
                    <div className="flex items-center justify-center gap-3">
                      <p className="text-3xl font-mono font-bold text-blue-600">{bookingId}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyBookingId}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Save this ID for future reference</p>
                  </div>
                </div>

                {/* Confirmation Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Booking Date
                      </span>
                      <span className="font-semibold">{bookingDate}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Booking Time
                      </span>
                      <span className="font-semibold">{bookingTime}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Status
                      </span>
                      <Badge className="bg-green-600 text-white">Confirmed</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Confirmation #</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{confirmationNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyConfirmationNumber}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Status
                      </span>
                      <Badge className="bg-green-600 text-white">Paid</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Travelers
                      </span>
                      <span className="font-semibold">
                        {bookingDetails?.numberOfTravelers || 1} {(bookingDetails?.numberOfTravelers || 1) === 1 ? 'Person' : 'People'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-green-800 mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package Price × {bookingDetails?.numberOfTravelers || 1}</span>
                      <span><span className="rupee-font">₹</span>{baseAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & Fees (18%)</span>
                      <span><span className="rupee-font">₹</span>{taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-green-200 pt-2 flex justify-between font-bold">
                      <span className="text-green-800">Total Paid</span>
                      <span className="text-green-800"><span className="rupee-font">₹</span>{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button onClick={downloadReceipt} className="flex-1" variant="default">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button onClick={emailReceipt} className="flex-1" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-blue-800">Instant Confirmation</h4>
                      <p className="text-sm text-blue-700">Booking confirmation email sent to {bookingDetails?.email || 'your email'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-green-800">Travel Coordinator Contact</h4>
                      <p className="text-sm text-green-700">Our team will contact you within 24 hours to discuss your itinerary</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-purple-800">E-Tickets & Documents</h4>
                      <p className="text-sm text-purple-700">Complete travel documents sent 48 hours before departure</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trip Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Trip Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      {pkg.rating}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{pkg.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{pkg.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{pkg.duration}</span>
                  </div>
                  {bookingDetails?.travelDate && (
                    <div className="flex items-center gap-2 text-blue-600 mt-1 font-medium">
                      <Clock className="h-4 w-4" />
                      <span>Travel: {new Date(bookingDetails.travelDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Booking Summary */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Package Price × {bookingDetails?.numberOfTravelers || 1}</span>
                      <span><span className="rupee-font">₹</span>{baseAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees (18%)</span>
                      <span><span className="rupee-font">₹</span>{taxAmount.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Paid</span>
                      <span className="text-green-600"><span className="rupee-font">₹</span>{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Customer Support */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Need Help?
                  </h4>
                  <div className="text-sm text-blue-700 mt-2 space-y-1">
                    <p><strong>Call:</strong> +91-8000-123-456</p>
                    <p><strong>Email:</strong> support@roamsoutheast.com</p>
                    <p><strong>Hours:</strong> 24/7 Support Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/my-trips">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                <Calendar className="h-5 w-5 mr-2" />
                View My Trips
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                <Home className="h-5 w-5 mr-2" />
                Explore More Trips
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Questions about your trip? Check our{" "}
            <Link href="/faq" className="text-blue-600 hover:underline">FAQ section</Link>{" "}
            or contact our 24/7 support team
          </p>
        </div>
      </div>
    </div>
  );
}
